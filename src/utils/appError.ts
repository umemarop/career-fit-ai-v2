export class AppError extends Error {
  public status: "fail" | "error";
  public isOperational: boolean;

  public errors?: Record<string, string>;

  constructor(
    message: string,
    public statusCode: number,
    errors?: Record<string, string>,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
    this.isOperational = true;

    if (errors) {
      this.errors = errors;
    }

    Error.captureStackTrace(this, this.constructor);
  }
}
