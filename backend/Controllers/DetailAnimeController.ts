import { Request, Response } from "express";


export const getDetails = async (req: Request, res: Response) => {

    try{
        
        const {id} = req.params;
        const url = `https://anipub.xyz/anime/api/details/${id}`;
        const response = await fetch(url);
      if (response.status === 429 || response.status === 400) {
  return res.status(200).json(null);
}
if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
         
        const data = await response.json();
      
        if (typeof data !== "object") return res.status(400).json({error: "its not a n object"});
        return res.status(200).json(data);


    } catch (error) {
        console.error("Error fetching url", error);
        return res.status(500).json({error: "server error"});
    }
}