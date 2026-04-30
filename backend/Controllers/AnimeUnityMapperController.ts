
import { Request, Response } from "express";
import { ANIME } from "@consumet/extensions";
import { createCache } from "../Utilities/cache.js";

const animeunity = new ANIME.AnimeUnity();
const cache = createCache<any>();

const getStringParam = (param: any): string => {
  if (!param) return "";
  if (Array.isArray(param)) return param[0];
  if (typeof param === 'string') return param;
  return "";
};

const getTitle = (title: any): string => {
  if (typeof title === 'string') return title;
  if (title?.english) return title.english;
  if (title?.romaji) return title.romaji;
  if (title?.native) return title.native;
  return "";
};

const normalizeTitle = (title: string): string => {
  return title.toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
};

const extractAnimeNameFromKaiId = (kaiId: string): string => {
  let cleaned = kaiId.replace(/-(\d+)(p|s)?$/i, '');
  cleaned = cleaned.replace(/-/g, ' ');
  cleaned = cleaned.replace(/\d+$/, '');
  return cleaned.trim();
};

export const mapAnimeKaiToAnimeUnity = async (req: Request, res: Response) => {
  try {
    const searchQuery = getStringParam(req.params.animeKaiId);
    const decodedQuery = decodeURIComponent(searchQuery);
    
    const animeName = extractAnimeNameFromKaiId(decodedQuery);
    
    console.log(`Original AnimeKai ID: "${decodedQuery}"`);
    console.log(`Extracted anime name: "${animeName}"`);
    
    const cacheKey = `unity-search-${animeName.toLowerCase().replace(/\s+/g, '-')}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.status(200).json(cached);
    }

    const searchResults = await animeunity.search(animeName);
    
    if (!searchResults.results || searchResults.results.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: `No results found for "${animeName}"`,
        originalTitle: decodedQuery
      });
    }

    const normalizedSearchTitle = normalizeTitle(animeName);
    let bestMatch = null;
    let bestScore = 0;

    for (const result of searchResults.results) {
      const resultTitle = getTitle(result.title);
      const normalizedResultTitle = normalizeTitle(resultTitle);
      
      let score = 0;
      if (normalizedResultTitle === normalizedSearchTitle) {
        score = 100;
      } else if (normalizedResultTitle.includes(normalizedSearchTitle) || 
                 normalizedSearchTitle.includes(normalizedResultTitle)) {
        score = 75;
      }
      
      const titleWords = normalizedSearchTitle.split(' ');
      for (const word of titleWords) {
        if (word.length > 2 && normalizedResultTitle.includes(word)) {
          score += 10;
        }
      }
      
      if (score > bestScore) {
        bestScore = score;
        bestMatch = result;
      }
    }

    if (!bestMatch) {
      bestMatch = searchResults.results[0];
    }

    const result = {
      success: true,
      originalTitle: decodedQuery,
      extractedName: animeName,
      animeUnityId: bestMatch.id,
      animeUnityTitle: getTitle(bestMatch.title),
      matchConfidence: bestScore,
      animeUnityData: {
        id: bestMatch.id,
        title: getTitle(bestMatch.title),
        image: bestMatch.image,
        type: bestMatch.type,
        rating: bestMatch.rating
      }
    };

    cache.set(cacheKey, result);
    return res.status(200).json(result);

  } catch (error: any) {
    console.error("Mapping error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const testSearch = async (req: Request, res: Response) => {
  try {
    const query = getStringParam(req.params.query);
    const decodedQuery = decodeURIComponent(query);
    
    const extractedName = extractAnimeNameFromKaiId(decodedQuery);
    
    console.log(`Test search - Original: "${decodedQuery}", Extracted: "${extractedName}"`);
    
    const searchResults = await animeunity.search(extractedName);
    
    return res.json({
      success: true,
      originalQuery: decodedQuery,
      extractedName: extractedName,
      resultCount: searchResults.results?.length || 0,
      firstResult: searchResults.results?.[0] ? {
        id: searchResults.results[0].id,
        title: getTitle(searchResults.results[0].title)
      } : null
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};