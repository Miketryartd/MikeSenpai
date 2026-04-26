import { useEffect, useState } from "react";
import { useTopRated } from "../Hooks/useTopRated";
import type { AniData } from "../Types/Interface";
import { Link } from "react-router";

function Hero() {
  const { results, loading } = useTopRated();
  const [index, setIndex] = useState<number | null>(null);

  useEffect(() => {
    if (results.length > 0) {
      setIndex(Math.floor(Math.random() * results.length));
    }
  }, [results]);

  if (loading || index === null) return null;

  const featured: AniData = results[index];

  return (
    <div className="relative h-120 w-full overflow-hidden">

   
      <img
        src={featured.ImagePath}
        className="absolute inset-0 w-full h-full object-cover blur-md scale-110"
      />

     
      <div className="absolute inset-0 bg-black/60" />


      <div className="relative z-10 flex items-center justify-between h-full px-10">

     
        <div className="max-w-xl text-white">
          <h1 className="text-4xl md:text-5xl font-bold">
            {featured.Name}
          </h1>

          <p className="mt-4 line-clamp-3 text-gray-300">
            {featured.DescripTion}
          </p>

        <div className="mt-10">
        <Link to={`/Detail/${featured._id}/${featured.finder}`} className="cursor-pointer mt-6 bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded">
             Watch Now
          </Link>
        </div>
        </div>

      
        <div className="hidden md:flex h-full items-center">
          <img
            src={featured.ImagePath}
            className="h-[80%] object-contain drop-shadow-2xl"
          />
        </div>

      </div>
    </div>
  );
}

export default Hero;