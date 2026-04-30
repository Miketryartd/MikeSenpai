// frontend/src/Services/multiStreamLink.ts
import { DynamicUrl } from "../Utils/DynamicUrl";

export const getMultiStreamLinks = async (id: number | string | undefined) => {
  try {
    const url = `${DynamicUrl()}/mikesenpai/api/multi/stream/${id}`;
    console.log(`🎬 Fetching multi-provider stream links from: ${url}`);
    
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    
    if (!res.ok) {
      throw new Error(`Error fetching stream links: ${res.status}`);
    }
    
    const data = await res.json();
    console.log(`📺 Stream source: ${data.source}, episodes: ${data.local?.ep?.length || 0}`);
    return data;
  } catch (error) {
    console.error("Error fetching stream links:", error);
    return null;
  }
};