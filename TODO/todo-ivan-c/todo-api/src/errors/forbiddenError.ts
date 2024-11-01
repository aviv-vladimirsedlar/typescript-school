import { AppError } from "./appError";

export class ForbiddenError extends AppError {
  constructor() {
    super("Forbidden", 403);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}
