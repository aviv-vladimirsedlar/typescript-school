import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import { User } from "../models/userModel";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../errors/unauthorizedError";
import { ValidationError } from "../errors/validationError";

export const register = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError(errors.array());
  }

  const { email, password, name } = req.body;

  bcrypt
    .hash(password, 12)
    .then((hashedPw) => {
      const user = User.build({
        email,
        password: hashedPw,
        name,
      });
      return user.save();
    })
    .then((result: any) => {
      res.status(201).json({ userId: result.id });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      throw error;
    });
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser: User;
  User.findOne({
    where: {
      email: email,
    },
  })
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError();
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        throw new UnauthorizedError();
      }

      const token = jwt.sign({ userId: loadedUser.id.toString() }, "secret", {
        expiresIn: "1h",
      });
      res.status(200).json({ token });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
