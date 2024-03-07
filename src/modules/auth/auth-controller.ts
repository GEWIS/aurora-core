import { Controller } from '@tsoa/runtime';
import { Get, Route, Tags } from 'tsoa';

interface OidcConfig {
  clientId: string;
  redirectUri: string;
  authUrl: string;
}

@Route('auth')
@Tags('Authentication')
export class AuthController extends Controller {
  @Get('oidc')
  public getOidcParameters(): OidcConfig {
    return {
      clientId: process.env.KEYCLOAK_CLIENT_ID || '',
      redirectUri: process.env.KEYCLOAK_REDIRECT_URI || '',
      authUrl: process.env.KEYCLOAK_AUTH_URI || ''
    };
  }
}
