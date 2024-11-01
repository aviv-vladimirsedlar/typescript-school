import { AppError } from "./appError";

export class ValidationError extends AppError {
  constructor(data?: any) {
    super("Validation failed", 422, data);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
