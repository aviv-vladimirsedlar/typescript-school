import { FastifyReply } from "fastify";
import { getTodos } from "../../controllers/todoControllers";
import { Todo } from "../../models/todoModel";
import { GetTodosRequest } from "../../types/requests";
import { InternalError } from "../../errors/internalError";

jest.mock("../../models/todoModel", () => ({
  Todo: {
    findAndCountAll: jest.fn(),
  },
}));

describe("getTodos", () => {
  let req: Partial<GetTodosRequest>;
  let reply: Partial<FastifyReply>;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      userId: "1",
      query: {},
    };

    reply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  it("should throw an AppError when the database operation fails", async () => {
    (Todo.findAndCountAll as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    await expect(
      getTodos(req as GetTodosRequest, reply as FastifyReply)
    ).rejects.toMatchObject(new InternalError());
  });
});
