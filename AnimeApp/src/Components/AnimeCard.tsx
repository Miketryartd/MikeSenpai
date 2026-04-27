import type { AnimeSearch } from "../Types/Interface";
import WatchOverlay from "./WatchOverlay";

function AnimeCard({ Name, Image, Id, finder }: AnimeSearch) {
  return (
    <div className="mt-10 group bg-[#16162a] border border-[#2d2d4a] rounded-lg overflow-hidden
                    hover:border-purple-600 hover:-translate-y-1 transition-all duration-200 cursor-pointer">
      
      <WatchOverlay id={Id} finder={finder}>
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-gray-800">
          <img
            src={Image}
            alt={Name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </WatchOverlay>

      <div className="p-1.5">
        <p className="text-xs font-medium text-white truncate">{Name}</p>
      </div>
    </div>
  );
}

export default AnimeCard;