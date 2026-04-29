
import { Request, Response } from "express";
import UserSchemaZOD from "../ZodMod/UserZod.js";
import User from "../Models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const UserLogin = async (req: Request, res: Response) => {
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
    if (!validatedData) {
      return res.status(400).json({ error: "Missing data" });
    }

    
    const user = await User.findOne({ email: email });
    
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

   
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    
    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email
      },
      process.env.JWT_TOKEN_REF_PRIV as string,
      { expiresIn: "7d" }
    );

    console.log("Successfully logged in:", user.email);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        email: user.email,
      },
      token,
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({
      message: "Server error",
      error: String(err),
    });
  }
};