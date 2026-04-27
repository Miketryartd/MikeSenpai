import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import {TokenPayload} from "../Type/Interface.js";

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Access token required" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_TOKEN_REF_PRIV as string
    ) as TokenPayload;

    req.user = decoded; 

    next();
  } catch (err) {
    return res.status(403).json({
      message: "Invalid or expired token",
    });
  }
};

export default authenticateToken;