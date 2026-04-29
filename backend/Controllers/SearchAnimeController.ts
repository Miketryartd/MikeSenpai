
import { Request, Response } from "express";
import SearchVal from "../ZodMod/SearchInputVal.js";
import { ANIME } from "@consumet/extensions";

const animekai = new ANIME.AnimeKai();

export const SearchAnime = async (req: Request, res: Response) => {
    try {
      const parsed = SearchVal.safeParse(req.params);
  
      if (!parsed.success) {
        return res.status(400).json({ error: "Missing search query" });
      }
  
      const { query } = parsed.data;
      
      console.log("Search query:", query);
  

      let data = null;
      let source = "anipub";
      
      const anipubUrl = `https://anipub.xyz/api/search/${encodeURIComponent(query)}`;
      console.log("Trying Anipub:", anipubUrl);
      
      try {
        const response = await fetch(anipubUrl);
        if (response.ok) {
          data = await response.json();
          console.log("Anipub returned:", data?.results?.length || 0, "results");
        } else {
          console.log("Anipub returned status:", response.status);
        }
      } catch (err) {
        console.log("Anipub fetch error:", err);
      }
      

      if (!data || !data.results || data.results.length === 0) {
        console.log("Falling back to AnimeKai for:", query);
        source = "animekai";
        
        try {
          const animeKaiResults = await animekai.search(query, 1);
          if (animeKaiResults && animeKaiResults.results) {
            const title = (anime: any) => {
              if (typeof anime.title === 'string') return anime.title;
              return anime.title?.english || anime.title?.romaji || "Unknown";
            };
            
            data = {
              results: animeKaiResults.results.map((anime: any) => ({
                Id: anime.id,
                Name: title(anime),
                Image: anime.image || "",
                finder: title(anime).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                rating: anime.rating,
                type: anime.type
              })),
              found: animeKaiResults.results.length > 0
            };
            console.log("AnimeKai returned:", data.results.length, "results");
          }
        } catch (animeKaiErr) {
          console.error("AnimeKai search error:", animeKaiErr);
        }
      }
      
      
      if (!data || !data.results || data.results.length === 0) {
        console.log("No results found for:", query);
        return res.status(200).json({ 
          results: [], 
          found: false, 
          message: `No results found for "${query}". Try typing more letters or checking spelling.`
        });
      }
  
      console.log("Final results count:", data.results?.length || 0);
      return res.status(200).json(data);
      
    } catch (error) {
      console.error("Error getting search anime", error);
      return res.status(500).json({
        error: error instanceof Error ? error.message : "Server error",
        results: [],
        found: false
      });
    }
  };
