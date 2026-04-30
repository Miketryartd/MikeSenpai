import { useNavigate, useParams } from "react-router-dom";
import { useAnimeDetails } from "../Hooks/useAnimeDetail";
import { useState } from "react";
import NavHeader from "../Components/Nav";
import EpisodeList from "../Components/EpisodeList";
import Stream from "../Components/Stream";
import CommentSection from "../Components/CommentSection";
import logo from "../assets/Images/android-chrome-512x512.png";
import DetailRecommendation from "../Components/DetailRecommendation";

const DetailSkeleton = () => (
  <div className="bg-[#0d0d14] min-h-screen text-white">
    <NavHeader />
    
    <div className="relative w-full h-[400px] bg-gray-800 animate-pulse">
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="w-36 h-12 bg-gray-700 rounded-lg" />
      </div>
     
      <div className="absolute bottom-0 left-0 p-6 flex items-end gap-6 z-10">
        <div className="w-40 h-56 bg-gray-700 rounded-lg" />
        <div className="space-y-3 pb-2">
          <div className="h-6 w-48 bg-gray-700 rounded" />
          <div className="h-3 w-32 bg-gray-700 rounded" />
          <div className="h-3 w-40 bg-gray-700 rounded" />
        </div>
      </div>
    </div>
    
    <div className="p-6 grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-3">
        <div className="h-5 w-24 bg-gray-700 rounded animate-pulse" />
        <div className="space-y-2">
          <div className="h-3 w-full bg-gray-800 rounded animate-pulse" />
          <div className="h-3 w-5/6 bg-gray-800 rounded animate-pulse" />
          <div className="h-3 w-4/6 bg-gray-800 rounded animate-pulse" />
          <div className="h-3 w-full bg-gray-800 rounded animate-pulse" />
          <div className="h-3 w-3/6 bg-gray-800 rounded animate-pulse" />
        </div>
      </div>

      <div className="bg-[#1a1a24] p-4 rounded-lg space-y-3 animate-pulse">
        <div className="h-5 w-28 bg-gray-700 rounded" />
        {Array(7).fill(null).map((_, i) => (
          <div key={i} className="h-3 bg-gray-700 rounded w-3/4" />
        ))}
      </div>
    </div>

    <div className="p-6 space-y-4">
      <div className="w-full h-64 bg-gray-800 rounded-lg animate-pulse" />
      <div className="h-5 w-32 bg-gray-700 rounded animate-pulse" />
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
        {Array(16).fill(null).map((_, i) => (
          <div key={i} className="h-9 bg-gray-800 rounded animate-pulse" />
        ))}
      </div>
    </div>
  </div>
);

