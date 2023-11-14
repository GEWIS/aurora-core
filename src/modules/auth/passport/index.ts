import passport from 'passport';
import { User } from '../user';

export { default as mockStrategy } from './mock-strategy';
export { default as oidcStrategy } from './oidc-strategy';

passport.serializeUser((user, done) => {
  console.log(user);
  done(null, JSON.stringify(user));
});

passport.deserializeUser((json: string, done) => {
  const user = JSON.parse(json);
  if (user == null) return done(null, false);
  return done(null, user as User);
});
