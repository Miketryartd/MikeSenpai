import { Request, Response } from "express";
import SearchVal from "../ZodMod/SearchInputVal.js";
import { ANIME } from "@consumet/extensions";

const animekai = new ANIME.AnimeKai();

const commonAnimeMap: Record<string, string[]> = {
  "r": ["Re:Zero", "Record of Ragnarok", "Rent-a-Girlfriend", "Rising of the Shield Hero", "Rurouni Kenshin", "Rokka no Yuusha", "Rage of Bahamut", "Ranma 1/2"],
  "e": ["Erased", "Eminence in Shadow", "Edens Zero", "Eureka Seven", "Elfen Lied", "Evangelion", "Eighty Six", "Escaflowne"],
  "n": ["Naruto", "Neon Genesis Evangelion", "Noragami", "Nisekoi", "No Game No Life", "Natsume's Book of Friends", "Nana", "Nanbaka"],
  "o": ["One Piece", "One Punch Man", "Overlord", "Orange", "Ouran High School Host Club", "Odd Taxi", "Oreimo", "Omamori Himari"],
  "a": ["Attack on Titan", "Akame ga Kill", "Angel Beats", "Assassination Classroom", "A Silent Voice", "Akira", "Arifureta", "Another"],
  "k": ["Kimetsu no Yaiba", "Kaguya-sama", "Kuroko no Basket", "K-On!", "Kill la Kill", "K Project", "Kakegurui", "Kino's Journey"],
  "s": ["Sword Art Online", "Steins;Gate", "Soul Eater", "Spy x Family", "Shingeki no Kyojin", "Samurai Champloo", "Seven Deadly Sins", "Sakamoto Desu Ga"],
  "d": ["Death Note", "Demon Slayer", "Dragon Ball", "Dr. Stone", "Darling in the Franxx", "Dorohedoro", "Durarara", "D gray man"],
  "f": ["Fairy Tail", "Fullmetal Alchemist", "Fate/Stay Night", "Fire Force", "Fruits Basket", "FLCL", "Freezing", "Fate Zero"],
  "b": ["Bleach", "Black Clover", "Boruto", "Bungo Stray Dogs", "Blue Lock", "Black Butler", "Blood", "Btooom"],
  "t": ["Tokyo Ghoul", "Toradora!", "Tower of God", "The Promised Neverland", "To Your Eternity", "Trigun", "ToraDora", "Tenchi Muyo"],
  "h": ["Hunter x Hunter", "Haikyuu!!", "Horimiya", "Higurashi", "Hellsing", "Hyouka", "Highschool DxD", "Hajime no Ippo"],
  "c": ["Code Geass", "Cowboy Bebop", "Chainsaw Man", "Clannad", "Cyberpunk Edgerunners", "Claymore", "Chobits", "Charlotte"],
  "m": ["My Hero Academia", "Mushoku Tensei", "Mob Psycho 100", "Made in Abyss", "Monogatari", "Magi", "Mirai Nikki", "Mushishi"],
  "p": ["Parasyte", "Psycho-Pass", "Platinum End", "Pokemon", "Penguindrum", "Persona", "Prison School", "Plastic Memories"],
  "g": ["Gintama", "Goblin Slayer", "Golden Time", "Gurren Lagann", "Gate", "Grand Blue", "Gantz", "Gangsta"],
  "j": ["Jujutsu Kaisen", "JoJo's Bizarre Adventure", "Jormungand", "Juni Taisen", "Jigokuraku", "Jinrui", "Jyu Oh Sei", "Jinki Extend"],
  "l": ["Love is War", "Log Horizon", "Land of the Lustrous", "Lucky Star", "Little Witch Academia", "Lain", "Love Live", "Lupin III"],
  "w": ["Wolf Children", "Weathering With You", "Wonder Egg Priority", "Welcome to Demon School", "Wotakoi", "Welcome to NHK", "Witchblade", "Wolf's Rain"],
  "y": ["Your Name", "Your Lie in April", "Yuri on Ice", "Yona of the Dawn", "Yamada-kun", "Yuyu Hakusho", "Yakitate Japan", "Yosuga no Sora"],
  "z": ["Zankyou no Terror", "Zombie Land Saga", "Zatch Bell", "Zetsuen no Tempest", "Zom 100", "Zegapain", "Zetman", "Zero no Tsukaima"]
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
    
    console.log("🔍 SEARCH QUERY:", query);

    let data: any = null;
    let source = "anipub";
    let anipubFailed = false;


    if (query.length <= 2) {
      const suggestions = commonAnimeMap[query];
      if (suggestions && suggestions.length > 0) {
        console.log(`💡 Short query "${query}" - fetching suggestions from Anipub`);
        
        const suggestionResults = [];
        for (const suggestion of suggestions.slice(0, 6)) {
          try {
            const res = await fetch(`https://anipub.xyz/api/search/${encodeURIComponent(suggestion)}`);
            if (res.ok) {
              const suggestionData = await res.json();
           
              if (Array.isArray(suggestionData) && suggestionData.length > 0) {
                for (const result of suggestionData) {
                  result.source = "anipub";
                  suggestionResults.push(result);
                }
              }
            }
            await new Promise(resolve => setTimeout(resolve, 50));
          } catch (err) {
            console.log(`Error fetching suggestion for ${suggestion}:`, err);
          }
        }
        
      
        const uniqueResults = [];
        const seenIds = new Set();
        for (const result of suggestionResults) {
          const resultId = result.Id;
          if (!seenIds.has(resultId)) {
            seenIds.add(resultId);
            uniqueResults.push(result);
          }
        }
        
        if (uniqueResults.length > 0) {
          return res.status(200).json({
            results: uniqueResults.slice(0, 20),
            found: true,
            searchQuery: query,
            source: "anipub"
          });
        }
      }
    }

   
    console.log(" Trying Anipub for:", query);
    
    try {
      const anipubUrl = `https://anipub.xyz/api/search/${encodeURIComponent(query)}`;
      const response = await fetch(anipubUrl);
      
      if (response.ok) {
        const anipubData = await response.json();
        
    
        const isValid = Array.isArray(anipubData) && anipubData.length > 0;
        
        if (isValid) {
          data = {
            results: anipubData,
            found: true,
            source: "anipub"
          };
          source = "anipub";
          console.log(" Anipub returned:", anipubData.length, "results");
        } else {
          console.log(" Anipub returned empty array or invalid data");
          anipubFailed = true;
        }
      } else {
        console.log(" Anipub returned status:", response.status);
        anipubFailed = true;
      }
    } catch (err) {
      console.log(" Anipub fetch error:", err);
      anipubFailed = true;
    }


    if (anipubFailed || !data || !data.results || !Array.isArray(data.results) || data.results.length === 0) {
      console.log("🔄 Falling back to AnimeKai for:", query);
      source = "animekai";
      
      try {
        const animeKaiResults = await animekai.search(query, 1);
        
        if (animeKaiResults && animeKaiResults.results && Array.isArray(animeKaiResults.results) && animeKaiResults.results.length > 0) {
          data = {
            results: animeKaiResults.results.map((anime: any) => ({
              Id: anime.id,
              Name: getTitle(anime.title),
              Image: anime.image || "",
              finder: getTitle(anime.title).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              rating: anime.rating,
              type: anime.type,
              source: "animekai"
            })),
            found: true,
            source: "animekai"
          };
          console.log(" AnimeKai returned:", data.results.length, "results");
        } else {
          console.log(" AnimeKai also returned no results");
        }
      } catch (animeKaiErr) {
        console.error(" AnimeKai search error:", animeKaiErr);
      }
    }

   
    if (!data || !data.results || !Array.isArray(data.results) || data.results.length === 0) {
      console.log(" No results found for:", query);
      return res.status(200).json({
        results: [],
        found: false,
        message: `No results found for "${query}". Try different keywords.`
      });
    }

   
    if (data.results && !data.results[0]?.source) {
      data.results = data.results.map((result: any) => ({
        ...result,
        source: source
      }));
    }

  
    const responseData = {
      results: data.results,
      found: data.found,
      source: source,
      searchQuery: query
    };
    
    console.log(` Final: ${data.results.length} results from ${source}`);
    return res.status(200).json(responseData);

  } catch (error) {
    console.error("Error getting search anime", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Server error",
    });
  }
};