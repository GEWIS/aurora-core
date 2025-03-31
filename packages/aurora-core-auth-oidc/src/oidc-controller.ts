import { Controller, Post } from '@tsoa/runtime';
import { Body, Get, Request, Route, Tags } from 'tsoa';
import OidcService, { OidcConfig, OpenIdConfig } from './oidc-service';
import { AuthUser, HttpApiException, HttpStatusCode } from '@gewis/aurora-core-util';
import { Request as ExRequest } from 'express';
import passport from 'passport';

interface OidcParameters {
  state: string;
  session_state: string;
  code: string;
}

@Route('auth')
@Tags('Authentication')
export class OidcController extends Controller {
  /**
   * Returns the oidc parameters
   */
  @Get('oidc')
  public async getOidcParameters(): Promise<OidcConfig> {
    let oidcConfig: OpenIdConfig;

    try {
      oidcConfig = await new OidcService().getOIDCConfig();
    } catch (e) {
      throw new HttpApiException(HttpStatusCode.InternalServerError, 'Cannot get OIDC configuration.');
    }

    return {
      clientId: process.env.OIDC_CLIENT_ID || '',
      redirectUri: process.env.OIDC_REDIRECT_URI || '',
      authUrl: oidcConfig.authorization_endpoint || '',
    };
  }

  @Post('oidc')
  public async authMock(@Request() req: ExRequest, @Body() _: OidcParameters) {
    return new Promise((resolve, reject) => {
      passport.authenticate('oidc')(req, req.res!, (err: Error) => {
        if (err) reject(err);
        resolve(req.user);
      });
    });
  }
}
