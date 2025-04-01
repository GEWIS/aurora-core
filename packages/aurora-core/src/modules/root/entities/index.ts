// eslint-disable-next-line import/no-cycle -- TODO fix cyclic dependency
import LightsController from './lights-controller';
// TODO these should be moved directly to database entities
import { Audio } from '@gewis/aurora-core-audio-handler';
import { ScreenEntity } from '@gewis/aurora-core-screen';

export { default as LightsController } from './lights-controller';

export const Entities = [Audio, LightsController, ScreenEntity];
