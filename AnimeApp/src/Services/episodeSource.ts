
import { fetchWithNgrok } from "../Utils/DynamicUrl";

export const getEpisodeSource = async (episodeId: string) => {
  try {
    const encodedId = encodeURIComponent(episodeId);
    console.log(`Fetching episode source for: ${episodeId}`);
    
    const data = await fetchWithNgrok(`/mikesenpai/api/getEpisodeSource/${encodedId}`);
    
    if (!data || !data.sources || data.sources.length === 0) {
      throw new Error("No video sources available for this episode");
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching episode source:", error);
    throw error;
  }
};