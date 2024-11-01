export class AppError extends Error {
  public statusCode: number;
  public data?: any;

  constructor(message: string, statusCode: number = 500, data?: any) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;

    // Set the prototype explicitly when extending built-ins in TypeScript.
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
