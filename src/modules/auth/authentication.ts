import * as express from 'express';
import { HttpApiException, HttpStatusCode } from '../../helpers/customError';
import { User } from './user';

export async function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes: string[] = [],
): Promise<User> {
  if (securityName === 'local') {
    console.log(request.isAuthenticated());
    if (!request.isAuthenticated() || request.user === undefined) {
      console.log('!');
      throw new HttpApiException(HttpStatusCode.Unauthorized, 'You are not logged in.');
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

    throw new HttpApiException(HttpStatusCode.Forbidden);
  }
  throw new HttpApiException(HttpStatusCode.InternalServerError, 'Unknown security scheme.');
}
