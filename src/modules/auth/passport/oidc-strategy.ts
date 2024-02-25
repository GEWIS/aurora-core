import { jwtDecode } from 'jwt-decode';
import { Request as ExRequest, Response as ExResponse } from 'express';
import passport from 'passport';
import { Strategy as CustomStrategy } from 'passport-custom';
import { ApiError, HttpStatusCode } from '../../../helpers/customError';
import logger from '../../../logger';
import { parseRoles } from '../../../helpers/security';

export interface AuthStoreToken {
  exp: number,
  iat: number,
  auth_time: number,
  jti: string,
  iss: string,
  aud: string,
  sub: string,
  typ: string,
  azp: string,
  nonce: string,
  session_state: string,
  at_hash: string,
  sid: string,
  resource_access?: {
    [key: string]: {
      roles: string[]
    }
  }
  given_name: string
}

passport.use('oidc', new CustomStrategy(
  async (req, callback) => {
    if (!req.body.state || !req.body.session_state || !req.body.code) {
      throw new ApiError(HttpStatusCode.BadRequest, 'Missing OIDC state, session state or code.');
    }

    const oidcResponse = await fetch(
      'https://auth.gewis.nl/realms/GEWISWG/protocol/openid-connect/token',
      {
        method: 'POST',
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: process.env.KEYCLOAK_CLIENT_ID!,
          client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
          redirect_uri: process.env.KEYCLOAK_REDIRECT_URI!,
          code: req.body.code,
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    try {
      const oidcData = await oidcResponse.json();
      const tokenDetails = jwtDecode<AuthStoreToken>(oidcData!.id_token);
      const oidcRoles = tokenDetails.resource_access ? tokenDetails.resource_access[process.env.KEYCLOAK_CLIENT_ID || ''].roles : [];
      const securityRoles = parseRoles(oidcRoles);

      if (securityRoles.length === 0) {
        req.res?.sendStatus(403);
      } else {
        callback(null, {
          name: tokenDetails.given_name,
          roles: securityRoles,
        });
      }
    } catch (e) {
      logger.error(e);
      req.res?.sendStatus(500);
    }
  },
));

export const oidcResponse = (
  req: ExRequest,
  res: ExResponse,
): void => {
  res.send(req.user).status(200).send();
};
