import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

// Improved interface with accurate type for userID
export interface AuthRequest extends Request {
  userID?: string; // Changed to string (JWT stores _id as string)
}

export const isAuthenticated = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from headers (improved type check)
    const token = req.headers.authorization?.split(" ")[1] || req.headers.token;
    if (typeof token !== "string" || !token) {
      res.status(401).json({ message: "Authentication required" }); // 401 for auth errors
      return;
    }

    // Validate secret key presence
    if (!process.env.SECRET_KEY) {
      res.status(500).json({ message: "Server configuration error" });
      return;
    }

    // Verify token and type cast correctly
    const decoded = jwt.verify(token, process.env.SECRET_KEY) as { userID: string };
    req.userID = decoded.userID; // Now properly typed as string
    next();
  } catch (err) {
    console.error("Authentication error:", err);
    res.status(401).json({ message: "Invalid or expired token" }); // Generic message for security
    return;
  }
};
