import { useState, useRef } from "react";
import { useAnimeKaiLatestCompleted } from "../Hooks/useAnimeKaiLatestCompleted";
import WatchOverlay from "./WatchOverlay";
import type { AnimeKaiAnime } from "../Types/AnimeKaiTypes";
import SourceBadge from "./SourceBadge";

function AnimeKaiLatestCompleted() {
  const [page] = useState(1);  
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data, loading, error } = useAnimeKaiLatestCompleted(page);

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
          <h2 className="text-xl font-bold text-white">Latest Completed</h2>
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
    <div className="px-6 py-8 bg-gradient-to-r from-purple-900/10 to-transparent">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Latest Completed
          </h2>
          <p className="text-xs text-gray-500 mt-1">Recently finished airing</p>
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
          <div key={anime.id} className="flex-shrink-0 w-40 group cursor-pointer">
            <div className="relative overflow-hidden rounded-xl transition-all duration-300 group-hover:scale-105">
              <div className="aspect-[2/3] overflow-hidden rounded-xl">
                <WatchOverlay 
                  id={anime.id} 
                  finder={anime.title} 
                  name={anime.title}
                >
                  <img
                    src={anime.image}
                    alt={anime.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </WatchOverlay>
              </div>
              
              <div className="absolute top-1.5 right-1.5 z-10">
                <SourceBadge source="animekai" size="sm" showLabel={false} />
              </div>
              
              <div className="absolute bottom-2 left-2 right-2 flex justify-between">
                <div className="bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full">
                  <span className="text-[9px] text-white">{anime.type}</span>
                </div>
                {anime.rating > 0 && (
                  <div className="bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full flex items-center gap-1">
                    <svg className="w-2.5 h-2.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    <span className="text-[9px] text-white">{anime.rating}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-2">
              <h3 className="text-xs font-medium text-white truncate group-hover:text-purple-400 transition">
                {anime.title}
              </h3>
              <p className="text-[10px] text-gray-500 truncate">{anime.releaseDate?.slice(0, 4) || 'Completed'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AnimeKaiLatestCompleted;