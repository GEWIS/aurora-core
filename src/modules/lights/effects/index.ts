import BeatFadeOut from './beat-fade-out';
import SearchLight from './search-light';
import SingleFlood from './single-flood';
import Sparkle from './sparkle';
import Strobe from './strobe';
import Wave from './wave';

export { default as BeatFadeOut } from './beat-fade-out';
export { default as Strobe } from './strobe';
export { default as SearchLight } from './search-light';
export { default as SingleFlood } from './single-flood';
export { default as Sparkle } from './sparkle';
export { default as Wave } from './wave';

export const LIGHTS_EFFECTS = [BeatFadeOut, SearchLight, SingleFlood, Sparkle, Strobe, Wave];
