import { jwtDecode } from 'jwt-decode';
import { Request as ExRequest, Response as ExResponse } from 'express';
import passport from 'passport';
import { Strategy as CustomStrategy } from 'passport-custom';
import { HttpApiException, HttpStatusCode } from '../../../helpers/customError';
import logger from '../../../logger';
import { parseRoles } from '../../../helpers/security';

export interface AuthStoreToken {
  exp: number;
  iat: number;
  auth_time: number;
  jti: string;
  iss: string;
  aud: string;
  sub: string;
  typ: string;
  azp: string;
  nonce: string;
  session_state: string;
  at_hash: string;
  sid: string;
  resource_access?: {
    [key: string]: {
      roles: string[];
    };
  };
  roles?: string[]
  preferred_username: string;
  given_name: string;
}

passport.use(
  'oidc',
  new CustomStrategy(async (req, callback) => {
    if (!req.body.state || !req.body.session_state || !req.body.code) {
      throw new HttpApiException(
        HttpStatusCode.BadRequest,
        'Missing OIDC state, session state or code.',
      );
    }

    const oidcConfigRes = await fetch(process.env.OIDC_CONFIG!);
    let oidcConfig;

    try {
        oidcConfig = await oidcConfigRes.json();
    } catch (e) {
        logger.error(e);
        req.res?.sendStatus(500);
    }

    const oidcResponse = await fetch(
        oidcConfig.authorization_endpoint,
      {
        method: 'POST',
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: process.env.OIDC_CLIENT_ID!,
          client_secret: process.env.OIDC_CLIENT_SECRET!,
          redirect_uri: process.env.OIDC_REDIRECT_URI!,
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
      let oidcRoles;

      switch (process.env.OIDC_PROVIDER) {
          case 'KEYCLOAK': {
              oidcRoles = tokenDetails.resource_access
                  ? tokenDetails.resource_access[process.env.OIDC_CLIENT_ID || ''].roles
                  : [];
              break;
          }
          case 'ENTRA_ID': {
              oidcRoles = tokenDetails.roles
              break;
          }
          default: {
              throw new HttpApiException(
                  HttpStatusCode.InternalServerError,
                  'Invalid OIDC provider configured.',
              );
          }
      }

      const securityRoles = parseRoles(oidcRoles!);

      if (securityRoles.length === 0) {
        req.res?.sendStatus(403);
      } else {
        callback(null, {
          id: tokenDetails.preferred_username,
          name: tokenDetails.given_name,
          roles: securityRoles,
        });
      }
    } catch (e) {
      logger.error(e);
      req.res?.sendStatus(500);
    }
  }),
);

export const oidcResponse = (req: ExRequest, res: ExResponse): void => {
  res.send(req.user).status(200).send();
};
