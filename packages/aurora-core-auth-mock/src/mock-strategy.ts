import { Strategy as CustomStrategy } from 'passport-custom';
import passport from 'passport';
import { SecurityGroup } from '@gewis/aurora-core-util';

export function RegisterStrategy() {
  passport.use(
    'mock',
    new CustomStrategy((req, callback) => {
      callback(null, {
        id: req.body.id ?? 'dev',
        name: req.body.name ?? 'dev',
        roles: req.body.roles ?? [SecurityGroup.ADMIN],
      });
    }),
  );
}
