import { Request, Response } from "express";

export const TopRatedAnime = async (req: Request, res: Response) => {
  try {
   
    const page = req.params.page ? Number(req.params.page) : 1;

  
    if (isNaN(page) || page < 1) {
      return res.status(400).json({ error: "Invalid page number" });
    }


    const url = `https://www.anipub.xyz/api/findbyrating?page=${page}`;

    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Failed to fetch from AniPub",
      });
    }

    const data = await response.json();

    if (!data || !data.AniData) {
      return res.status(500).json({
        error: "Invalid data structure from API",
      });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("server error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};