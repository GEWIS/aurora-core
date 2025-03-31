/**
 * The OidcConfig contains the details needed to authenticate with keycloak
 * These variables are based on the environment variables, and might differ
 * from system to system.
 */
export interface OidcConfig {
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

export interface OpenIdConfig {
  authorization_endpoint: string;
  token_endpoint: string;
}

export default class OidcService {
  public async getOIDCConfig(): Promise<OpenIdConfig> {
    const oidcConfigRes = await fetch(process.env.OIDC_CONFIG!);
    return (await oidcConfigRes.json()) as OpenIdConfig;
  }
}
