import * as express from 'express';
import { HttpApiException, HttpStatusCode } from '../../helpers/customError';
import { AuthUser } from './authUser';

export async function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes: string[] = [],
): Promise<AuthUser> {
  if (securityName === 'local') {
    if (!request.isAuthenticated() || request.user === undefined) {
      throw new HttpApiException(HttpStatusCode.Unauthorized, 'You are not logged in.');
    }
    const user = request.user as AuthUser;

    // Everyone can access, but needs at least one role
    if (scopes.includes('*') && user.roles.length > 0) {
      return request.user as AuthUser;
    }
    // Should have one overlapping role/scope
    if (scopes.some((scope) => user.roles.includes(scope))) {
      return request.user as AuthUser;
    }

    throw new HttpApiException(HttpStatusCode.Forbidden);
  }
  throw new HttpApiException(HttpStatusCode.InternalServerError, 'Unknown security scheme.');
}
