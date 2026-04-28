import { useEffect, useRef } from "react";
import { useFeaturedAnime } from "../Hooks/useFeaturedAnime";
import WatchOverlay from "./WatchOverlay";

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
  }, []);


  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
  
        if (first.isIntersecting && hasMore && !isFetchingMore) {
          fetchMore();
        }
      },
      {
       
        rootMargin: "200px",
      }
    );

    observer.observe(sentinel);

    return () => observer.disconnect();

  }, [hasMore, isFetchingMore, fetchMore]);


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

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">Binge Worthy</h2>
        <span className="text-xs text-gray-500">{animeList.length} anime loaded</span>
      </div>


      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
        {animeList.map((anime) => (
          <WatchOverlay key={anime._id} id={anime._id} finder={anime.Name}>
            <div
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

     
      {isFetchingMore && (
        <div className="flex justify-center items-center py-8 gap-2">
          <div className="w-4 h-4 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
          <span className="text-xs text-gray-500">Loading more anime...</span>
        </div>
      )}

     
      {!hasMore && animeList.length > 0 && (
        <p className="text-center text-xs text-gray-600 py-8">
          You've seen everything. That's {animeList.length} anime 👀
        </p>
      )}

     
      <div ref={sentinelRef} className="h-1 w-full" />

    </div>
  );
}

export default Featured;