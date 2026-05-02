// frontend/src/Services/multiEpisodeSource.ts
import { fetchWithNgrok } from "../Utils/DynamicUrl";

export const getMultiEpisodeSource = async (episodeId: string, language: 'sub' | 'dub' = 'sub') => {
  try {
    const encodedId = encodeURIComponent(episodeId);
    
    const baseUrl = (import.meta.env.MODE === "production" 
      ? import.meta.env.VITE_BACKEND_PROD 
      : import.meta.env.VITE_BACKEND_LOCAL);
    
    const fullUrl = `${baseUrl}/mikesenpai/api/multi/episode-source/${encodedId}?lang=${language}`;
    
    console.log(`Fetching episode source from: ${fullUrl}`);
    
    const response = await fetch(fullUrl, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch episode source: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data || !data.sources || data.sources.length === 0) {
      throw new Error("No video sources available for this episode");
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching episode source:", error);
    throw error;
  }
};