import { Router } from "express";
import { body } from "express-validator";
import { User } from "../models/userModel";
import { login, register } from "../controllers/userControllers";

const router = Router();

router.post(
  "/register",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, req) => {
        return User.findOne({
          where: {
            email: value,
          },
        }).then((user) => {
          if (user) {
            return Promise.reject("Email address already exists");
          }
        });
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 4 }),
    body("name")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters long"),
  ],
  register
);

router.post("/login", login);

export default router;
