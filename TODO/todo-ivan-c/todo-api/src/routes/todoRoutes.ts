import { Router } from "express";
import { body } from "express-validator";
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from "../controllers/todoControllers";
import { isAuth } from "../middleware/isAuth";

const router = Router();

router.post(
  "/",
  isAuth,
  [
    body("title").trim().isLength({ min: 1 }).withMessage("Title is required"),
    body("description")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Description is required"),
  ],
  createTodo
);

router.put(
  "/:todoId",
  isAuth,
  [
    body("title").trim().isLength({ min: 1 }).withMessage("Title is required"),
    body("description")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Description is required"),
  ],
  updateTodo
);

router.delete("/:todoId", isAuth, deleteTodo);

router.get("/", isAuth, getTodos);

export default router;
