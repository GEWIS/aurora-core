import * as express from 'express';
import { IAuthStrategy } from '@gewis/aurora-core/ports/auth-strategy';
import { AuthUser } from '@gewis/aurora-core/modules/auth/auth-user';
import { HttpApiException, HttpStatusCode } from '@gewis/aurora-core/helpers/custom-error';
import { SecurityGroup } from '@gewis/aurora-core/helpers/security';

export class LocalAuthStrategy implements IAuthStrategy {
  public readonly name = 'local';

  public async authenticate(request: express.Request, scopes: string[]): Promise<AuthUser> {
    if (!request.isAuthenticated() || request.user === undefined) {
      throw new HttpApiException(HttpStatusCode.Unauthorized, 'You are not logged in.');
    }
    if (scopes.includes('*') && request.user.roles.length > 0) {
      return request.user;
    }
    if (scopes.some((scope) => request.user!.roles.includes(scope as SecurityGroup))) {
      return request.user;
    }

    throw new HttpApiException(HttpStatusCode.Forbidden);
  }
}
