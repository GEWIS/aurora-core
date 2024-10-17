import { Audio, Screen } from '../root/entities';
import { LightsGroup } from '../lights/entities';
import SubscribeEntity from '../root/entities/subscribe-entity';
import { SecurityGroup } from '../../helpers/security';

export interface AuthUser {
  id: string;
  name: string;
  roles: SecurityGroup[];

  audioId?: number;
  lightsControllerId?: number;
  screenId?: number;
}

export function userIsEntity(user: AuthUser, entity: SubscribeEntity): boolean {
  return (
    (entity.constructor.name === Audio.name && entity.id === user.audioId) ||
    (entity.constructor.name === Screen.name && entity.id === user.screenId) ||
    (entity.constructor.name === LightsGroup.name && entity.id === user.lightsControllerId)
  );
}
