import * as express from 'express';
import { ApiError, HttpStatusCode } from '../../helpers/customError';

export async function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes?: string[],
): Promise<any> {
  if (securityName === 'oidc') {
    if (!request.isAuthenticated() || request.user === undefined) {
      throw new ApiError(HttpStatusCode.Unauthorized, 'You are not logged in.');
    }
    return request.user;
  }
  throw new ApiError(HttpStatusCode.InternalServerError, 'Unknown security scheme.');
}
