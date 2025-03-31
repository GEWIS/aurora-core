import * as express from 'express';
import { HttpApiException, HttpStatusCode } from '@gewis/aurora-core-util';
import { SecurityGroup } from '@gewis/aurora-core-util';
import passport from 'passport';

/**
 * Check if the given object is an AuthUser
 * @param obj - The object to check
 */
export function isAuthUser(obj: unknown): obj is AuthUser {
  return (
    (obj as AuthUser)?.id !== undefined &&
    typeof (obj as AuthUser)?.id === 'string' &&
    (obj as AuthUser)?.name !== undefined &&
    typeof (obj as AuthUser)?.name === 'string'
  );
}

export interface AuthUser {
  id: string;
  name: string;
  roles: SecurityGroup[];

  audioId?: number;
  lightsControllerId?: number;
  screenId?: number;
  integrationUserId?: number;
}

/**
 * Express middleware to authenticate the user
 * @param request - The request object
 * @param securityName - The name of the security scheme
 * @param scopes - The required scopes
 * @returns The authenticated user
 */
export async function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes: string[] = [],
): Promise<AuthUser> {
  if (securityName === 'local') {
    if (!request.isAuthenticated() || request.user === undefined) {
      throw new HttpApiException(HttpStatusCode.Unauthorized, 'You are not logged in.');
    }
    // Everyone can access, but needs at least one role
    if (scopes.includes('*') && request.user.roles.length > 0) {
      return request.user;
    }
    // Should have one overlapping role/scope
    if (scopes.some((scope) => request.user!.roles.includes(scope as SecurityGroup))) {
      return request.user;
    }

    throw new HttpApiException(HttpStatusCode.Forbidden);
  }
  throw new HttpApiException(HttpStatusCode.InternalServerError, 'Unknown security scheme.');
}
