import { useState } from "react";
import { useAnimeStream } from "../Hooks/useAnimeStream";
import { useParams } from "react-router-dom";

type Props = {
  onSelectEp: (video: string) => void;
};

function EpisodeList({ onSelectEp }: Props) {
  const { id } = useParams();
  const { result, loading, error } = useAnimeStream(id);
  const [activeChunk, setActiveChunk] = useState(0);
  const [audioType, setAudioType] = useState<"sub" | "dub">("sub");
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!result) return <p>No data</p>;

  const episodes = result.local?.ep ?? [];
  const mainLink = result.local?.link;
  const hasEpisodes = episodes.length > 0;
  const hasFallbackLink = mainLink && typeof mainLink === "string";

  const handleEpisodeClick = (link: string, epNumber: number) => {
    setSelectedEpisode(epNumber);
    onSelectEp(applyType(link));
  };

  const applyType = (link: string) =>
    link.replace("src=", "").replace(/\/(sub|dub)/, `/${audioType}`);

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

  if (!hasEpisodes && hasFallbackLink) {
    return (
      <div id="watch-section" className="px-6 pb-10">
        <h1 className="text-2xl font-semibold text-purple-400 mb-4">Available Episodes</h1>
        <AudioToggle />
        <button
          className="bg-purple-700 hover:bg-purple-600 px-6 py-2 rounded-lg transition cursor-pointer text-sm text-white font-semibold"
          onClick={() => onSelectEp(applyType(mainLink))}
        >
          Watch {result.local?.name}
        </button>
      </div>
    );
  }

  if (!hasEpisodes && !hasFallbackLink) {
    return (
      <div id="watch-section" className="px-6 pb-10">
        <h1 className="text-2xl font-semibold text-purple-400 mb-4">Available Episodes</h1>
        <p className="text-gray-500 text-sm">No episodes available.</p>
      </div>
    );
  }

  const CHUNK_SIZE = 100;
  const chunks: typeof episodes[] = [];
  for (let i = 0; i < episodes.length; i += CHUNK_SIZE) {
    chunks.push(episodes.slice(i, i + CHUNK_SIZE));
  }

  const visibleEpisodes = chunks[activeChunk] ?? [];

  return (
    <div id="watch-section" className="px-6 pb-10">
      <h1 className="text-2xl font-semibold text-purple-400 mb-4">Available Episodes</h1>

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
        {visibleEpisodes.map((e, idx) => {
          const epNumber = activeChunk * CHUNK_SIZE + idx + 1;
          const isSelected = selectedEpisode === epNumber;
          
          return (
            <button
  key={idx}
  className={`px-4 py-2 rounded-lg transition cursor-pointer text-sm inline-flex items-center gap-1.5
    ${isSelected 
      ? "bg-purple-600 hover:bg-purple-700 text-white font-semibold border border-purple-500" 
      : "bg-[#1a1a24] hover:bg-purple-600 text-gray-200"
    }`}
  onClick={() => handleEpisodeClick(e.link, epNumber)}
>
  <span>{epNumber}</span>
  {isSelected && (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="inline-block">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M6 4v16a1 1 0 0 0 1.524 .852l13 -8a1 1 0 0 0 0 -1.704l-13 -8a1 1 0 0 0 -1.524 .852z" />
    </svg>
  )}
</button>
          );
        })}
      </div>
    </div>
  );
}

export default EpisodeList;