import { useState } from "react";
import { useFeaturedAnime } from "../Hooks/useFeaturedAnime";

const ITEMS_PER_PAGE = 15;

function Featured() {
  const { animeList, isLoading, error } = useFeaturedAnime();
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(animeList.length / ITEMS_PER_PAGE);
  const start = currentPage * ITEMS_PER_PAGE;
  const visibleAnime = animeList.slice(start, start + ITEMS_PER_PAGE);

  if (isLoading) return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 p-4">
      {Array(5).fill(null).map((_, i) => (
        <div key={i} className="rounded-xl overflow-hidden bg-gray-800 animate-pulse">
          <div className="aspect-[2/3] bg-gray-700" />
          <div className="p-3 space-y-2">
            <div className="h-3 bg-gray-700 rounded w-4/5" />
            <div className="h-3 bg-gray-700 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );

  if (error) return <p className="text-red-400 text-sm p-4">{error}</p>;

  return (
    <div className="p-4">

     
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold text-white">Binge Worthy</h2>

        <div className="flex items-center gap-2">
          {/* Page info */}
          <span className="text-xs text-gray-400 mr-2">
            {currentPage + 1} / {totalPages}
          </span>

     
          <button
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 0}
            className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-lg border border-purple-500 text-white hover:bg-gray-700  hover:border-purple-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ‹
          </button>

      
          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === totalPages - 1}
           className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-lg border border-purple-500 text-white hover:bg-gray-700  hover:border-purple-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ›
          </button>
        </div>
      </div>


      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {visibleAnime.map((anime) => (
          <div
            key={anime._id}
            className="group rounded-xl overflow-hidden bg-gray-800 border border-gray-700 hover:border-gray-500 hover:-translate-y-1 transition-all duration-200 cursor-pointer"
          >
            <div className="relative aspect-[2/3] bg-gray-700 overflow-hidden">
              <img
                src={anime.ImagePath}
                alt={anime.Name}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[11px] px-2 py-0.5 rounded">
                {anime.epCount} eps
              </span>
            </div>
            <div className="p-3">
              <p className="text-sm font-medium text-white truncate">{anime.Name}</p>
              <p className="text-xs text-gray-400 mt-1">⭐ {anime.MALScore}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Featured;