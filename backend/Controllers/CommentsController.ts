import { Request, Response } from "express";
import CommentMod from "../Models/Comments.js";
import CommentZod from "../ZodMod/CommentZod.js";

export const addComment = async (req: Request, res: Response) => {
  try {
    console.log("req.user full object:", (req as any).user);
    const userId = (req as any).user._id;
    const userEmail = (req as any).user.email;
    const { comment } = req.body;
    const {id, finder} = req.params;

    const safecomment = CommentZod.safeParse({ comment, id: Number(id), finder });

    if (!safecomment.success) {
      return res.status(400).json({ 
        message: "Validation failed",
        errors: safecomment.error.flatten(),
      });
    }

    const validatedData = safecomment.data;
    const ani_id = Number( validatedData.id);
    const ani_find = validatedData.finder;
    const newComment = new CommentMod({
      uid: userId,
      email: userEmail,
      comment: validatedData.comment,
      id: ani_id,
      finder: ani_find,
     location: `${ani_id} ${ani_find}`,
    });

    await newComment.save();

    return res.status(201).json({
      message: "Comment added successfully",
      data: newComment,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error,
    });
  }
};