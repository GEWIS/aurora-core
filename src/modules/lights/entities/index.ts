// eslint-disable-next-line import/no-cycle
import LightsGroup from './lights-group';
import LightsPar from './lights-par';
import LightsMovingHeadRgb from './lights-moving-head-rgb';
import LightsMovingHeadWheel from './lights-moving-head-wheel';
import LightsGroupPars from './lights-group-pars';
import LightsGroupMovingHeadRgbs from './lights-group-moving-head-rgbs';
import LightsGroupMovingHeadWheels from './lights-group-moving-head-wheels';
import LightsWheelChannelValue from './lights-wheel-channel-value';
import {
  LightsScene,
  LightsSceneMovingHeadRgb,
  LightsSceneMovingHeadWheel,
  LightsScenePars
} from './scenes';
import { LightsPredefinedEffect } from './sequences/lights-predefined-effect';

export { default as LightsGroup } from './lights-group';
export { default as LightsPar } from './lights-par';
export { default as LightsMovingHeadRgb } from './lights-moving-head-rgb';
export { default as LightsMovingHeadWheel } from './lights-moving-head-wheel';
export { default as LightsGroupPars } from './lights-group-pars';
export { default as LightsGroupMovingHeadRgbs } from './lights-group-moving-head-rgbs';
export { default as LightsGroupMovingHeadWheels } from './lights-group-moving-head-wheels';

export const Entities = [
  LightsGroup,
  LightsPar,
  LightsMovingHeadRgb,
  LightsMovingHeadWheel,
  LightsGroupPars,
  LightsGroupMovingHeadRgbs,
  LightsGroupMovingHeadWheels,
  LightsWheelChannelValue,
  LightsScene,
  LightsScenePars,
  LightsSceneMovingHeadRgb,
  LightsSceneMovingHeadWheel,
  LightsPredefinedEffect
];
