import { useParams } from "react-router-dom";
import { useAnimeDetails } from "../Hooks/useAnimeDetail";
import { useState } from "react";
import NavHeader from "../Components/Nav";
import EpisodeList from "../Components/EpisodeList";
import Stream from "../Components/Stream";
import CommentSection from "../Components/CommentSection";


const DetailSkeleton = () => (
  <div className="bg-[#0d0d14] min-h-screen text-white">
    <NavHeader />

    
    <div className="relative w-full h-[400px] bg-gray-800 animate-pulse">

      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="w-36 h-12 bg-gray-700 rounded-lg" />
      </div>

     
      <div className="absolute bottom-0 left-0 p-6 flex items-end gap-6 z-10">
        <div className="w-40 h-56 bg-gray-700 rounded-lg" />
        <div className="space-y-3 pb-2">
          <div className="h-6 w-48 bg-gray-700 rounded" />
          <div className="h-3 w-32 bg-gray-700 rounded" />
          <div className="h-3 w-40 bg-gray-700 rounded" />
        </div>
      </div>
    </div>

    
    <div className="p-6 grid md:grid-cols-3 gap-6">

   
      <div className="md:col-span-2 space-y-3">
        <div className="h-5 w-24 bg-gray-700 rounded animate-pulse" />
        <div className="space-y-2">
          <div className="h-3 w-full bg-gray-800 rounded animate-pulse" />
          <div className="h-3 w-5/6 bg-gray-800 rounded animate-pulse" />
          <div className="h-3 w-4/6 bg-gray-800 rounded animate-pulse" />
          <div className="h-3 w-full bg-gray-800 rounded animate-pulse" />
          <div className="h-3 w-3/6 bg-gray-800 rounded animate-pulse" />
        </div>
      </div>

      <div className="bg-[#1a1a24] p-4 rounded-lg space-y-3 animate-pulse">
        <div className="h-5 w-28 bg-gray-700 rounded" />
        {Array(7).fill(null).map((_, i) => (
          <div key={i} className="h-3 bg-gray-700 rounded w-3/4" />
        ))}
      </div>
    </div>

    <div className="p-6 space-y-4">
      <div className="w-full h-64 bg-gray-800 rounded-lg animate-pulse" />
      <div className="h-5 w-32 bg-gray-700 rounded animate-pulse" />
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
        {Array(16).fill(null).map((_, i) => (
          <div key={i} className="h-9 bg-gray-800 rounded animate-pulse" />
        ))}
      </div>
    </div>
  </div>
);

function Detail() {
  const { id } = useParams();
  const { loading, result, error } = useAnimeDetails(id);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);

  if (loading) return <DetailSkeleton />;
  if (error) return (
    <div className="bg-[#0d0d14] min-h-screen flex items-center justify-center">
      <p className="text-red-400 text-sm">{error}</p>
    </div>
  );
  if (!result) return (
    <div className="bg-[#0d0d14] min-h-screen flex items-center justify-center">
      <p className="text-gray-400 text-sm">No data found.</p>
    </div>
  );

  const anime = result.local;

  return (
    <div className="bg-[#0d0d14] min-h-screen text-white">

    
      <NavHeader />

      
      <div className="relative w-full h-[400px]">
        <img
          src={anime?.Cover || anime?.ImagePath}
          alt="cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

   
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <a
            href="#watch-section"
            className="cursor-pointer flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold shadow-lg hover:scale-105 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M6 4v16a1 1 0 0 0 1.524 .852l13 -8a1 1 0 0 0 0 -1.704l-13 -8a1 1 0 0 0 -1.524 .852z" />
            </svg>
            Watch Now
          </a>
        </div>

     
        <div className="absolute bottom-0 left-0 p-4 sm:p-6 flex items-end gap-4 sm:gap-6 z-10">
          <img
            src={anime?.ImagePath}
            alt={anime?.Name}
            className="w-24 sm:w-40 rounded-lg shadow-lg"
          />
          <div>
            <h1 className="text-xl sm:text-3xl font-bold">{anime?.Name}</h1>
            <p className="text-xs sm:text-sm text-gray-300">
              {anime?.Aired} • {anime?.Duration}
            </p>
            <p className="text-xs sm:text-sm text-purple-400">
              {anime?.Genres?.join(", ")}
            </p>
          </div>
        </div>
      </div>

   
      <div className="p-6 grid md:grid-cols-3 gap-6">

       
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold text-purple-400">Synopsis</h2>
          <p className="text-gray-300 leading-relaxed">
            {anime?.DescripTion || "No description available."}
          </p>
        </div>

   
        <div className="bg-[#1a1a24] p-4 rounded-lg space-y-2">
          <h2 className="text-lg font-semibold text-purple-400">Information</h2>
          <p><span className="text-gray-400">Studios:</span> {anime?.Studios}</p>
          <p><span className="text-gray-400">Producers:</span> {anime?.Producers}</p>
          <p><span className="text-gray-400">Premiered:</span> {anime?.Premiered}</p>
          <p><span className="text-gray-400">Status:</span> {anime?.Status}</p>
          <p><span className="text-gray-400">Episodes:</span> {anime?.epCount}</p>
          <p><span className="text-gray-400">Duration:</span> {anime?.Duration}</p>
          <p><span className="text-gray-400">Genre(s):</span> {anime?.Genres?.slice(0, 2).join(", ")}</p>
          <p><span className="text-gray-400">Score:</span> {anime?.MALScore}</p>
        </div>
      </div>

     
      <div>
        <div>
          <Stream currentVideo={currentVideo} />
        </div>
        <div id="watch-section" className="mt-10">
          <EpisodeList onSelectEp={setCurrentVideo} />
        </div>
        <div className="mt-10 p-10">
          <CommentSection />
        </div>
      </div>

    </div>
  );
}

export default Detail;