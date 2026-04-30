
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DynamicUrl } from "../Utils/DynamicUrl";

interface HeroAnime {
  title: string;
  image: string;
  cover: string;
  description: string;
  type: string;
  rating: number;
  id: string;
}

function Hero() {
  const [featured, setFeatured] = useState<HeroAnime | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHeroData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${DynamicUrl()}/mikesenpai/api/animekai/top-rated?page=1`);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
          const randomIndex = Math.floor(Math.random() * Math.min(10, data.results.length));
          const selected = data.results[randomIndex];
          
          setFeatured({
            title: selected.title,
            image: selected.image,
            cover: selected.cover || selected.image,
            description: selected.description || "No description available.",
            type: selected.type || "TV",
            rating: selected.rating || 0,
            id: selected.id
          });
        } else {
          throw new Error("No results found");
        }
      } catch (err) {
        console.error("Failed to fetch hero data:", err);
        setError("Failed to load featured anime");
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  if (loading) {
    return (
      <div className="relative h-[500px] w-full overflow-hidden bg-gray-800 animate-pulse">
        <div className="absolute inset-0 bg-gray-700" />
      </div>
    );
  }

  if (error || !featured) {
    return (
      <div className="relative h-[400px] w-full overflow-hidden bg-gradient-to-r from-purple-900/50 to-pink-900/50">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Mike Senpai</h1>
            <p className="text-gray-300">Discover and stream your favorite anime</p>
          </div>
        </div>
      </div>
    );
  }

  const slug = featured.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

  return (
    <div className="relative h-[500px] w-full overflow-hidden">
      <img
        src={featured.cover}
        alt={featured.title}
        className="absolute inset-0 w-full h-full object-cover blur-md scale-110"
        onError={(e) => {
          (e.target as HTMLImageElement).src = featured.image;
        }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d14] via-black/60 to-black/40" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between h-full px-6 md:px-12 lg:px-20">
        <div className="max-w-2xl text-white text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-4">
            <span className="text-xs bg-purple-600 px-3 py-1 rounded-full font-semibold tracking-wide">
              FEATURED
            </span>
            <span className="text-xs bg-yellow-600/80 px-3 py-1 rounded-full flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              {featured.rating}
            </span>
            <span className="text-xs bg-purple-900/80 px-3 py-1 rounded-full">
              {featured.type}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            {featured.title}
          </h1>
          
          <p className="text-gray-300 text-sm md:text-base line-clamp-3 max-w-xl mx-auto md:mx-0">
            {featured.description.length > 200 
              ? featured.description.slice(0, 200) + "..." 
              : featured.description}
          </p>
          
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <Link 
              to={`/Detail/${encodeURIComponent(featured.id)}/${slug}`}
              className="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 4v16a1 1 0 0 0 1.524.852l13-8a1 1 0 0 0 0-1.704l-13-8A1 1 0 0 0 6 4z"/>
              </svg>
              Watch Now
            </Link>
            
            <Link 
              to={`/Detail/${encodeURIComponent(featured.id)}/${slug}`}
              className="inline-flex items-center justify-center gap-2 border border-purple-600 hover:bg-purple-600/20 px-6 py-3 rounded-lg font-semibold transition-all duration-300"
            >
              More Info
            </Link>
          </div>
        </div>

        <div className="hidden lg:block">
          <img 
            src={featured.image} 
            alt={featured.title}
            className="w-64 h-auto rounded-xl shadow-2xl border-2 border-purple-500/50 hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://placehold.co/300x450?text=No+Image';
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Hero;