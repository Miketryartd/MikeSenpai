// frontend/src/Components/AnimeCard.tsx
import type { AnimeSearch } from "../Types/Interface";
import SourceBadge from "./SourceBadge";
import WatchOverlay from "./WatchOverlay";

function AnimeCard({ Name, Image, Id, finder, source }: AnimeSearch) {
  if (!Id) return null;
  
  return (
    <div className="mt-10 group bg-[#16162a] border border-[#2d2d4a] rounded-lg overflow-hidden
                  hover:-translate-y-1 transition-all duration-200 cursor-pointer">
      
      <WatchOverlay id={Id} finder={finder || Name}>
        <div className="relative aspect-[3/3] w-full overflow-hidden bg-gray-800">
          <img
            src={Image}
            alt={Name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        {source && (
          <div className="absolute top-2 right-2">
            <SourceBadge source={source} size="sm" showLabel={false} />
          </div>
        )}
      </WatchOverlay>
    
      <div className="p-1.5">
        <p className="text-xs font-medium text-white truncate">{Name}</p>
      </div>
    </div>
  );
}

export default AnimeCard;