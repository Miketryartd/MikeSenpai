// frontend/src/Services/searchAnime.ts
import { fetchWithNgrok } from "../Utils/DynamicUrl";

export async function searchAnime(query: string) {
    const cleanedQuery = query.trim();
  
    if (!cleanedQuery) {
      throw new Error("Empty query");
    }
  
    if (cleanedQuery.length <= 2) {
      console.log(`Short search query: "${cleanedQuery}" - trying flexible search`);
    }
  
    const url = `/mikesenpai/api/searchAnime/${encodeURIComponent(cleanedQuery)}`;
    
    console.log(`Searching: ${cleanedQuery}`);
  
    try {
      const data = await fetchWithNgrok(url);
      
      if (!data) {
        throw new Error("No data returned from server");
      }
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      if ((!data.results || data.results.length === 0) && cleanedQuery.length <= 2) {
        console.log(`No results for "${cleanedQuery}", returning empty array`);
        return { results: [], found: false, message: "Try typing more letters for better results" };
      }
      
      return data;
    } catch (err) {
      console.error("Search error:", err);
      throw err;
    }
}