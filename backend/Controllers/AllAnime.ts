import { Request, Response } from "express";

export const getAllAnime = async (req: Request, res: Response) => {
  try {
    const response = await fetch("https://anipub.xyz/api/getAll");

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