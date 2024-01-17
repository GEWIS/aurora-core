import * as express from 'express';
import { ApiError, HTTPStatus } from '../../helpers/customError';

export async function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes?: string[],
): Promise<any> {
  if (securityName === 'oidc') {
    if (!request.isAuthenticated() || request.user === undefined) {
      // TODO this only throws 500 with no insight
      throw new ApiError(HTTPStatus.Unauthorized, 'You are not logged in.');
    }
    return request.user;
  }
  // TODO this only throws 500 with no insight
  throw new ApiError(HTTPStatus.InternalServerError, 'Unknown security scheme.');
}
