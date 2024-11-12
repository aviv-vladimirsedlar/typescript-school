import jwt from "jsonwebtoken";
import { AppError } from "../errors/appError";
import { UnauthorizedError } from "../errors/unauthorizedError";
import { AuthenticatedRequest } from "../types/requests";

interface DecodedToken {
  userId: string;
}

export const isAuth = async (req: AuthenticatedRequest) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new UnauthorizedError();
  }

  const token = authHeader.split(" ")[1];
  let decodedToken: DecodedToken;
  try {
    decodedToken = jwt.verify(token, "secret") as { userId: string };
  } catch (err) {
    throw new UnauthorizedError();
  }

  if (!decodedToken) {
    throw new UnauthorizedError();
  }

  req.userId = decodedToken.userId;
};
