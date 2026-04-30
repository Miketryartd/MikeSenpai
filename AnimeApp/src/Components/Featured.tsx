
import { useEffect, useRef } from "react";
import { useFeaturedAnime } from "../Hooks/useFeaturedAnime";
import WatchOverlay from "./WatchOverlay";
import SourceBadge from "./SourceBadge";

function Featured() {
  const {
    animeList,
    isLoading,
    isFetchingMore,
    error,
    hasMore,
    initFetch,
    fetchMore,
  } = useFeaturedAnime();

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initFetch();
  }, [initFetch]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !isFetchingMore && !isLoading) {
          fetchMore();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isFetchingMore, isLoading, fetchMore]);

  if (isLoading && animeList.length === 0) {
    return (
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
  }

  if (error && animeList.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-400 text-sm">{error}</p>
        <button 
          onClick={initFetch}
          className="mt-4 px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  if (animeList.length === 0 && !isLoading) {
    return null;
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-white">Featured Anime</h2>
          <p className="text-xs text-gray-500 mt-0.5">Top rated from AnimeKai</p>
        </div>
        <span className="text-xs text-gray-500">{animeList.length} anime loaded</span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
        {animeList.map((anime) => {
          if (!anime._id) return null;
          return (
            <WatchOverlay key={String(anime._id)} id={String(anime._id)} finder={anime.Name} name={anime.Name}>
              <div className="group bg-[#16162a] border border-[#2d2d4a] rounded-lg overflow-hidden hover:border-purple-600 hover:-translate-y-1 transition-all duration-200 cursor-pointer">
                <div className="relative aspect-[2/3] bg-gray-800 overflow-hidden">
                  <img
                    src={anime.ImagePath}
                    alt={anime.Name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/300x450?text=No+Image';
                    }}
                  />
                  <div className="absolute top-1.5 left-1.5 flex items-center gap-0.5 bg-black/70 text-yellow-400 text-[10px] px-1.5 py-0.5 rounded">
                    <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    <span>{anime.MALScore}</span>
                  </div>
                  <div className="absolute bottom-1.5 right-1.5 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
                    {anime.epCount || "?"} eps
                  </div>
                  <div className="absolute bottom-1.5 left-1.5">
                    <SourceBadge source="animekai" size="sm" showLabel={false} />
                  </div>
                  <div className="absolute top-1.5 right-1.5 bg-black/70 text-purple-400 text-[9px] px-1.5 py-0.5 rounded">
                    {anime.Duration}
                  </div>
                </div>
                <div className="p-1.5">
                  <p className="text-xs font-medium text-white truncate">{anime.Name}</p>
                  <div className="flex flex-row gap-2 mt-0.5">
                    <p className="text-[9px] text-gray-500 truncate">
                      {anime.Genres?.slice(0, 2).join(", ") || "Anime"}
                    </p>
                  </div>
                </div>
              </div>
            </WatchOverlay>
          );
        })}
      </div>

      {isFetchingMore && (
        <div className="flex justify-center items-center py-8 gap-2">
          <div className="w-4 h-4 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
          <span className="text-xs text-gray-500">Loading more anime...</span>
        </div>
      )}

      {!hasMore && animeList.length > 0 && (
        <p className="text-center text-xs text-gray-600 py-8">
          You've seen {animeList.length} featured anime
        </p>
      )}

      <div ref={sentinelRef} className="h-1 w-full" />
    </div>
  );
}

export default Featured;