import passport from 'passport';
import { User } from '../user';

passport.serializeUser((user, done) => {
  // TODO I am unsure how cookies are hashed, but we might want to apply our own hash to the stringify as well...
  done(null, JSON.stringify(user));
});

passport.deserializeUser((json: string, done) => {
  const user = JSON.parse(json);
  if (user == null) return done(null, false);
  return done(null, user as User);
});
