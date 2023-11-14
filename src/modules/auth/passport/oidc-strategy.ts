import { jwtDecode } from 'jwt-decode';
import { NextFunction, Request as ExRequest, Response as ExResponse } from 'express';
import passport, { Strategy } from 'passport';
import { Strategy as CustomStrategy } from 'passport-custom';
import { ApiError, HTTPStatus } from '../../../helpers/customError';

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
    'narrowcasting-test': {
      roles: string[]
    }
  }
  given_name: string
}

export default async function getStrategy(): Promise<Strategy> {
  return new CustomStrategy(
    (req, callback) => {
      const tokenDetails = jwtDecode<AuthStoreToken>(req.body!);

      callback(null, {
        name: tokenDetails.given_name,
        roles: tokenDetails.resource_access ? tokenDetails.resource_access['narrowcasting-test'].roles : [],
      });
    },
  );
}

export const oidcLogin = async (
  req: ExRequest,
  res: ExResponse,
  next: NextFunction,
): Promise<void> => {
  if (!req.body.state || !req.body.session_state || !req.body.code) {
    throw new ApiError(HTTPStatus.BadRequest, 'Missing OIDC state, session state or code.');
  }

  const oidcResponse = await fetch(
    'https://auth.gewis.nl/realms/GEWISWG/protocol/openid-connect/token',
    {
      method: 'POST',
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.KEYCLOAK_CLIENT_ID!,
        client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
        redirect_uri: process.env.AUTH_KEYCLOAK_CALLBACK!,
        code: req.body.code,
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  );
  const oidcData = await oidcResponse.json();
  req.body = oidcData.id_token;
  passport.authenticate('oidc')(req, res, next);

  res.send({
    id_token: oidcData.id_token,
  });
};
