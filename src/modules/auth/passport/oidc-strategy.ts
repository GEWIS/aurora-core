import { Issuer, Strategy } from 'openid-client';
// import { Strategy } from 'passport';

export default async function getStrategy() {
  const issuer = await Issuer.discover(process.env.KEYCLOAK_INFO!);

  const client = new issuer.Client({
    client_id: process.env.KEYCLOAK_CLIENT_ID!,
    client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
    redirect_uris: [process.env.AUTH_KEYCLOAK_CALLBACK!],
    post_logout_redirect_uris: [process.env.AUTH_KEYCLOAK_LOGOUT_CALLBACK!],
    response_types: ['code'],
    token_endpoint_auth_method: 'client_secret_post',
  });

  client.authorizationUrl();

  return new Strategy({ client }, (tokenSet: any, userinfo: any, done: any) => {
    done(null, tokenSet.claims());
  });
}
