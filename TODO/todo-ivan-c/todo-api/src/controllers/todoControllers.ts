import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { Todo } from "../models/todoModel";
import { User } from "../models/userModel";
import { Op } from "sequelize";
import { ForbiddenError } from "../errors/forbiddenError";
import { UnauthorizedError } from "../errors/unauthorizedError";
import { NotFoundError } from "../errors/notFoundError";
import { ValidationError } from "../errors/validationError";

export const createTodo = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError(errors.array());
  }

  const { title, description } = req.body;
  const userId = req.userId;

  User.findByPk(userId)
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError();
      }

      const todo = Todo.build({
        title,
        description,
        userId: user.id,
      });

      return todo.save();
    })
    .then((result: any) => {
      res.status(201).json({
        id: result.id,
        title: result.title,
        description: result.description,
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

export const updateTodo = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError(errors.array());
  }

  const { title, description } = req.body;
  const todoId = req.params.todoId;
  const userId = req.userId;

  Todo.findByPk(todoId)
    .then((todo) => {
      if (!todo) {
        throw new NotFoundError();
      }

      if (todo.userId !== userId) {
        throw new ForbiddenError();
      }

      todo.title = title;
      todo.description = description;

      return todo.save();
    })
    .then((result: any) => {
      res.status(200).json({
        id: result.id,
        title: result.title,
        description: result.description,
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

export const deleteTodo = (req: Request, res: Response, next: NextFunction) => {
  const todoId = req.params.todoId;
  const userId = req.userId;

  Todo.findByPk(todoId)
    .then((todo) => {
      if (!todo) {
        throw new NotFoundError();
      }

      if (todo.userId !== userId) {
        throw new ForbiddenError();
      }

      return todo.destroy();
    })
    .then(() => {
      res.status(204).send();
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

export const getTodos = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    const filter = req.query.filter ? (req.query.filter as string) : "";
    const sort = req.query.sort ? (req.query.sort as string) : "ASC";

    const whereClause = filter
      ? { userId, title: { [Op.like]: `%${filter}%` } }
      : { userId };

    const result = await Todo.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [["title", sort]],
    });

    res.status(200).json({
      data: result.rows,
      page,
      limit,
      total: result.count,
    });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
