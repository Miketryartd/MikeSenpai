import { Request, Response } from "express";
import SearchVal from "../ZodMod/SearchInputVal.js";


export const SearchAnime = async (req: Request, res: Response) => {
    try {
      const parsed = SearchVal.safeParse(req.params);
  
      if (!parsed.success) {
        return res.status(400).json({ error: "Missing search query" });
      }
  
      const { query } = parsed.data;
  
      const response = await fetch(
        `https://anipub.xyz/api/search/${encodeURIComponent(query)}`
      );
      console.log("QUERY", query);
  
      if (!response.ok) {
        throw new Error(`External API error: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("API RES", data);
      return res.status(200).json(data);
    } catch (error) {
      console.error("Error getting search anime", error);
      return res.status(500).json({
        error: error instanceof Error ? error.message : "Server error",
      });
    }
  };