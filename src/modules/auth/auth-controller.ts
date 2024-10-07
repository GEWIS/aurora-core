import { Controller } from '@tsoa/runtime';
import { Get, Route, Tags } from 'tsoa';
import { ISecurityGroups, typedSecurityGroups } from '../../helpers/security-groups';

/**
 * The OidcConfig contains the details needed to authenticate with keycloak
 * These variables are based on the environment variables, and might differ
 * from system to system.
 */
interface OidcConfig {
  /**
   * The client id of the keycloak application
   */
  clientId: string;
  /**
   * The redirect uri of the keycloak application
   */
  redirectUri: string;
  /**
   * The auth url of the keycloak application
   */
  authUrl: string;
}

@Route('auth')
@Tags('Authentication')
export class AuthController extends Controller {
  /**
   * Returns the oidc parameters
   */
  @Get('oidc')
  public getOidcParameters(): OidcConfig {
    return {
      clientId: process.env.KEYCLOAK_CLIENT_ID || '',
      redirectUri: process.env.KEYCLOAK_REDIRECT_URI || '',
      authUrl: process.env.KEYCLOAK_AUTH_URI || '',
    };
  }

  /**
   * Returns the security groups
   */
  @Get('groups')
  public getSecurityGroups(): ISecurityGroups {
    return typedSecurityGroups;
  }
}
