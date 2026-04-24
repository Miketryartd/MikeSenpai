import { Request, Response } from "express";


export const getStream = async (req: Request, res: Response) => {

    try{
        const {id} = req.params;
        const url = `https://anipub.xyz/v1/api/details/${id}`
        const response = await fetch(url);
        if (!response.ok) return res.status(400).json({error: "Error connecting to api"});
        const data = await response.json();
        if (!data ) return res.status(404).json({error: "missing streaming links"});
        return res.status(200).json(data);

    } catch (error){
        console.error("Error fetching api from backend to api", error);
    }
}