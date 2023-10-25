export enum HTTPStatus {
  NoContent = 'No Content',
  BadRequest = 'Bad Request',
  Unauthorized = 'Unauthorized',
  Forbidden = 'Forbidden',
  InternalServerError = 'Internal Server Error',
  NotFound = 'Not Found',
}

const StatusToCode = {
  'No Content': 204,
  'Not Found': 404,
  'Bad Request': 400,
  Unauthorized: 401,
  Forbidden: 403,
  'Internal Server Error': 500,
};

export interface ValidateErrorJSON {
  message: 'Validation failed';
  details: { [name: string]: unknown };
}

export interface InternalError {
  message: 'Internal Server Error';
}
export class ApiError extends Error {
  public statusCode: number;

  constructor(status: HTTPStatus, message?: string) {
    super(message);
    this.name = status;
    this.statusCode = StatusToCode[status];
  }
}
