export class ApiError extends Error {
  code: number;
  message: string;
  details?: any;

  constructor(code: number, message: string, details?: any) {
    super(message);
    this.code = code;
    this.message = message;
    this.details = details;
  }
}