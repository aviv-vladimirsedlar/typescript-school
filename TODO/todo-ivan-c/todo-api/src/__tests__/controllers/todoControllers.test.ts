import { Request, Response, NextFunction } from "express";
import { getTodos } from "../../controllers/todoControllers";
import { Todo } from "../../models/todoModel";

jest.mock("../../models/todoModel", () => ({
  Todo: {
    findAndCountAll: jest.fn(),
  },
}));

describe("getTodos", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      userId: 1,
      query: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  it("should call next with an error when the database operation fails", async () => {
    (Todo.findAndCountAll as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    await getTodos(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));

    const error = (next as jest.Mock).mock.calls[0][0];
    expect(error.statusCode).toBe(500);
    expect(error.message).toBe("Database error");
  });
});
