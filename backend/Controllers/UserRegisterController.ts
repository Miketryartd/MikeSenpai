import { Request, Response } from "express";
import UserSchemaZOD from "../ZodMod/UserZod.js";
import User from "../Models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const UserRegister = async (req: Request, res: Response) => {
  try {
  
    const { email, password } = req.body;

    const result = UserSchemaZOD.safeParse({ email, password });

    if (!result.success) {
      return res.status(400).json({ 
        message: "Validation failed",
        errors: result.error.flatten(),
      });
    }

    const validatedData = result.data;
    if (!validatedData) return res.status(404).json({error: "missing data"});
    
    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
        email: email,
        password: hashedPassword,
    });

    const savedUser = await newUser.save();
    console.log("user saved:", savedUser);

    const token = jwt.sign({
        _id: savedUser._id, email: savedUser.email
    },
    process.env.JWT_TOKEN_REF_PRIV as string,
{expiresIn: "7d"});
     
console.log("succesfully created acc");
    return res.status(200).json({
        user: savedUser,
        token,
    })
   


  } catch (err) {
    console.error("REGISTER ERROR:", err); 
    return res.status(500).json({
      message: "Server error",
      error: String(err),
    });
  }
};