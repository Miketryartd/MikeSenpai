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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!result) return <p>No data</p>;

  const episodes = result.local?.ep ?? [];


  const CHUNK_SIZE = 100;
  const chunks: typeof episodes[] = [];
  for (let i = 0; i < episodes.length; i += CHUNK_SIZE) {
    chunks.push(episodes.slice(i, i + CHUNK_SIZE));
  }



  const visibleEpisodes = chunks[activeChunk] ?? [];

  return (
    <div id="watch-section" className="px-6 pb-10">
      <h1 className="text-2xl font-semibold text-purple-400 mb-4">
        Available Episodes
      </h1>

  
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
          const cleanLink = e.link.replace("src=", "");
          const epNumber = activeChunk * CHUNK_SIZE + idx + 1;
         

          return (
            <button
              key={idx}
              className="bg-[#1a1a24] hover:bg-purple-600 px-4 py-2 rounded-lg transition cursor-pointer text-sm text-gray-200"
              onClick={() => onSelectEp(cleanLink)}
            >
              Episode {epNumber}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default EpisodeList;