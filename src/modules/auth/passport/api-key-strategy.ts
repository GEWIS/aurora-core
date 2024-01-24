import passport from 'passport';
import { Strategy as CustomStrategy } from 'passport-custom';
import { Request as ExRequest, Response as ExResponse } from 'express';
import { HttpStatusCode } from 'axios';
import * as crypto from 'crypto';
import { ApiError } from '../../../helpers/customError';
import database from '../../../database';
import { ApiKey } from '../entities';
import { Audio, LightsController } from '../../root/entities';
import dataSource from '../../../database';

passport.use('apikey', new CustomStrategy(async (req, callback) => {
  if (!req.body || !req.body.key) {
    throw new ApiError(HttpStatusCode.BadRequest, 'Missing API Key');
  }

  const identity = await database.getRepository(ApiKey).findOne({
    where: { key: req.body.key },
    relations: { audio: true, lightsController: true, screen: true },
  });
  if (!identity) {
    callback(new ApiError(HttpStatusCode.NotFound, 'Key not found'), undefined);
    return;
  }

  const roles: string[] = [];
  const names: string[] = [];
  if (identity.audio) {
    roles.push('audio-subscriber');
    names.push(identity.audio.name);
  }
  if (identity.screen) {
    roles.push('screen-subscriber');
    names.push(identity.screen.name);
  }
  if (identity.lightsController) {
    roles.push('lights-subscriber');
    names.push(identity.lightsController.name);
  }

  callback(null, {
    name: names.join('-'),
    roles,
  });
}));

export const apiKeyResponse = (
  req: ExRequest,
  res: ExResponse,
): void => {
  res.status(200).send(req.user);
};
