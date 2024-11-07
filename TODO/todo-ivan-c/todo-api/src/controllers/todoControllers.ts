import { FastifyReply } from "fastify";
import { Todo } from "../models/todoModel";
import { User } from "../models/userModel";
import { Op } from "sequelize";
import { ForbiddenError } from "../errors/forbiddenError";
import { NotFoundError } from "../errors/notFoundError";
import {
  CreateTodoRequest,
  DeleteTodoRequest,
  GetTodosRequest,
  UpdateTodoRequest,
} from "../types/requests";
import { InternalError } from "../errors/internalError";

export const createTodo = async (
  req: CreateTodoRequest,
  reply: FastifyReply
) => {
  try {
    const { title, description } = req.body;
    const userId = req.userId;

    const user = await User.findByPk(userId);
    if (!user) {
      return reply.status(401).send({ message: "Unauthorized" });
    }

    const todo = await Todo.create({
      title,
      description,
      userId: user.id,
    });

    reply.status(201).send({
      id: todo.id,
      title: todo.title,
      description: todo.description,
    });
  } catch (err) {
    throw new InternalError(err);
  }
};

export const updateTodo = async (
  req: UpdateTodoRequest,
  reply: FastifyReply
) => {
  try {
    const { title, description } = req.body;
    const todoId = req.params.todoId;
    const userId = req.userId;

    const todo = await Todo.findByPk(todoId);
    if (!todo) {
      throw new NotFoundError();
    }

    if (todo.userId !== parseInt(userId, 10)) {
      throw new ForbiddenError();
    }

    todo.title = title;
    todo.description = description;
    await todo.save();

    reply.status(200).send({
      id: todo.id,
      title: todo.title,
      description: todo.description,
    });
  } catch (err) {
    throw new InternalError(err);
  }
};

export const deleteTodo = async (
  req: DeleteTodoRequest,
  reply: FastifyReply
) => {
  try {
    const todoId = req.params.todoId;
    const userId = req.userId;

    const todo = await Todo.findByPk(todoId);
    if (!todo) {
      throw new NotFoundError();
    }

    if (todo.userId !== parseInt(userId, 10)) {
      throw new ForbiddenError();
    }

    await todo.destroy();
    reply.status(204).send();
  } catch (err) {
    throw new InternalError(err);
  }
};

export const getTodos = async (req: GetTodosRequest, reply: FastifyReply) => {
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

    reply.status(200).send({
      data: result.rows,
      page,
      limit,
      total: result.count,
    });
  } catch (err) {
    throw new InternalError(err);
  }
};