const ServerErrorDisplay = ({ errorType = "animekai", errorMessage = "" }) => {

  const isAnimeKai = errorType === "animekai";
  
  const handleGoBack = () => {
    window.history.back();
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };
  
  const handleRetry = () => {
    window.location.reload();
  };
  
  return (
    <div className="bg-[#0d0d14] min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-lg mx-auto p-8 bg-[#16162a] rounded-2xl border border-[#2d2d4a]">
        <div className={`w-20 h-20 mx-auto mb-4 rounded-full ${isAnimeKai ? 'bg-red-500/20' : 'bg-yellow-500/20'} flex items-center justify-center`}>
          {isAnimeKai ? (
            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ) : (
            <svg className="w-10 h-10 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>
        
        <h2 className="text-xl font-bold text-white mb-2">
          {isAnimeKai ? "AnimeKai Service Unavailable" : "Server Connection Issue"}
        </h2>
        
        <p className="text-gray-400 text-sm mb-4">
          {isAnimeKai 
            ? "We're currently unable to fetch anime details from AnimeKai. This could be due to:" 
            : "Our servers are experiencing technical difficulties:"}
        </p>
        
        <div className="bg-black/30 rounded-xl p-4 mb-6 text-left">
          <ul className="text-xs text-gray-300 space-y-2">
            {isAnimeKai ? (
              <>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  <span><strong className="text-white">Server Maintenance:</strong> AnimeKai might be undergoing scheduled maintenance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  <span><strong className="text-white">API Changes:</strong> The API endpoint structure may have been updated</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  <span><strong className="text-white">Rate Limiting:</strong> Too many requests may have triggered temporary bans</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  <span><strong className="text-white">Network Issues:</strong> Connection problems between our server and AnimeKai</span>
                </li>
                <li className="flex items-start gap-2 mt-2 pt-2 border-t border-gray-800">
                  <span className="text-yellow-400">💡</span>
                  <span className="text-gray-400">Try refreshing in a few minutes or check if <a href="https://animekai.to" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">AnimeKai.to</a> is accessible</span>
                </li>
              </>
            ) : (
              <>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400">•</span>
                  <span><strong className="text-white">Database Connection:</strong> Unable to connect to the anime database</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400">•</span>
                  <span><strong className="text-white">API Timeout:</strong> The request took too long to complete</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400">•</span>
                  <span><strong className="text-white">Invalid ID:</strong> The anime ID "{errorMessage}" may not exist in our database</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400">•</span>
                  <span><strong className="text-white">Cache Issue:</strong> Stale data might be causing problems</span>
                </li>
                <li className="flex items-start gap-2 mt-2 pt-2 border-t border-gray-800">
                  <span className="text-blue-400">ℹ️</span>
                  <span className="text-gray-400">Error details: {errorMessage || "Unknown error"}</span>
                </li>
              </>
            )}
          </ul>
        </div>
        
        <div className="flex gap-3 justify-center">
          <button 
            onClick={handleRetry} 
            className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition text-sm cursor-pointer"
          >
            Retry
          </button>
          <button 
            onClick={handleGoBack} 
            className="px-4 py-2 bg-[#1a1a24] border border-purple-800 rounded-lg hover:bg-purple-800 transition text-sm cursor-pointer"
          >
            Go Back
          </button>
        </div>
        
        {isAnimeKai && (
          <p className="text-xs text-gray-600 mt-4">
            Note: Our site uses Anipub as fallback. You can still browse other anime while we resolve this.
          </p>
        )}
      </div>
    </div>
  );
};

function Detail() {
  const navigate = useNavigate();
  const { id, finder } = useParams();
  console.log("Detail page received ID:", id, "finder:", finder);
  const { loading, result, error } = useAnimeDetails(id);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);

  const handleGoBackRefresh = () => {
    navigate('/');
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  if (loading) return <DetailSkeleton />;
  
  if (error) {
    const isAnimeKaiError = error.toLowerCase().includes('animekai') || 
                           error.toLowerCase().includes('failed') ||
                           error.toLowerCase().includes('404') ||
                           error.toLowerCase().includes('500');
    
    if (isAnimeKaiError) {
      return <ServerErrorDisplay errorType="animekai" errorMessage={error} />;
    }
    
    return <ServerErrorDisplay errorType="server" errorMessage={error} />;
  }
  
  if (!result) return (
    <div className="bg-[#0d0d14] min-h-screen flex items-center justify-center">
      <div className="text-center p-8 max-w-md">
        <img src={logo} className="h-25 w-25 object-cover rounded-md mx-auto mb-4" alt="logo" />
        <p className="text-gray-400 text-sm mb-4">Servers are currently experiencing issues.</p>
        <p className="text-xs text-gray-600 mb-6">Unable to fetch anime details for ID: {id}</p>
        <div className="flex gap-3 justify-center">
          <button 
            onClick={() => window.location.reload()} 
            className="cursor-pointer px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition text-sm"
          >
            Retry
          </button>
          <button 
            onClick={handleGoBackRefresh} 
            className="cursor-pointer px-4 py-2 bg-[#1a1a24] border border-purple-800 rounded-lg hover:bg-purple-800 transition text-sm"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );

  const anime = result.local;

  return (
    <div className="bg-[#0d0d14] min-h-screen text-white">
      <NavHeader />
      
      <div className="relative w-full h-[400px]">
        <img
          src={anime?.Cover || anime?.ImagePath}
          alt="cover"
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = anime?.ImagePath || '';
          }}
        />
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
   
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <a
            href="#watch-section"
            className="cursor-pointer flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold shadow-lg hover:scale-105 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M6 4v16a1 1 0 0 0 1.524 .852l13 -8a1 1 0 0 0 0 -1.704l-13 -8a1 1 0 0 0 -1.524 .852z" />
            </svg>
            Watch Now
          </a>
        </div>
     
        <div className="absolute bottom-0 left-0 p-4 sm:p-6 flex items-end gap-4 sm:gap-6 z-10">
          <img
            src={anime?.ImagePath}
            alt={anime?.Name}
            className="w-24 sm:w-40 rounded-lg shadow-lg"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x300?text=No+Image';
            }}
          />
          <div>
            <h1 className="text-xl sm:text-3xl font-bold">{anime?.Name || 'Unknown Title'}</h1>
            <p className="text-xs sm:text-sm text-gray-300">
              {anime?.Aired || 'Unknown Date'} • {anime?.Duration || 'Unknown Duration'}
            </p>
            <p className="text-xs sm:text-sm text-purple-400">
              {anime?.Genres?.join(", ") || 'No genres listed'}
            </p>
          </div>
        </div>
      </div>
   
      <div className="p-6 grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold text-purple-400">Synopsis</h2>
          <p className="text-gray-300 leading-relaxed">
            {anime?.DescripTion || "No description available."}
          </p>
        </div>

        <div className="bg-[#1a1a24] p-4 rounded-lg space-y-2">
          <h2 className="text-lg font-semibold text-purple-400">Information</h2>
          <p><span className="text-gray-400">Studios:</span> {anime?.Studios || 'Unknown'}</p>
          <p><span className="text-gray-400">Producers:</span> {anime?.Producers || 'Unknown'}</p>
          <p><span className="text-gray-400">Premiered:</span> {anime?.Premiered || 'Unknown'}</p>
          <p><span className="text-gray-400">Status:</span> {anime?.Status || 'Unknown'}</p>
          <p><span className="text-gray-400">Episodes:</span> {anime?.epCount || '?'}</p>
          <p><span className="text-gray-400">Duration:</span> {anime?.Duration || 'Unknown'}</p>
          <p><span className="text-gray-400">Genre(s):</span> {anime?.Genres?.slice(0, 2).join(", ") || 'None'}</p>
          <p><span className="text-gray-400">Score:</span> {anime?.MALScore || 'N/A'}</p>
        </div>
      </div>
     
      <div>
        <div>
          <Stream currentVideo={currentVideo} />
        </div>
        <div id="watch-section" className="mt-10">
          <EpisodeList onSelectEp={setCurrentVideo} />
        </div>

        <div>
          <DetailRecommendation currentAnimeId={id || ""}/>
        </div>
        <div className="mt-10 p-10">
          <CommentSection />
        </div>
      </div>
    </div>
  );
}

export default Detail;