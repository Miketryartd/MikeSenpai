import type { AnimeSearch } from "../Types/Interface";

function AnimeCard({Name, Image}: AnimeSearch) {

    return (
        <>
         <div className="bg-[#16162a] border border-[#2d2d4a] rounded-xl overflow-hidden
                    hover:border-purple-600 hover:-translate-y-1 transition-all cursor-pointer">
      <img src={Image} alt={Name} className="w-50 h-50  object-cover" />
      <div className="p-2.5">
        <p className="text-sm font-semibold text-gray-100 truncate tracking-wide">{Name}</p>
      </div>
    </div>
        </>
    )
}

export default AnimeCard;