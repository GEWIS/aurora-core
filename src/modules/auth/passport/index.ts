import passport from 'passport';
import { AuthUser } from '../auth-user';

passport.serializeUser((user, done) => {
  done(null, JSON.stringify(user));
});

passport.deserializeUser((json: string, done) => {
  const user = JSON.parse(json);
  if (user == null) return done(null, false);
  return done(null, user as AuthUser);
});
