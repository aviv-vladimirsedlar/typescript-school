export class AppError extends Error {
  public statusCode: number;
  public originalError?: any;

  constructor(message: string, statusCode: number = 500, originalError?: any) {
    super(message);
    this.statusCode = statusCode;
    this.originalError = originalError;

    // Set the prototype explicitly when extending built-ins in TypeScript.
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
