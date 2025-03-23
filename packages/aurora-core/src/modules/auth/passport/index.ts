import passport from 'passport';
import './api-key-strategy';
import { Request as ExRequest, Response as ExResponse } from 'express';
import { AuthUser } from '@gewis/aurora-core-util'

passport.serializeUser((user, done) => {
  done(null, JSON.stringify(user));
});

passport.deserializeUser((json: string, done) => {
  const user = JSON.parse(json);
  if (user == null) return done(null, false);
  return done(null, user as AuthUser);
});

export const authResponse = (req: ExRequest, res: ExResponse): void => {
  res.status(200).send(req.user);
};
