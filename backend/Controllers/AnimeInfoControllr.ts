import { Request, Response } from "express";


export const getAnimeInfo = async (req: Request, res: Response) => {

    try{
        
        const {id} = req.params; 
        if (!id) return res.status(404).json({error: "Missing id"});
        const url = `https://anipub.xyz/api/info/${id}`;
        const resp = await fetch(url);
        if (!resp) return res.status(400).json({error: "bad req"});
        const d = await resp.json();

        return res.status(200).json(d);

    } catch (err){
        console.error("Server error", err);
        return res.status(500).json({error: "internal error", err});
    }
}