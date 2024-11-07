import { AppError } from "./appError";

export class InternalError extends AppError {
  constructor(originalError?: any) {
    super("Internal Server Error", 500, originalError);
    Object.setPrototypeOf(this, InternalError.prototype);
  }
}
