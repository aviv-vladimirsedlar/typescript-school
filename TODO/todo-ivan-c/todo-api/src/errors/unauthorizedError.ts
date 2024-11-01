import { AppError } from "./appError";

export class UnauthorizedError extends AppError {
  constructor(data?: any) {
    super("Unauthorized", 401, data);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}
