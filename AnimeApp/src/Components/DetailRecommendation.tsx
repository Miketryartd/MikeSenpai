import { useState, useEffect, useRef } from "react";
import WatchOverlay from "./WatchOverlay";
import { fetchWithNgrok } from "../Utils/DynamicUrl";
import SourceBadge from "./SourceBadge";

interface RecommendationAnime {
  id: string;
  title: string;
  image: string;
  type?: string;
  rating?: number | string;
  source: "animekai" | "animeunity" | "anipub";
}

function DetailRecommendation({ currentAnimeId }: { currentAnimeId: string }) {
  const [recommendations, setRecommendations] = useState<RecommendationAnime[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      const recs: RecommendationAnime[] = [];
      const seenIds = new Set<string>();
      
      try {
        const randomPage = Math.floor(Math.random() * 20) + 1;
        const data = await fetchWithNgrok(`/mikesenpai/api/animekai/top-rated?page=${randomPage}`);
        
        if (data.results && data.results.length > 0) {
          const filtered = data.results
            .filter((anime: any) => String(anime.id) !== currentAnimeId)
            .slice(0, 8)
            .map((anime: any) => {
              seenIds.add(String(anime.id));
              return {
                id: String(anime.id),
                title: anime.title,
                image: anime.image,
                type: anime.type,
                rating: anime.rating,
                source: "animekai" as const
              };
            });
          
          recs.push(...filtered);
        }
      } catch (err) {
        console.log("Error fetching from AnimeKai:", err);
      }
      
      if (recs.length < 10) {
        const needed = 10 - recs.length;
        
        try {
          const randomPage = Math.floor(Math.random() * 10) + 1;
          const data = await fetchWithNgrok(`/mikesenpai/api/unified/search/a?page=${randomPage}`);
          
          if (data.results && data.results.length > 0) {
            const filtered = data.results
              .filter((anime: any) => !seenIds.has(String(anime.Id)) && String(anime.Id) !== currentAnimeId)
              .slice(0, needed)
              .map((anime: any) => {
                seenIds.add(String(anime.Id));
                return {
                  id: String(anime.Id),
                  title: anime.Name,
                  image: anime.Image,
                  type: anime.type,
                  rating: anime.rating,
                  source: "animeunity" as const
                };
              });
            
            recs.push(...filtered);
          }
        } catch (err) {
          console.log("Error fetching from AnimeUnity:", err);
        }
      }
      
      if (recs.length < 10) {
        const needed = 10 - recs.length;
        
        try {
          const randomPage = Math.floor(Math.random() * 50) + 1;
          const data = await fetchWithNgrok(`/mikesenpai/api/topRated/${randomPage}`);
          
          if (data.AniData && data.AniData.length > 0) {
            const filtered = data.AniData
              .filter((anime: any) => !seenIds.has(String(anime._id)) && String(anime._id) !== currentAnimeId)
              .slice(0, needed)
              .map((anime: any) => ({
                id: String(anime._id),
                title: anime.Name,
                image: anime.ImagePath,
                type: anime.type,
                rating: anime.MALScore,
                source: "anipub" as const
              }));
            
            recs.push(...filtered);
          }
        } catch (err) {
          console.log("Error fetching from Anipub:", err);
        }
      }
      
      setRecommendations(recs.slice(0, 10));
      setLoading(false);
    };
    
    if (currentAnimeId) {
      fetchRecommendations();
    }
  }, [currentAnimeId]);
  
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  
  const getSourceBadge = (source: string): "animekai" | "animeunity" | "anipub" => {
    if (source === "animekai") return "animekai";
    if (source === "animeunity") return "animeunity";
    return "anipub";
  };
  
  if (loading) {
    return (
      <div className="px-6 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">You Might Also Like</h2>
        </div>
        <div className="flex gap-4 overflow-hidden">
          {Array(6).fill(null).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-32 animate-pulse">
              <div className="bg-gray-800 rounded-xl aspect-[2/3]"></div>
              <div className="h-3 bg-gray-800 rounded mt-2 w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (recommendations.length === 0) {
    return null;
  }
  
  return (
    <div className="px-6 py-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            You Might Also Like
          </h2>
          <p className="text-xs text-gray-500 mt-1">Other anime you might enjoy</p>
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
        {recommendations.map((anime) => (
          <div key={anime.id} className="flex-shrink-0 w-32 group cursor-pointer">
            <div className="relative overflow-hidden rounded-xl transition-all duration-300 group-hover:scale-105">
              <div className="aspect-[2/3] overflow-hidden rounded-xl">
                <WatchOverlay id={anime.id} finder={anime.title} name={anime.title}>
                  <img
                    src={anime.image}
                    alt={anime.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/300x450?text=No+Image';
                    }}
                  />
                </WatchOverlay>
              </div>
              
              <div className="absolute top-1.5 right-1.5 z-10">
                <SourceBadge source={getSourceBadge(anime.source)} size="sm" showLabel={false} />
              </div>
              
              {anime.rating && Number(anime.rating) > 0 && (
                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full flex items-center gap-1">
                  <svg className="w-2.5 h-2.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <span className="text-[9px] text-white">{anime.rating}</span>
                </div>
              )}
              
              {anime.type && (
                <div className="absolute top-2 left-2 bg-purple-600/50 backdrop-blur-sm px-2 py-0.5 rounded-lg">
                  <span className="text-[9px] font-bold text-white">{anime.type}</span>
                </div>
              )}
            </div>
         
            <div className="mt-2">
              <h3 className="text-xs font-medium text-white truncate group-hover:text-purple-400 transition">
                {anime.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DetailRecommendation;