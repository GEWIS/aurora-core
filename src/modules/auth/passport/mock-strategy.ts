import { Strategy as CustomStrategy } from 'passport-custom';
import passport from 'passport';
import { Request as ExRequest, Response as ExResponse } from 'express';

passport.use('mock', new CustomStrategy(
  (req, callback) => {
    // req.login()

    callback(null, {
      name: req.body.name ?? 'mock',
      roles: req.body.roles ?? ['PRIV - Narrowcasting Test Admin'],
    });
  },
));

export const mockLogin = (
  req: ExRequest,
  res: ExResponse,
) => {
  res.send(req.user).status(200).send();
};
