import { useState } from "react";
import { useFeaturedAnime } from "../Hooks/useFeaturedAnime";

import WatchOverlay from "./WatchOverlay";

const ITEMS_PER_PAGE = 15;

function Featured() {
  const { animeList, isLoading, error } = useFeaturedAnime();
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(animeList.length / ITEMS_PER_PAGE);
  const start = currentPage * ITEMS_PER_PAGE;
  const visibleAnime = animeList.slice(start, start + ITEMS_PER_PAGE);

  if (isLoading) return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 p-4">
      {Array(12).fill(null).map((_, i) => (
        <div key={i} className="rounded-lg overflow-hidden bg-gray-800 animate-pulse">
          <div className="aspect-[2/3] bg-gray-700" />
          <div className="p-2 space-y-1">
            <div className="h-2 bg-gray-700 rounded w-4/5" />
            <div className="h-2 bg-gray-700 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );

  if (error) return <p className="text-red-400 text-sm p-4">{error}</p>;

  return (
    <div className="p-4">

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">Binge Worthy</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{currentPage + 1} / {totalPages}</span>
          <button
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 0}
            className="w-7 h-7 cursor-pointer flex items-center justify-center rounded border border-purple-700 text-white hover:bg-purple-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm"
          >‹</button>
          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === totalPages - 1}
            className="w-7 h-7 cursor-pointer flex items-center justify-center rounded border border-purple-700 text-white hover:bg-purple-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm"
          >›</button>
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
        {visibleAnime.map((anime) => (

          <WatchOverlay id={anime._id} finder={anime.Name}>
          <div
           
            key={anime._id}
            className="group bg-[#16162a] border border-[#2d2d4a] rounded-lg overflow-hidden
                       hover:border-purple-600 hover:-translate-y-1 transition-all duration-200 cursor-pointer"
          >
       
            <div className="relative aspect-[2/3] bg-gray-800 overflow-hidden">
              <img
                src={anime.ImagePath}
                alt={anime.Name}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            
              <span className="absolute bottom-1.5 right-1.5 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
                {anime.epCount ?? "?"} eps
              </span>
           
              <span className="absolute top-1.5 left-1.5 flex items-center gap-0.5 bg-black/70 text-yellow-400 text-[10px] px-1.5 py-0.5 rounded">
                ★ {anime.MALScore}
              </span>

              <span className="absolute top-1.5 right-1.5 flex items-center gap-0.5 bg-black/70 text-purple-400 text-[10px] px-1.5 py-0.5 rounded">
                 {anime.Duration}
              </span>
            </div>

            
            <div className="p-1.5">
              <p className="text-xs font-medium text-white truncate">{anime.Name}</p>
             <div className="flex flex-row gap-2">
               <p className="text-[10px] text-gray-500 truncate mt-0.5">
                {anime.Genres?.slice(0, 2).join(", ")}
              </p>
              
              <p className="text-[10px] text-gray-500 truncate mt-0.5">{anime.Premiered}</p>
              </div>
            </div>
          </div>
          </WatchOverlay>
        ))}
      </div>

    </div>
  );
}

export default Featured;