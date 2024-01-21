import BeatFadeOut, { BeatFadeOutCreateParams } from './beat-fade-out';
import SearchLight, { SearchLightCreateParams } from './search-light';
import SingleFlood, { SingleFloodCreateParams } from './single-flood';
import Sparkle, { SparkleCreateParams } from './sparkle';
import Strobe, { StrobeCreateParams } from './strobe';
import Wave, { WaveCreateParams } from './wave';
import StaticColor, { StaticColorCreateParams } from './static-color';

export { default as BeatFadeOut } from './beat-fade-out';
export { default as Strobe } from './strobe';
export { default as SearchLight } from './search-light';
export { default as SingleFlood } from './single-flood';
export { default as Sparkle } from './sparkle';
export { default as StaticColor } from './static-color';
export { default as Wave } from './wave';

export type LightsEffectsCreateParams = BeatFadeOutCreateParams | SearchLightCreateParams
| SingleFloodCreateParams | SparkleCreateParams | StaticColorCreateParams
| StrobeCreateParams | WaveCreateParams;

export const LIGHTS_EFFECTS = [BeatFadeOut, SearchLight, SingleFlood, Sparkle,
  StaticColor, Strobe, Wave];
