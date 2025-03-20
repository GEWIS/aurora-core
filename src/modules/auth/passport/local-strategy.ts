import { Strategy as CustomStrategy } from 'passport-custom';
import passport from 'passport';
import { HttpApiException } from '../../../helpers/custom-error';
import { HttpStatusCode } from 'axios';
import crypto from 'crypto';
import dataSource from '../../../database';
import LocalUser from '../entities/local-user';

export function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

export function hashPassword(password: string, salt: string) {
  const hash = crypto.createHash('sha256');
  hash.update(password);
  hash.update(salt);
  return hash.digest('hex');
}

function validPassword(password: string, userSalt: string, userHash: string): boolean {
  return hashPassword(password, userSalt) === userHash;
}

passport.use(
  'local',
  new CustomStrategy(async (req, callback) => {
    if (!req.body || !req.body.userName || !req.body.password) {
      callback(
        new HttpApiException(HttpStatusCode.BadRequest, 'Missing UserName or Password'),
        undefined,
      );
    }

    const userRepo = dataSource.getRepository(LocalUser);
    const user = await userRepo.findOne({ where: { userName: req.body.userName } });

    if (user == null) {
      callback(new HttpApiException(HttpStatusCode.BadRequest, 'Invalid Login'), undefined);
      return;
    }

    if (!user.salt || !user.hash) {
      callback(new HttpApiException(HttpStatusCode.BadRequest, 'Unverified User'), undefined);
      return;
    }

    if (!validPassword(req.body.password, user.salt, user.hash)) {
      callback(new HttpApiException(HttpStatusCode.BadRequest, 'Invalid Login'), undefined);
      return;
    }

    const verifiedUser = await userRepo.findOneBy({ id: user.id });

    callback(null, {
      id: verifiedUser!.id,
      name: verifiedUser!.userName,
      roles: verifiedUser!.roles.split(','),
    });
  }),
);
