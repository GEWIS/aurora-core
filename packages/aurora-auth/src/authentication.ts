import * as express from 'express';
import { HttpApiException, HttpStatusCode } from '@gewis/aurora-core/helpers/custom-error';
import { AuthUser } from '@gewis/aurora-core/modules/auth/auth-user';
import { resolveAuthStrategy } from '@gewis/aurora-core/ports/auth-strategy';

export async function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes: string[] = [],
): Promise<AuthUser> {
  try {
    const strategy = resolveAuthStrategy(securityName);
    return await strategy.authenticate(request, scopes);
  } catch (e) {
    if (e instanceof HttpApiException) throw e;
    throw new HttpApiException(HttpStatusCode.InternalServerError, 'Unknown security scheme.');
  }
}
