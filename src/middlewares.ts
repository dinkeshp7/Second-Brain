import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "./config";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

interface MyJwtPayload extends JwtPayload {
  id: string;
}

export const userMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    res.status(401).json({
      message: "Unauthorized: token missing"
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as MyJwtPayload;
    req.userId = decoded.id;
    next();
  } catch (e) {
    res.status(401).json({
      message: "Unauthorized user"
    });
  }
};