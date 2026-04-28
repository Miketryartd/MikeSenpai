import { Request, Response } from "express"

export const pingBackend = (req: Request, res: Response) => {
      
    res.status(200).json({status: "ok"});
}