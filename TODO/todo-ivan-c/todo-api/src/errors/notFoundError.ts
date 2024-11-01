import { AppError } from "./appError";

export class NotFoundError extends AppError {
  constructor() {
    super("Not found", 404);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
