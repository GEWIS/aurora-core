import { Controller } from '@tsoa/runtime';
import { Get, Route, Tags } from 'tsoa';
import AuthService from "./auth-service";
import {HttpApiException, HttpStatusCode} from "../../helpers/customError";

interface OidcConfig {
  clientId: string;
  redirectUri: string;
  authUrl: string;
}

@Route('auth')
@Tags('Authentication')
export class AuthController extends Controller {
  @Get('oidc')
  public async getOidcParameters(): Promise<OidcConfig> {
    let oidcConfig;

    try {
      oidcConfig = await new AuthService().getOIDCConfig();
    } catch (e) {
      throw new HttpApiException(
          HttpStatusCode.InternalServerError,
          'Cannot get OIDC configuration.',
      );
    }

    return {
      clientId: process.env.OIDC_CLIENT_ID || '',
      redirectUri: process.env.OIDC_REDIRECT_URI || '',
      authUrl: oidcConfig!.authorization_endpoint || '',
    };
  }
}
