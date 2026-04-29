// frontend/src/Components/AnimeKaiRecentlyAdded.tsx
import { useState, useRef } from "react";
import { useAnimeKaiRecentlyAdded } from "../Hooks/useAnimeKaiRecentlyAdded";
import WatchOverlay from "./WatchOverlay";
import type { AnimeKaiAnime } from "../Types/AnimeKaiTypes";

function AnimeKaiRecentlyAdded() {
  const [page] = useState(1);  // Changed from setPage to just page
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data, loading, error } = useAnimeKaiRecentlyAdded(page);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <div className="px-6 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Recently Added</h2>
        </div>
        <div className="flex gap-4 overflow-hidden">
          {Array(8).fill(null).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-40 animate-pulse">
              <div className="bg-gray-800 rounded-xl aspect-[2/3]"></div>
              <div className="h-3 bg-gray-800 rounded mt-2 w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !data?.results?.length) return null;

  return (
    <div className="px-6 py-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Recently Added
          </h2>
          <p className="text-xs text-gray-500 mt-1">Freshly added to the collection</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-full bg-[#1a1a24] border border-purple-500/30 text-purple-400 hover:bg-purple-500/20 transition-all duration-300 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-full bg-[#1a1a24] border border-purple-500/30 text-purple-400 hover:bg-purple-500/20 transition-all duration-300 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {data.results.map((anime: AnimeKaiAnime) => (
          <WatchOverlay 
            key={anime.id} 
            id={anime.id} 
            finder={anime.title} 
            name={anime.title}
          >
            <div className="flex-shrink-0 w-40 group cursor-pointer">
              <div className="relative overflow-hidden rounded-xl transition-all duration-300 group-hover:scale-105">
                <div className="aspect-[2/3] overflow-hidden rounded-xl">
                  <img
                    src={anime.image}
                    alt={anime.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute top-2 left-2 bg-green-500/90 backdrop-blur-sm px-2 py-0.5 rounded-full">
                  <span className="text-[9px] font-bold text-white">NEW</span>
                </div>
              </div>
              <div className="mt-2">
                <h3 className="text-xs font-medium text-white truncate group-hover:text-purple-400 transition">
                  {anime.title}
                </h3>
                <p className="text-[10px] text-gray-500 truncate">{anime.type}</p>
              </div>
            </div>
          </WatchOverlay>
        ))}
      </div>
    </div>
  );
}

export default AnimeKaiRecentlyAdded;