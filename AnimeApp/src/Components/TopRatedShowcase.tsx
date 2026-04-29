import { useState, useRef } from "react";
import { useTopRated } from "../Hooks/useTopRated";
import topratedLogo from "../assets/Images/junko.png";
import WatchOverlay from "./WatchOverlay";

function TopRatedShowcase() {
  const [page, setPage] = useState(1); 
  const { results, loading, error, totalPages } = useTopRated(page);

 
  const [onCooldown, setOnCooldown] = useState(false);
const cooldownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const VISIBLE = 3;

  const canGoPrev = currentIndex > 0 || page > 1;
  const canGoNext = currentIndex + VISIBLE < results.length || page < totalPages;


  const handlePrev = () => {
    if (currentIndex > 0) {
     
      setCurrentIndex((prev) => prev - 1);
    } else if (page > 1) {
 
      setPage((prev) => prev - 1);
      setCurrentIndex(results.length - VISIBLE); 
    }
  };

const handleNext = () => {
  const isLastCard = currentIndex + VISIBLE >= results.length;

  if (isLastCard && page < totalPages) {
    setPage((prev) => prev + 1);  
    setCurrentIndex(0);           
  } else if (!isLastCard) {
    setCurrentIndex((prev) => prev + 1);
  }
};


 const handlePageChange = (newPage: number) => {
  if (onCooldown) return;          
  if (newPage < 1 || newPage > totalPages) return;  

  setPage(newPage);
  setCurrentIndex(0);
  setOnCooldown(true);             
  cooldownTimer.current = setTimeout(() => {
    setOnCooldown(false);         
  }, 1500);                        
};

  const visibleResults = results.slice(currentIndex, currentIndex + VISIBLE);
  const backdropImage = results[currentIndex]?.ImagePath;

  return (
    <div className="">
      {/* ── HEADER ── */}
      <div className="flex items-center gap-3 px-4 py-2">
        <h1 className="text-xl font-semibold text-white">Popular</h1>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-purple-400">
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M12 1.67a2.914 2.914 0 0 0 -2.492 1.403l-8.11 13.537a2.914 2.914 0 0 0 2.484 4.385h16.225a2.914 2.914 0 0 0 2.503 -4.371l-8.116 -13.546a2.917 2.917 0 0 0 -2.494 -1.408z" />
        </svg>
        <img src={topratedLogo} className="h-20 w-20 object-cover rounded-md" />
      </div>

      {loading && <p className="text-gray-400 px-4">Loading...</p>}
      {error && <p className="text-red-400 px-4">{error}</p>}
      {!loading && !error && results.length === 0 && <p className="px-4">No anime found.</p>}

      <div className="relative overflow-hidden rounded-md">
        {backdropImage && (
          <img
            key={backdropImage}
            src={backdropImage}
            className="absolute inset-0 w-full h-full object-cover blur-xl opacity-70 animate-[fadeIn_0.6s_ease]"
          />
        )}

        <div className="relative flex items-center justify-between px-4 pt-3 z-10">
          <button
            onClick={handlePrev}
            disabled={!canGoPrev}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold uppercase tracking-widest transition border
              ${canGoPrev
                ? "border-purple-700 text-purple-400 hover:bg-purple-700 hover:text-white cursor-pointer"
                : "border-[#2d2d4a] text-gray-600 cursor-not-allowed opacity-40"
              }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Prev
          </button>

          <span className="text-sm text-gray-400 tracking-widest">
            {results.length > 0
              ? `${currentIndex + 1} – ${Math.min(currentIndex + VISIBLE, results.length)} of ${results.length}`
              : ""}
          </span>

          <button
            onClick={handleNext}
            disabled={!canGoNext}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold uppercase tracking-widest transition border
              ${canGoNext
                ? "border-purple-700 text-purple-400 hover:bg-purple-700 hover:text-white cursor-pointer"
                : "border-[#2d2d4a] text-gray-600 cursor-not-allowed opacity-40"
              }`}
          >
            Next
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

       
        <div className="relative w-full">
          <div className="flex justify-center gap-4">
            {visibleResults.map((a) => (
              <div
                key={a._id}
                className="min-w-80 w-10 min-h-110 h-100 rounded-md bg-black/30 backdrop-blur-lg p-3 flex-shrink-0 m-5 shadow-lg"
              >
                <WatchOverlay id={a._id} finder={a.finder}>
                  <img src={a.ImagePath} alt={a.Name} className="w-full h-60 object-cover rounded-md" />
                </WatchOverlay>
                <div>
                  <h1 className="text-lg font-bold mt-2 text-white">{a.Name}</h1>
                  <h2 className="flex items-center gap-1 text-sm mt-2 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="orange"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M8.707 2.293l3.293 3.292l3.293 -3.292a1 1 0 0 1 1.32 -.083l.094 .083a1 1 0 0 1 0 1.414l-2.293 2.293h4.586a3 3 0 0 1 3 3v9a3 3 0 0 1 -3 3h-14a3 3 0 0 1 -3 -3v-9a3 3 0 0 1 3 -3h4.585l-2.292 -2.293a1 1 0 0 1 1.414 -1.414" /></svg>
                    {a.MALScore}
                  </h2>
                  <h2 className="flex items-center gap-1 text-sm mt-2 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="yellow"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z" /></svg>
                    {a.RatingsNum}
                  </h2>
                  <h2 className="text-sm mt-2 text-white">{a.DescripTion.slice(0, 60) + "..."}</h2>
                  <h2>{a.Genres}</h2>
                </div>
              </div>
            ))}
          </div>
        </div>

    
        <div className="relative flex items-center justify-center gap-4 px-4 py-4 z-10">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
            className={`px-5 py-2 rounded-lg text-sm font-semibold uppercase tracking-widest transition border
              ${page > 1
                ? "border-purple-700 text-purple-400 hover:bg-purple-700 hover:text-white cursor-pointer"
                : "border-[#2d2d4a] text-gray-600 cursor-not-allowed opacity-40"
              }`}
          >
            ← Page Back
          </button>

          <span className="text-sm text-purple-400 tracking-widest font-semibold">
            Page {page} {totalPages > 1 ? `of ${totalPages}` : ""}
          </span>

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
            className={`px-5 py-2 rounded-lg text-sm font-semibold uppercase tracking-widest transition border
              ${page < totalPages
                ? "border-purple-700 text-purple-400 hover:bg-purple-700 hover:text-white cursor-pointer"
                : "border-[#2d2d4a] text-gray-600 cursor-not-allowed opacity-40"
              }`}
          >
            Page Next →
          </button>
        </div>

      </div>
    </div>
  );
}

export default TopRatedShowcase;