import BeatFadeOut, { BeatFadeOutCreateParams } from './beat-fade-out';
import SingleFlood, { SingleFloodCreateParams } from './single-flood';
import Sparkle, { SparkleCreateParams } from './sparkle';
import Strobe, { StrobeCreateParams } from './strobe';
import Wave, { WaveCreateParams } from './wave';
import StaticColor, { StaticColorCreateParams } from './static-color';

export { default as BeatFadeOut } from './beat-fade-out';
export { default as Strobe } from './strobe';
export { default as SingleFlood } from './single-flood';
export { default as Sparkle } from './sparkle';
export { default as StaticColor } from './static-color';
export { default as Wave } from './wave';

export type LightsEffectsColorCreateParams = BeatFadeOutCreateParams
| SingleFloodCreateParams | SparkleCreateParams | StaticColorCreateParams
| StrobeCreateParams | WaveCreateParams;

export const LIGHTS_EFFECTS_COLOR = [BeatFadeOut, SingleFlood, Sparkle,
  StaticColor, Strobe, Wave];
