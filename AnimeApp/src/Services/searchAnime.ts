
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
  
    const res = await fetchWithNgrok(url);
  
    if (!res.ok) {
      throw new Error(`Search failed: ${res.status}`);
    }
  
    const data = await res.json();
 
    if ((!data.results || data.results.length === 0) && cleanedQuery.length <= 2) {
      console.log(`No results for "${cleanedQuery}", returning empty array`);
      return { results: [], found: false, message: "Try typing more letters for better results" };
    }
  
    return data; 
}