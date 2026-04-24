import { useAnimeStream } from "../Hooks/useAnimeStream";
import { useParams } from "react-router-dom";

type Props = {
  onSelectEp: (video: string) => void;
};

function EpisodeList({ onSelectEp }: Props) {
  const { id } = useParams();
  const { result, loading, error } = useAnimeStream(id);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!result) return <p>No data</p>;

  return (
    <div id="watch-section" className="px-6 pb-10">
      <h1 className="text-2xl font-semibold text-purple-400 mb-4">
        Available Episodes
      </h1>

      <div className="flex flex-wrap gap-3">
        {result.local?.ep?.map((e, idx) => {
          const cleanLink = e.link.replace("src=", "");

          return (
            <button
              key={idx}
              className="bg-[#1a1a24] hover:bg-purple-600 px-4 py-2 rounded-lg transition cursor-pointer"
              onClick={() => onSelectEp(cleanLink)} 
            >
              Episode {idx + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default EpisodeList;