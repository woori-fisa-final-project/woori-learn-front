export class ApiError extends Error {
  status: number;
  details?: any;

  constructor(status: number, message: string, details?: any) {
    super(message);
    
    Object.setPrototypeOf(this, ApiError.prototype); // TS에서 instanceof 보장
    
    this.name = "ApiError";
    this.status = status;
    this.details = details;
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}