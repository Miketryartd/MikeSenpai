// frontend/src/Components/EpisodeList.tsx
import { useState, useEffect } from "react";
import { useAnimeStream } from "../Hooks/useAnimeStream";
import { useAnimeDetails } from "../Hooks/useAnimeDetail";
import { useParams } from "react-router-dom";
import { getMultiEpisodeSource } from "../Services/multiEpisodeSource";

type Props = {
  onSelectEp: (video: string) => void;
  animeId?: string;
};

function EpisodeList({ onSelectEp, animeId }: Props) {
  const { id, finder } = useParams();
  const effectiveId = animeId || id;
  const { result, loading, error } = useAnimeStream(effectiveId);
  const { result: animeDetail } = useAnimeDetails(effectiveId);
  const [activeChunk, setActiveChunk] = useState(0);
  const [audioType, setAudioType] = useState<"sub" | "dub">("sub");
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);
  const [watchedEpisodes, setWatchedEpisodes] = useState<Set<number>>(new Set());
  const [loadingEpisode, setLoadingEpisode] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const storageKey = `watched_${id}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const watchedArray = JSON.parse(saved);
          setWatchedEpisodes(new Set(watchedArray));
        } catch (e) {
          console.error("Failed to parse watched episodes:", e);
        }
      }
    }
  }, [id]);

  useEffect(() => {
    if (animeDetail && id && finder) {
      const animeTitle = animeDetail.local?.Name || finder.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      const animeImage = animeDetail.local?.ImagePath || animeDetail.local?.Cover || "";
      
      const animeInfo = {
        title: animeTitle,
        image: animeImage,
        finder: finder,
        id: id
      };
      
      localStorage.setItem(`anime_info_${id}`, JSON.stringify(animeInfo));
    }
  }, [animeDetail, id, finder]);

  const markAsWatched = (epNumber: number) => {
    const newWatched = new Set(watchedEpisodes);
    newWatched.add(epNumber);
    setWatchedEpisodes(newWatched);
    
    if (id) {
      const storageKey = `watched_${id}`;
      localStorage.setItem(storageKey, JSON.stringify(Array.from(newWatched)));
      localStorage.setItem(`watched_time_${id}`, Date.now().toString());
    }
  };

  if (loading) return <div className="px-6 pb-10">Loading episodes...</div>;
  if (error) return <p className="text-red-400 px-6">{error}</p>;
  if (!result) return <p className="text-gray-400 px-6">No data</p>;

  const episodes = result.local?.ep ?? [];
 
  const hasEpisodes = episodes.length > 0;




const handleEpisodeClick = async (episode: any, epNumber: number) => {
  if (loadingEpisode) return;
  
  setLoadingEpisode(`ep-${epNumber}`);
  
  try {
    const episodeId = episode.link || episode.episodeId;
    
    if (!episodeId) {
      alert(`Episode ${epNumber} has no valid ID`);
      setLoadingEpisode(null);
      return;
    }
    
    console.log(`Fetching sources for episode ${epNumber} from ${episodeId}`);
    
    if (episodeId.includes('gogoanime.com.by') || episodeId.includes('streaming.php')) {
      console.log(`Direct Gogoanime URL detected, playing directly`);
      onSelectEp(episodeId);
      markAsWatched(epNumber);
      setSelectedEpisode(epNumber);
      setLoadingEpisode(null);
      return;
    }
    
    const sourcesResponse = await getMultiEpisodeSource(episodeId);
    
    if (sourcesResponse && sourcesResponse.sources && sourcesResponse.sources.length > 0) {
      const bestSource = sourcesResponse.sources.find((s: any) => s.quality === '1080p') 
        || sourcesResponse.sources.find((s: any) => s.quality === '720p')
        || sourcesResponse.sources[0];
      
      if (bestSource?.url) {
        console.log(`Playing episode ${epNumber} with source: ${bestSource.quality}`);
        onSelectEp(bestSource.url);
        markAsWatched(epNumber);
        setSelectedEpisode(epNumber);
      } else {
        alert(`Episode ${epNumber} has no valid video URL`);
      }
    } else {
      alert(`Episode ${epNumber} could not be loaded. No sources available.`);
    }
  } catch (err) {
    console.error(`Failed to load episode ${epNumber}:`, err);
    alert(`Episode ${epNumber} could not be loaded. Please try another episode.`);
  } finally {
    setTimeout(() => setLoadingEpisode(null), 500);
  }
};
  const AudioToggle = () => (
    <div className="flex gap-2 mb-5">
      {(["sub", "dub"] as const).map((type) => (
        <button
          key={type}
          onClick={() => setAudioType(type)}
          className={`px-4 py-1.5 rounded-lg text-sm font-semibold uppercase tracking-widest transition cursor-pointer border
            ${audioType === type
              ? "bg-purple-700 border-purple-700 text-white"
              : "bg-[#1a1a24] border-purple-800 text-purple-400 hover:bg-purple-800"
            }`}
        >
          {type === "sub" ? "🇯🇵 Sub" : "🇺🇸 Dub"}
        </button>
      ))}
    </div>
  );

  if (!hasEpisodes) {
    return (
      <div id="watch-section" className="px-6 pb-10">
        <h1 className="text-2xl font-semibold text-purple-400 mb-4">Episodes</h1>
        <p className="text-gray-500 text-sm">No episodes available.</p>
      </div>
    );
  }

  const CHUNK_SIZE = 100;
  const chunks = [];
  for (let i = 0; i < episodes.length; i += CHUNK_SIZE) {
    chunks.push(episodes.slice(i, i + CHUNK_SIZE));
  }
  const visibleEpisodes = chunks[activeChunk] || [];

  return (
    <div id="watch-section" className="px-6 pb-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-purple-400">
          Available Episodes ({episodes.length})
        </h1>
        
      </div>
      
      <AudioToggle />

      {chunks.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {chunks.map((_, chunkIdx) => {
            const start = chunkIdx * CHUNK_SIZE + 1;
            const end = Math.min((chunkIdx + 1) * CHUNK_SIZE, episodes.length);
            return (
              <button
                key={chunkIdx}
                onClick={() => setActiveChunk(chunkIdx)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold uppercase tracking-widest transition cursor-pointer border
                  ${activeChunk === chunkIdx
                    ? "bg-purple-700 border-purple-700 text-white"
                    : "bg-[#1a1a24] border-purple-800 text-purple-400 hover:bg-purple-800"
                  }`}
              >
                {start}–{end}
              </button>
            );
          })}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        {visibleEpisodes.map((episode, idx) => {
          const epNumber = activeChunk * CHUNK_SIZE + idx + 1;
          const isLoading = loadingEpisode === `ep-${epNumber}`;
          const isSelected = selectedEpisode === epNumber;
          const isWatched = watchedEpisodes.has(epNumber);
          
          return (
            <button
              key={idx}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg transition cursor-pointer text-sm inline-flex items-center gap-1.5
                ${isSelected 
                  ? "bg-purple-600 hover:bg-purple-700 text-white font-semibold border border-purple-500" 
                  : isWatched
                    ? "bg-gray-600 hover:bg-purple-600 text-gray-300 line-through"
                    : "bg-[#1a1a24] hover:bg-purple-600 text-gray-200"
                }`}
              onClick={() => handleEpisodeClick(episode, epNumber)}
            >
              <span>{epNumber}</span>
              {isSelected && (
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="inline-block">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M6 4v16a1 1 0 0 0 1.524 .852l13 -8a1 1 0 0 0 0 -1.704l-13 -8a1 1 0 0 0 -1.524 .852z" />
                </svg>
              )}
              {isWatched && !isSelected && (
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="inline-block">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
              )}
              {isLoading && (
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default EpisodeList;