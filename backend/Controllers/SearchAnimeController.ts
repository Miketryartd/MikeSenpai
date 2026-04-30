// backend/Controllers/SearchAnimeController.ts
import { Request, Response } from "express";
import SearchVal from "../ZodMod/SearchInputVal.js";
import { ANIME } from "@consumet/extensions";

const animeunity = new ANIME.AnimeUnity();

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'en-US,en;q=0.9',
  'Referer': 'https://anipub.xyz/',
  'Origin': 'https://anipub.xyz'
};

const commonAnimeMap: Record<string, string[]> = {
  "r": ["Re:Zero", "Record of Ragnarok", "Rent-a-Girlfriend", "Rising of the Shield Hero", "Rurouni Kenshin"],
  "e": ["Erased", "Eminence in Shadow", "Edens Zero", "Eureka Seven", "Elfen Lied"],
  "n": ["Naruto", "Neon Genesis Evangelion", "Noragami", "Nisekoi", "No Game No Life"],
  "o": ["One Piece", "One Punch Man", "Overlord", "Orange", "Ouran High School Host Club"],
  "a": ["Attack on Titan", "Akame ga Kill", "Angel Beats", "Assassination Classroom", "A Silent Voice"],
  "k": ["Kimetsu no Yaiba", "Kaguya-sama", "Kuroko no Basket", "K-On!", "Kill la Kill"],
  "s": ["Sword Art Online", "Steins;Gate", "Soul Eater", "Spy x Family", "Shingeki no Kyojin"],
  "d": ["Death Note", "Demon Slayer", "Dragon Ball", "Dr. Stone", "Darling in the Franxx"],
  "f": ["Fairy Tail", "Fullmetal Alchemist", "Fate/Stay Night", "Fire Force", "Fruits Basket"],
  "b": ["Bleach", "Black Clover", "Boruto", "Bungo Stray Dogs", "Blue Lock"],
  "t": ["Tokyo Ghoul", "Toradora!", "Tower of God", "The Promised Neverland", "To Your Eternity"],
  "h": ["Hunter x Hunter", "Haikyuu!!", "Horimiya", "Higurashi", "Hellsing"],
  "c": ["Code Geass", "Cowboy Bebop", "Chainsaw Man", "Clannad", "Cyberpunk Edgerunners"],
  "m": ["My Hero Academia", "Mushoku Tensei", "Mob Psycho 100", "Made in Abyss", "Monogatari"],
  "p": ["Parasyte", "Psycho-Pass", "Platinum End", "Pokemon", "Penguindrum"],
  "g": ["Gintama", "Goblin Slayer", "Golden Time", "Gurren Lagann", "Gate"],
  "j": ["Jujutsu Kaisen", "JoJo's Bizarre Adventure", "Jormungand", "Juni Taisen", "Jigokuraku"],
  "l": ["Love is War", "Log Horizon", "Land of the Lustrous", "Lucky Star", "Little Witch Academia"],
  "w": ["Wolf Children", "Weathering With You", "Wonder Egg Priority", "Welcome to Demon School", "Wotakoi"],
  "y": ["Your Name", "Your Lie in April", "Yuri on Ice", "Yona of the Dawn", "Yamada-kun"],
  "z": ["Zankyou no Terror", "Zombie Land Saga", "Zatch Bell", "Zetsuen no Tempest", "Zom 100"]
};

const getTitle = (title: any): string => {
  if (typeof title === 'string') return title;
  if (title?.english) return title.english;
  if (title?.romaji) return title.romaji;
  if (title?.native) return title.native;
  return "Unknown";
};

export const SearchAnime = async (req: Request, res: Response) => {
  try {
    const parsed = SearchVal.safeParse(req.params);

    if (!parsed.success) {
      return res.status(400).json({ error: "Missing search query" });
    }

    let { query } = parsed.data;
    query = query.trim().toLowerCase();
    
    console.log("SEARCH QUERY:", query);

    let data: any = null;
    let source = "animeunity";

    if (query.length <= 2) {
      const suggestions = commonAnimeMap[query];
      if (suggestions && suggestions.length > 0) {
        console.log(`Short query "${query}" - fetching suggestions from AnimeUnity`);
        
        const suggestionResults = [];
        for (const suggestion of suggestions.slice(0, 6)) {
          try {
            const res = await animeunity.search(suggestion);
            if (res.results && res.results.length > 0) {
              for (const result of res.results.slice(0, 3)) {
                suggestionResults.push({
                  Id: result.id,
                  Name: getTitle(result.title),
                  Image: result.image || "",
                  finder: getTitle(result.title).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                  source: "animeunity"
                });
              }
            }
          } catch (err) {
            console.log(`Error fetching suggestion for ${suggestion}:`, err);
          }
        }
        
        const uniqueResults = [];
        const seenIds = new Set();
        for (const result of suggestionResults) {
          if (!seenIds.has(result.Id)) {
            seenIds.add(result.Id);
            uniqueResults.push(result);
          }
        }
        
        if (uniqueResults.length > 0) {
          return res.status(200).json({
            results: uniqueResults.slice(0, 20),
            found: true,
            searchQuery: query,
            source: "animeunity"
          });
        }
      }
    }

    console.log("Trying AnimeUnity for:", query);
    
    try {
      const unityResults = await animeunity.search(query);
      if (unityResults.results && unityResults.results.length > 0) {
        data = {
          results: unityResults.results.map((anime: any) => ({
            Id: anime.id,
            Name: getTitle(anime.title),
            Image: anime.image || "",
            finder: getTitle(anime.title).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            rating: anime.rating,
            type: anime.type,
            source: "animeunity"
          })),
          found: true,
          source: "animeunity"
        };
        console.log("AnimeUnity returned:", data.results.length, "results");
      }
    } catch (err) {
      console.log("AnimeUnity search failed:", err);
    }

    if (!data || !data.results || data.results.length === 0) {
      console.log("Falling back to Anipub for:", query);
      source = "anipub";
      
      try {
        const anipubUrl = `https://anipub.xyz/api/search/${encodeURIComponent(query)}`;
        const response = await fetch(anipubUrl, { headers });
        
        if (response.ok) {
          const anipubData = await response.json();
          if (Array.isArray(anipubData) && anipubData.length > 0) {
            data = {
              results: anipubData.map((anime: any) => ({
                Id: anime.Id || anime._id,
                Name: anime.Name || anime.title,
                Image: anime.Image || anime.image,
                finder: (anime.Name || anime.title).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                source: "anipub"
              })),
              found: true,
              source: "anipub"
            };
            console.log("Anipub returned:", data.results.length, "results");
          }
        }
      } catch (err) {
        console.log("Anipub search failed:", err);
      }
    }

    if (!data || !data.results || data.results.length === 0) {
      console.log("No results found for:", query);
      return res.status(200).json({
        results: [],
        found: false,
        message: `No results found for "${query}". Try different keywords.`
      });
    }

    const responseData = {
      results: data.results,
      found: data.found,
      source: source,
      searchQuery: query
    };
    
    console.log(`Final: ${data.results.length} results from ${source}`);
    return res.status(200).json(responseData);

  } catch (error) {
    console.error("Error getting search anime", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Server error",
    });
  }
};