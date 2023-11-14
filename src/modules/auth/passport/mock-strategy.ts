import { Strategy as CustomStrategy } from 'passport-custom';
import passport, { Strategy } from 'passport';
import { NextFunction, Request as ExRequest, Response as ExResponse } from 'express';

export default async function getStrategy(): Promise<Strategy> {
  return new CustomStrategy(
    (req, callback) => {
      callback(null, {
        name: 'mock',
        roles: ['PRIV - Narrowcasting Test Admin'],
      });
    },
  );
}

export const mockLogin = (
  req: ExRequest,
  res: ExResponse,
  next: NextFunction,
) => {
  passport.authenticate('mock')(req, res, next);
  res.status(204).send();
};
