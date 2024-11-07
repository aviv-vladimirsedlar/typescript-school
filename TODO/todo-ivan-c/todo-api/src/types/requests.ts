import { FastifyRequest } from "fastify";

export interface RegisterRequestBody {
  email: string;
  password: string;
  name?: string;
}

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface CreateTodoRequestBody {
  title: string;
  description: string;
}

export interface UpdateTodoRequestBody {
  title: string;
  description: string;
}

export interface CreateTodoRequest extends FastifyRequest {
  body: CreateTodoRequestBody;
  userId: string;
}

export interface UpdateTodoRequest extends FastifyRequest {
  body: UpdateTodoRequestBody;
  params: {
    todoId: string;
  };
  userId: string;
}

export interface DeleteTodoRequest extends FastifyRequest {
  params: {
    todoId: string;
  };
  userId: string;
}

export interface GetTodosRequest extends FastifyRequest {
  userId: string;
  query: {
    page?: string;
    limit?: string;
    filter?: string;
    sort?: string;
  };
}

export interface AuthenticatedRequest extends FastifyRequest {
  userId?: string;
}
