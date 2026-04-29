import { DynamicUrl } from "../Utils/DynamicUrl";

export const getEpisodeSource = async (episodeId: string) => {
  try {
    // Encode the episode ID to handle special characters
    const encodedId = encodeURIComponent(episodeId);
    const url = `${DynamicUrl()}/mikesenpai/api/getEpisodeSource/${encodedId}`;
    
    console.log("Fetching episode source from:", url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to fetch episode source: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Validate the response has sources
    if (!data || !data.sources || data.sources.length === 0) {
      throw new Error("No video sources available for this episode");
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching episode source:", error);
    throw error;
  }
};