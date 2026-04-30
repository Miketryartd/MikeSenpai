// frontend/src/Components/AnimeUnityNewReleases.tsx
import { useState, useEffect } from "react";
import { DynamicUrl } from "../Utils/DynamicUrl";
import WatchOverlay from "./WatchOverlay";
import SourceBadge from "./SourceBadge";

interface AnimeItem {
  title: string;
  image: string;
  cover: string;
  rating: number;
  type: string;
  releaseDate: string;
  description: string;
}

function AnimeUnityNewReleases() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewReleases = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${DynamicUrl()}/mikesenpai/api/animekai/new-releases?page=${page}`);
        if (!response.ok) throw new Error("Failed to fetch");
        const result = await response.json();
        setData(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNewReleases();
  }, [page]);

  if (loading) {
    return (
      <div className="p-4">
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
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-400 text-sm">{error}</p>
        <button onClick={() => setPage(1)} className="mt-2 text-purple-400 text-sm hover:text-purple-300">
          Retry
        </button>
      </div>
    );
  }

  if (!data?.results?.length) return null;

  const getSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-white">New Releases</h2>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] text-green-400">Discover</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-7 h-7 cursor-pointer flex items-center justify-center rounded border border-purple-700 text-white hover:bg-purple-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm"
          >
            ‹
          </button>
          <span className="text-xs text-gray-400">{page} / {data.totalPages}</span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={!data.hasNextPage}
            className="w-7 h-7 cursor-pointer flex items-center justify-center rounded border border-purple-700 text-white hover:bg-purple-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm"
          >
            ›
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
        {data.results.slice(0, 12).map((anime: AnimeItem) => {
          const slug = getSlug(anime.title);
          return (
            <WatchOverlay key={anime.title} id={anime.title} finder={slug} name={anime.title}>
              <div className="group bg-[#16162a] border border-[#2d2d4a] rounded-lg overflow-hidden hover:border-purple-600 hover:-translate-y-1 transition-all duration-200 cursor-pointer">
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img
                    src={anime.image}
                    alt={anime.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-1.5 left-1.5 flex items-center gap-0.5 bg-black/70 text-yellow-400 text-[10px] px-1.5 py-0.5 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z" />
                    </svg>
                    <span>{anime.rating || 'N/A'}</span>
                  </div>
                  <div className="absolute bottom-1.5 left-1.5 bg-purple-600/90 text-white text-[10px] px-1.5 py-0.5 rounded">
                    {anime.type}
                  </div>
                  <div className="absolute bottom-2 right-2">
                    <SourceBadge source="animekai" size="sm" showLabel={false} />
                  </div>
                </div>
                <div className="p-1.5">
                  <p className="text-xs font-medium text-white truncate">{anime.title}</p>
                  <p className="text-[10px] text-gray-500 truncate mt-0.5">{anime.releaseDate?.slice(0, 4) || ''}</p>
                </div>
              </div>
            </WatchOverlay>
          );
        })}
      </div>
    </div>
  );
}

export default AnimeUnityNewReleases;