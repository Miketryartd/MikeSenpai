// frontend/src/Pages/Detail.tsx
import { useNavigate, useParams } from "react-router-dom";
import { useAnimeDetails } from "../Hooks/useAnimeDetail";
import { useState, useEffect } from "react";
import NavHeader from "../Components/Nav";
import EpisodeList from "../Components/EpisodeList";
import Stream from "../Components/Stream";
import CommentSection from "../Components/CommentSection";
import logo from "../assets/Images/android-chrome-512x512.png";
import DetailRecommendation from "../Components/DetailRecommendation";
import { DynamicUrl } from "../Utils/DynamicUrl";

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
        </div>
      </div>
      <div className="bg-[#1a1a24] p-4 rounded-lg space-y-3 animate-pulse">
        <div className="h-5 w-28 bg-gray-700 rounded" />
        {Array(5).fill(null).map((_, i) => (
          <div key={i} className="h-3 bg-gray-700 rounded w-3/4" />
        ))}
      </div>
    </div>
  </div>
);

const ServerErrorDisplay = ({ errorMessage = "" }) => {
  const handleGoBack = () => {
    window.history.back();
    setTimeout(() => window.location.reload(), 100);
  };
  const handleRetry = () => window.location.reload();
  
  return (
    <div className="bg-[#0d0d14] min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-lg mx-auto p-8 bg-[#16162a] rounded-2xl border border-[#2d2d4a]">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-yellow-500/20 flex items-center justify-center">
          <svg className="w-10 h-10 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Connection Issue</h2>
        <p className="text-gray-400 text-sm mb-4">Having trouble fetching this anime.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={handleRetry} className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition text-sm cursor-pointer">Retry</button>
          <button onClick={handleGoBack} className="px-4 py-2 bg-[#1a1a24] border border-purple-800 rounded-lg hover:bg-purple-800 transition text-sm cursor-pointer">Go Back</button>
        </div>
      </div>
    </div>
  );
};

function Detail() {
  const navigate = useNavigate();
  const { id, finder } = useParams();
  const [resolvedId, setResolvedId] = useState<string | null>(null);
  const [mappingLoading, setMappingLoading] = useState(false);
  const [mappingComplete, setMappingComplete] = useState(false);
  const { loading, result, error } = useAnimeDetails(resolvedId || id);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);

