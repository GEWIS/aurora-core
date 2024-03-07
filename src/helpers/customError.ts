import { HttpStatusCode } from 'axios';

export { HttpStatusCode } from 'axios';

export class ApiException extends Error {
  public statusCode: number;

  constructor(statusCode: HttpStatusCode, message?: string) {
    super(message);

    this.name = HttpStatusCode[statusCode].replace(/([A-Z][a-z])/g, ' $1').trim();
    this.statusCode = statusCode;
  }
}
