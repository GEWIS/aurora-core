import passport from 'passport';
import { Strategy as CustomStrategy } from 'passport-custom';
import { HttpStatusCode } from 'axios';
import {AuthUser, HttpApiException} from '@gewis/aurora-core-util';
import database from '../../../database';
import { ApiKey } from '../entities';
import { SecurityGroup } from '@gewis/aurora-core-util';

passport.use(
  'apikey',
  new CustomStrategy(async (req, callback) => {
    if (!req.body || !req.body.key) {
      callback(new HttpApiException(HttpStatusCode.BadRequest, 'Missing API Key'), undefined);
    }

    const identity = await database.getRepository(ApiKey).findOne({
      where: { key: req.body.key },
      relations: { audio: true, lightsController: true, screen: true, integrationUser: true },
    });
    if (!identity) {
      callback(new HttpApiException(HttpStatusCode.NotFound, 'Key not found'), undefined);
      return;
    }

    const roles: string[] = [];
    const names: string[] = [];
    const ids: string[] = [];
    if (identity.audio) {
      roles.push(SecurityGroup.AUDIO_SUBSCRIBER);
      names.push(identity.audio.name);
      ids.push(`audio${identity.audio.id}`);
    }
    if (identity.screen) {
      roles.push(SecurityGroup.SCREEN_SUBSCRIBER);
      names.push(identity.screen.name);
      ids.push(`screen${identity.screen.id}`);
    }
    if (identity.lightsController) {
      roles.push(SecurityGroup.LIGHTS_SUBSCRIBER);
      names.push(identity.lightsController.name);
      ids.push(`lightsController${identity.lightsController.id}`);
    }
    if (identity.integrationUser) {
      roles.push(SecurityGroup.INTEGRATION_USER);
      names.push(identity.integrationUser.name);
      ids.push(`integrationUser${identity.integrationUser.id}`);
    }

    callback(null, {
      id: ids.join('-'),
      name: names.join('-'),
      roles,
      audioId: identity.audio?.id,
      screenId: identity.screen?.id,
      lightsControllerId: identity.lightsController?.id,
      integrationUserId: identity.integrationUser?.id,
    } as AuthUser);
  }),
);
