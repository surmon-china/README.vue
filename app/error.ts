// HTTP status
export enum HttpStatus {
  BAD_REQUEST = 400,
  INTERNAL_SERVER_ERROR = 500
}

export class HttpError extends Error {
  public statusCode: number

  constructor(message: string, statusCode?: number) {
    super(message)
    this.statusCode = statusCode ?? HttpStatus.BAD_REQUEST
    this.name = 'HttpError'
    // Ensure the stack trace is captured correctly
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HttpError)
    }
  }
}

export const isHttpError = (error: Error): error is HttpError => {
  return error.name === 'HttpError' || error instanceof HttpError
}
