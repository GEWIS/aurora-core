import SearchLight, { SearchLightCreateParams } from './search-light';
import RandomPosition, { RandomPositionCreateParams } from './random-position';
import TableRotate, { TableRotateCreateParams } from './table-rotate';

export { default as SearchLight } from './search-light';

export type LightsEffectsMovementCreateParams =
  | SearchLightCreateParams
  | RandomPositionCreateParams
  | TableRotateCreateParams;

export const LIGHTS_EFFECTS_MOVEMENT = [SearchLight, RandomPosition, TableRotate];
