import { useParams } from "react-router-dom";

import { useAnimeDetails } from "../Hooks/useAnimeDetail";
import { useState } from "react";
import NavHeader from "../Components/Nav"
import EpisodeList from "../Components/EpisodeList";
import Stream from "../Components/Stream";
import CommentSection from "../Components/CommentSection";



function Detail() {
    const { id } = useParams();
    const { loading, result, error } = useAnimeDetails(id);
    const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  
    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!result) return <p>No data</p>;
  
    const anime = result.local;
  
    return (
      <div className="bg-[#0d0d14] min-h-screen text-white">
        
        {/* NAV */}
        <NavHeader />
  
        {/* BACKDROP */}
        
        <div className="relative w-full h-[400px]">
  
  {/* background */}
  <img
    src={anime?.Cover || anime?.ImagePath}
    alt="cover"
    className="w-full h-full object-cover"
  />

  {/* overlay */}
  <div className="absolute inset-0 bg-black/70 backdrop-blur-md"></div>


  <div className="absolute inset-0 flex items-center justify-center z-10">
    <a
      href="#watch-section"
      className="cursor-pointer flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold shadow-lg hover:scale-105 transition"
    >
      <span className="text-lg"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-player-play"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6 4v16a1 1 0 0 0 1.524 .852l13 -8a1 1 0 0 0 0 -1.704l-13 -8a1 1 0 0 0 -1.524 .852z" /></svg></span>
      Watch Now
    </a>
  </div>

  {/* bottom content */}
  <div className="absolute bottom-0 left-0 p-6 flex items-end gap-6 z-10">
    
    
    <img
      src={anime?.ImagePath}
      alt={anime?.Name}
      className="w-40 rounded-lg shadow-lg"
    />

    {/* title */}
    <div>
      <h1 className="text-3xl font-bold">{anime?.Name}</h1>
      <p className="text-sm text-gray-300">
        {anime?.Aired} • {anime?.Duration}
      </p>
      <p className="text-sm text-purple-400">
        {anime?.Genres?.join(", ")}
      </p>
    </div>
  </div>
</div>
  
        {/* DETAILS*/}
        <div className="p-6 grid md:grid-cols-3 gap-6">
          
          {/* LEFT  */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold text-purple-400">
              Synopsis
            </h2>
            <p className="text-gray-300 leading-relaxed">
              {anime?.DescripTion || "No description available."}
            </p>
          </div>
  
          {/* RIGHT */}
          <div className="bg-[#1a1a24] p-4 rounded-lg space-y-2">
            <h2 className="text-lg font-semibold text-purple-400">
              Information
            </h2>
  
            <p><span className="text-gray-400">Studios:</span> {anime?.Studios}</p>
            <p><span className="text-gray-400">Producers:</span> {anime?.Producers}</p>
            <p><span className="text-gray-400">Premiered:</span> {anime?.Premiered}</p>
            <p><span className="text-gray-400">Status:</span> {anime?.Status}</p>
            <p><span className="text-gray-400">Episodes:</span> {anime?.epCount}</p>
              <p><span className="text-gray-400">Episodes:</span> {anime?.Duration  }</p>
                <p><span className="text-gray-400">Genre(s):</span> {anime?.Genres?.slice(0, 2).join(',')}</p>
            <p><span className="text-gray-400">Score:</span> {anime?.MALScore}</p>
          </div>
        </div>

     <div>

        <div>
            <Stream currentVideo={currentVideo}/>
        </div>

        <div id="#watch-section" className="mt-10">
     <EpisodeList  onSelectEp={setCurrentVideo}/>
     </div>

     <div className="mt-10 p-10">
      <CommentSection/>
     </div>

   


     </div>
      </div>
    );
  }
export default Detail;