import { useState } from "react";
import { useGenre } from "../Hooks/useGenre";
import { useGenrePreviews } from "../Hooks/useGenrePrev";
import { GENRES } from "../Config/genres";
import AnimeWrapper from "./AnimeCard";

function AnimeGenre() {
  const [activeGenre, setActiveGenre] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const { results, loading, error } = useGenre(activeGenre, page);
  const { previews } = useGenrePreviews(); 

  const handleGenreClick = (genre: string) => {
    if (activeGenre === genre) {
      setActiveGenre(null);
      setPage(1);
      return;
    }
    setActiveGenre(genre);
    setPage(1);
  };

  return (
    <div className="px-6 py-6">
      <h1 className="text-xl font-semibold text-white mb-4">Browse by Genre</h1>

    
      <div className="flex flex-wrap gap-3 mb-6">
        {GENRES.map((genre) => (
          <button
            key={genre}
            onClick={() => handleGenreClick(genre)}
            className={`relative w-50 h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-300
              ${activeGenre === genre
                ? "border-purple-500 scale-105"
                : "border-transparent hover:border-purple-800 hover:scale-105"
              }`}
          >
           
            {previews[genre] && (
              <img
                src={previews[genre]}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}

           
            <div className={`absolute inset-0 transition-all duration-300
              ${activeGenre === genre
                ? "bg-purple-900/60 backdrop-blur-sm"
                : "bg-black/60 backdrop-blur-sm hover:bg-black/40"
              }`}
            />

         
            <span className="relative z-10 text-white text-xs font-bold uppercase tracking-widest">
              {genre}
            </span>
          </button>
        ))}
      </div>

  
      {activeGenre && (
        <div>
          {loading && <p className="text-gray-500 tracking-widest text-sm text-center">Loading...</p>}
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          {!loading && !error && results.length === 0 && (
            <p className="text-gray-500 text-sm text-center">No anime found for {activeGenre}</p>
          )}

          {!loading && results.length > 0 && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
                {results.map((a: any) => (
                  <AnimeWrapper
                    key={a._id}
                    Id={a._id}
                    finder={a.finder}
                    Name={a.Name}
                    Image={a.ImagePath}
                  />
                ))}
              </div>

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page <= 1}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold uppercase tracking-widest transition border
                    ${page > 1
                      ? "border-purple-700 text-purple-400 hover:bg-purple-700 hover:text-white cursor-pointer"
                      : "border-[#2d2d4a] text-gray-600 cursor-not-allowed opacity-40"
                    }`}
                >
                  ← Prev
                </button>
                <span className="text-sm text-purple-400 tracking-widest font-semibold">
                  Page {page}
                </span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={results.length === 0}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold uppercase tracking-widest transition border
                    ${results.length > 0
                      ? "border-purple-700 text-purple-400 hover:bg-purple-700 hover:text-white cursor-pointer"
                      : "border-[#2d2d4a] text-gray-600 cursor-not-allowed opacity-40"
                    }`}
                >
                  Next →
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default AnimeGenre;