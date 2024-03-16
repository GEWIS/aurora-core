import * as express from 'express';
import { ApiException, HttpStatusCode } from '../../helpers/customError';
import { User } from './user';

export async function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes: string[] = [],
): Promise<User> {
  if (securityName === 'local') {
    if (!request.isAuthenticated() || request.user === undefined) {
      throw new ApiException(HttpStatusCode.Unauthorized, 'You are not logged in.');
    }
    const user = request.user as User;

    // Everyone can access, but needs at least one role
    if (scopes.includes('*') && user.roles.length > 0) {
      return request.user as User;
    }
    // Should have one overlapping role/scope
    if (scopes.some((scope) => user.roles.includes(scope))) {
      return request.user as User;
    }

    throw new ApiException(HttpStatusCode.Forbidden);
  }
  throw new ApiException(HttpStatusCode.InternalServerError, 'Unknown security scheme.');
}
