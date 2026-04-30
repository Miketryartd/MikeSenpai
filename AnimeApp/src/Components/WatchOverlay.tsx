
import { useNavigate } from "react-router-dom";
import type { WatchOverlayProps } from "../Types/Interface";

function WatchOverlay({ children, id, finder, name }: WatchOverlayProps) {
  const navigate = useNavigate();
 
  const handleClick = () => {
    const isNumericId = /^\d+$/.test(String(id));
    const slug = (finder || name || String(id))
      .toString()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    if (isNumericId) {
      navigate(`/Detail/${id}/${slug}`);
    } else {
      navigate(`/Detail/${encodeURIComponent(String(id))}/${slug}`);
    }
  };

  return (
    <div className="relative group cursor-pointer">
      {children}

      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <button
          onClick={handleClick}
          className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold"
        >
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-player-play">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M6 4v16a1 1 0 0 0 1.524 .852l13 -8a1 1 0 0 0 0 -1.704l-13 -8a1 1 0 0 0 -1.524 .852z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default WatchOverlay;