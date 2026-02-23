import passport from 'passport';
import { Strategy as CustomStrategy } from 'passport-custom';
import { HttpStatusCode } from 'axios';
import { HttpApiException } from '@gewis/aurora-core/helpers/custom-error';
import { resolveDataSource } from '@gewis/aurora-core/ports/data-source';
import { ApiKey } from '../entities/index';

passport.use(
  'apikey',
  new CustomStrategy(async (req, callback) => {
    if (!req.body || !req.body.key) {
      callback(new HttpApiException(HttpStatusCode.BadRequest, 'Missing API Key'), undefined);
      return;
    }

    const identity = await resolveDataSource()
      .getRepository(ApiKey)
      .findOne({
        where: { key: req.body.key },
        relations: { audio: true, lightsController: true, screen: true, integrationUser: true },
      });
    if (!identity) {
      callback(new HttpApiException(HttpStatusCode.NotFound, 'Key not found'), undefined);
      return;
    }

    callback(null, identity.asAuthUser());
  }),
);
