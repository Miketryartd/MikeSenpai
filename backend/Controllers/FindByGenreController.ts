    import { Request, Response } from "express";

    export const findByGenre = async (req: Request, res: Response) => {
    try {
        const { genre } = req.params;                                    // from /:genre
        const page = req.query.page ? Number(req.query.page) : 1;       // 👈 from ?page=1

        if (!genre) {
        return res.status(400).json({ error: "Genre is required" });
        }

        if (isNaN(page) || page < 1) {
        return res.status(400).json({ error: "Invalid page number" });
        }

        const url = `https://anipub.xyz/api/findbyGenre/${genre}?Page=${page}`;
        console.log("Calling AniPub:", url);

        const response = await fetch(url);
        console.log("AniPub responded with status:", response.status);

        if (!response.ok) {
        return res.status(response.status).json({ error: "Failed to fetch from AniPub" });
        }

        const data = await response.json();
        console.log("AniPub data keys:", Object.keys(data));

        if (!data || !data.wholePage) {
        return res.status(500).json({ error: "Invalid data structure from API" });
        }

        return res.status(200).json(data);

    } catch (err) {
        console.error("REAL ERROR:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
    };