// backend/Controllers/AllAnimeController.ts
import { Request, Response } from "express";

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'en-US,en;q=0.9',
  'Referer': 'https://anipub.xyz/',
  'Origin': 'https://anipub.xyz'
};

export const getAllAnime = async (req: Request, res: Response) => {
  try {
    const response = await fetch("https://anipub.xyz/api/getAll", { headers });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data) {
      throw new Error("Error fetching all anime data");
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Backend fetch error:", error);
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};