useEffect(() => {
  const resolveAnimeId = async () => {
    const idToResolve = id || finder;
    
    if (!idToResolve) {
      setMappingComplete(true);
      return;
    }
    
    const isNumericId = /^\d+$/.test(String(idToResolve));
    const isAnimeUnityFormat = /^\d+-[a-z-]+$/.test(String(idToResolve));
    const isPlainText = /^[a-z][a-z0-9-]+$/.test(String(idToResolve)) && !isNumericId && !isAnimeUnityFormat;
    
    if (isNumericId || isAnimeUnityFormat) {
      console.log(`ID is already in AnimeUnity format: ${idToResolve}`);
      setResolvedId(idToResolve);
      setMappingComplete(true);
      return;
    }
    
    if (isPlainText) {
      setMappingLoading(true);
      try {
        console.log(`Attempting to map AnimeKai ID: ${idToResolve}`);
        const response = await fetch(`${DynamicUrl()}/mikesenpai/api/map/animekai/${encodeURIComponent(idToResolve)}`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.animeUnityId) {
            setResolvedId(data.animeUnityId);
            console.log(`Mapped to: ${data.animeUnityId}`);
          } else {
            console.log(`Mapping failed, using original ID: ${idToResolve}`);
            setResolvedId(idToResolve);
          }
        } else {
          console.log(`Mapping endpoint returned ${response.status}, using original ID`);
          setResolvedId(idToResolve);
        }
      } catch (err) {
        console.error("Mapping failed:", err);
        setResolvedId(idToResolve);
      } finally {
        setMappingLoading(false);
        setMappingComplete(true);
      }
    } else {
      setResolvedId(idToResolve);
      setMappingComplete(true);
    }
  };

  resolveAnimeId();
}, [id, finder]);
  const handleGoBackRefresh = () => {
    navigate('/Main');
    setTimeout(() => window.location.reload(), 100);
  };

  if (mappingLoading || (mappingComplete && loading)) return <DetailSkeleton />;
  if (error && mappingComplete) return <ServerErrorDisplay errorMessage={error} />;
  if (!result && mappingComplete && id) return (
    <div className="bg-[#0d0d14] min-h-screen flex items-center justify-center">
      <div className="text-center p-8 max-w-md">
        <img src={logo} className="h-25 w-25 object-cover rounded-md mx-auto mb-4" alt="logo" />
        <p className="text-gray-400 text-sm mb-4">Unable to find this anime.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => window.location.reload()} className="cursor-pointer px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition text-sm">Retry</button>
          <button onClick={handleGoBackRefresh} className="cursor-pointer px-4 py-2 bg-[#1a1a24] border border-purple-800 rounded-lg hover:bg-purple-800 transition text-sm">Go Back</button>
        </div>
      </div>
    </div>
  );
  if (!result || !mappingComplete) return <DetailSkeleton />;

  const anime = result.local;
 

  const infoItems = [
    { label: "Score", value: anime?.MALScore, condition: anime?.MALScore && anime.MALScore !== "N/A" },
    { label: "Episodes", value: anime?.epCount, condition: anime?.epCount && anime.epCount !== "?" && anime.epCount !== 0 },
    { label: "Status", value: anime?.Status, condition: anime?.Status && anime.Status !== "Unknown" },
    { label: "Duration", value: anime?.Duration, condition: anime?.Duration && anime.Duration !== "Unknown" },
    { label: "Premiered", value: anime?.Premiered, condition: anime?.Premiered && anime.Premiered !== "Unknown" },
    { label: "Studios", value: anime?.Studios, condition: anime?.Studios && anime.Studios !== "Unknown" },
  ].filter(item => item.condition);

  return (
    <div className="bg-[#0d0d14] min-h-screen text-white">
      <NavHeader />
      
      <div className="relative w-full h-[450px]">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d14] via-[#0d0d14]/80 to-transparent z-10" />
        <img
          src={anime?.Cover || anime?.ImagePath}
          alt={anime?.title || anime?.Name}
          className="w-full h-full object-cover opacity-40"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        
        <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-10">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
            <img
              src={anime?.ImagePath}
              alt={anime?.title || anime?.Name}
              className="w-32 md:w-48 rounded-xl shadow-2xl "
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/300x450?text=No+Image'; }}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs bg-purple-600/40 px-2 py-1 rounded">ANIME</span>
               
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-3">{anime?.title || anime?.Name || 'Unknown Title'}</h1>
             {anime?.Genres && anime.Genres.length > 0 && (
  <div className="flex flex-wrap gap-2 mb-4">
    {anime.Genres.slice(0, 4).map((genre: string, i: number) => (
      <span key={i} className="text-xs bg-black/20 backdrop-blur-md   px-3 py-1 rounded-full">
        {genre}
      </span>
    ))}
  </div>
)}
              <a
                href="#watch-section"
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 4v16a1 1 0 0 0 1.524.852l13-8a1 1 0 0 0 0-1.704l-13-8A1 1 0 0 0 6 4z"/>
                </svg>
                Watch Now
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-purple-400 mb-3">Synopsis</h2>
              <p className="text-gray-300 leading-relaxed">
                {anime?.DescripTion || "No description available."}
              </p>
            </div>
          </div>

          <div className="bg-[#1a1a24] rounded-xl p-5 h-fit">
            <h2 className="text-lg font-semibold text-purple-400 mb-4">Information</h2>
            <div className="space-y-3">
              {infoItems.map((item, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-[#2d2d4a] last:border-0">
                  <span className="text-gray-400 text-sm">{item.label}</span>
                  <span className="text-white text-sm font-medium">{item.value}</span>
                </div>
              ))}
              {infoItems.length === 0 && (
                <p className="text-gray-500 text-sm text-center">No additional information available</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10">
          <Stream currentVideo={currentVideo} />
        </div>
        
        <div id="watch-section" className="mt-8">
          <EpisodeList onSelectEp={setCurrentVideo} animeId={resolvedId ? String(resolvedId) : undefined} />
        </div>

        <div className="mt-12">
          <DetailRecommendation currentAnimeId={resolvedId || id || ""} />
        </div>
        
        <div className="mt-12">
          <CommentSection />
        </div>
      </div>
    </div>
  );
}

export default Detail;