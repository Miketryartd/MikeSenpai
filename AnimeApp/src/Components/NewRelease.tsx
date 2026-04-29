import { useState } from "react";
import { useNewReleases } from "../Hooks/useNewReleases";

function NewReleases() {
  const [page, setPage] = useState(1);
  const { results, loading, error, hasNextPage, totalPages } = useNewReleases(page);

  
  if (loading) return (
    <div className="p-4">
      <div className="h-4 w-32 bg-gray-700 rounded animate-pulse mb-4" />
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
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
    </div>
  );

  if (error) return <p className="text-red-400 text-sm p-4">{error}</p>;

  return (
    <div className="p-4">

    
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-white">New Releases</h2>
       
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] text-green-400">Live</span>
          </span>
        </div>

      
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{page} / {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-7 h-7 cursor-pointer flex items-center justify-center rounded border border-purple-700 text-white hover:bg-purple-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm"
          >‹</button>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={!hasNextPage}
            className="w-7 h-7 cursor-pointer flex items-center justify-center rounded border border-purple-700 text-white hover:bg-purple-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm"
          >›</button>
        </div>
      </div>

   
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
        {results.map((anime) => (
          <a
            key={anime.id}
            href={`/Detail/${anime.id}`}
            className="group bg-[#16162a] border border-[#2d2d4a] rounded-lg overflow-hidden
                       hover:border-purple-600 hover:-translate-y-1 transition-all duration-200 cursor-pointer"
          >
           
            <div className="relative aspect-[2/3] bg-gray-800 overflow-hidden">
              <img
                src={anime.image}
                alt={anime.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

            
              <span className="absolute bottom-1.5 right-1.5 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
                {anime.episodes} eps
              </span>

             
              <span className="absolute top-1.5 left-1.5 bg-black/70 text-purple-400 text-[10px] px-1.5 py-0.5 rounded">
                {anime.type}
              </span>

             
              <div className="absolute top-1.5 right-1.5 flex flex-col gap-0.5">
                {anime.sub > 0 && (
                  <span className="bg-blue-900/80 text-blue-300 text-[9px] px-1 py-0.5 rounded">
                    SUB {anime.sub}
                  </span>
                )}
                {anime.dub > 0 && (
                  <span className="bg-orange-900/80 text-orange-300 text-[9px] px-1 py-0.5 rounded">
                    DUB {anime.dub}
                  </span>
                )}
              </div>
            </div>

         
            <div className="p-1.5">
              <p className="text-xs font-medium text-white truncate">{anime.title}</p>
              <p className="text-[10px] text-gray-500 truncate mt-0.5">{anime.japaneseTitle}</p>
            </div>
          </a>
        ))}
      </div>

    </div>
  );
}

export default NewReleases;