// frontend/src/Services/multiEpisodeSource.ts
import { fetchWithNgrok } from "../Utils/DynamicUrl";

export interface MultiEpisodeSourceResponse {
  provider: string;
  sources: Array<{
    url: string;
    quality: string;
    isM3U8: boolean;
  }>;
  subtitles: Array<{
    lang: string;
    url: string;
  }>;
}

export const getMultiEpisodeSource = async (episodeId: string): Promise<MultiEpisodeSourceResponse | null> => {
  try {
    const encodedId = encodeURIComponent(episodeId);
    console.log(`Fetching multi-provider episode source for: ${episodeId}`);
    
    const data = await fetchWithNgrok(`/mikesenpai/api/multi/episode-source/${encodedId}`);
    
    if (!data || !data.sources || data.sources.length === 0) {
      throw new Error("No video sources available for this episode");
    }
    
    console.log(`Got ${data.sources.length} sources from ${data.provider}`);
    return data;
  } catch (error) {
    console.error("Error fetching episode source:", error);
    return null;
  }
};