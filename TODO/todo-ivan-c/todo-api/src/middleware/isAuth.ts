import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/appError";
import { UnauthorizedError } from "../errors/unauthorizedError";

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    throw new UnauthorizedError();
  }

  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "secret") as { userId: string };
  } catch (err) {
    throw new AppError("JWT token verification failed.", 500);
  }

  if (!decodedToken) {
    throw new UnauthorizedError();
  }

  req.userId = parseInt(decodedToken.userId, 10);
  next();
};
