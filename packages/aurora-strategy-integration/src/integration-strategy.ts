import * as express from 'express';
import { IAuthStrategy } from '@gewis/aurora-core/ports/auth-strategy';
import { AuthUser } from '@gewis/aurora-core/modules/auth/auth-user';
import { HttpApiException, HttpStatusCode } from '@gewis/aurora-core/helpers/custom-error';

export class IntegrationAuthStrategy implements IAuthStrategy {
  public readonly name = 'integration';

  public async authenticate(request: express.Request, scopes: string[]): Promise<AuthUser> {
    if (!request.isAuthenticated() || !request.user) {
      throw new HttpApiException(HttpStatusCode.Unauthorized, 'You are not logged in.');
    }

    if (request.user.integrationUserId === undefined || !request.user.endpoints) {
      throw new HttpApiException(HttpStatusCode.Forbidden);
    }

    if (scopes.some((scope) => request.user!.endpoints!.includes(scope))) {
      return request.user;
    }

    throw new HttpApiException(HttpStatusCode.Forbidden);
  }
}
