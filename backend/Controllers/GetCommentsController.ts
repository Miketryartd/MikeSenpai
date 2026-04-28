import { Request, Response } from "express";
import CommentMod from "../Models/Comments.js";


export const getComments = async (req: Request, res: Response) => {
  try {
    const { id, finder } = req.params;
    const location = `${id} ${finder}`;

    const comments = await CommentMod.find({ location })
      .sort({ createdAt: -1 }); 

    return res.status(200).json(comments);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};