import { jwtDecode } from 'jwt-decode';
import { Request as ExRequest, Response as ExResponse } from 'express';
import passport from 'passport';
import { Strategy as CustomStrategy } from 'passport-custom';
import { ApiError, HttpStatusCode } from '../../../helpers/customError';

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
          redirect_uri: process.env.AUTH_KEYCLOAK_CALLBACK!,
          code: req.body.code,
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    const oidcData = await oidcResponse.json();
    const tokenDetails = jwtDecode<AuthStoreToken>(oidcData!.id_token);

    callback(null, {
      name: tokenDetails.given_name,
      roles: tokenDetails.resource_access ? tokenDetails.resource_access['narrowcasting-test'].roles : [],
    });
  },
));

export const oidcResponse = (
  req: ExRequest,
  res: ExResponse,
): void => {
  res.send(req.user).status(200).send();
};
