import passport from 'passport';
import { Strategy as CustomStrategy } from 'passport-custom';

passport.use(new CustomStrategy(
  (req, callback) => {
    callback(null, {
      name: 'mock',
      roles: ['Admin', 'AViCo', 'BAC', 'Board', 'Openhouder'],
    });
  },
));
