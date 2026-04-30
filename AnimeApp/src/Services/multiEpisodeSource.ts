// frontend/src/Services/multiEpisodeSource.ts
import { DynamicUrl } from "../Utils/DynamicUrl";

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
    const url = `${DynamicUrl()}/mikesenpai/api/multi/episode-source/${encodedId}`;
    
    console.log(`🎬 Fetching multi-provider episode source from: ${url}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to fetch episode source: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data || !data.sources || data.sources.length === 0) {
      throw new Error("No video sources available for this episode");
    }
    
    console.log(`✅ Got ${data.sources.length} sources from ${data.provider}`);
    return data;
  } catch (error) {
    console.error("Error fetching episode source:", error);
    return null;
  }
};