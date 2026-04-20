
export async function searchAnime(query: string) {
    const cleanedQuery = query.trim();
  
    if (!cleanedQuery) {
      throw new Error("Empty query");
    }
  
    const url = `http://localhost:3000/mikesenpai/api/searchAnime/${encodeURIComponent(cleanedQuery)}`;
  
    const res = await fetch(url);
  
    if (!res.ok) {
      throw new Error(`Search failed: ${res.status}`);
    }
  
    const data = await res.json();
  
    return data; 
  }