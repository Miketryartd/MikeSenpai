import type { AnimeSearch } from "../Types/Interface";
import WatchOverlay from "./WatchOverlay";

function AnimeCard({Name, Image, Id, finder}: AnimeSearch) {


    return (
        <>
      
         <div className="bg-[#16162a] border border-[#2d2d4a] rounded-xl overflow-hidden
                    hover:border-purple-600 hover:-translate-y-1 transition-all cursor-pointer">
                        <WatchOverlay  id={Id} finder={finder}>
      <img src={Image} alt={Name} className="w-50 h-50  object-cover" />
      </WatchOverlay>
      <div className="p-2.5">
        <p className="text-sm font-semibold text-gray-100 truncate tracking-wide">{Name}</p>
      </div>
     
    </div>

    
        </>
    )
}

export default AnimeCard;