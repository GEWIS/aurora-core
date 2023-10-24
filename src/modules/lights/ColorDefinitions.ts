import { ColorChannel } from './entities/colors';

export type RgbColor = 'red' | 'blue'
| 'green' | 'yellow' | 'purple' | 'cyan'
| 'pink' | 'gold' | 'brown' | 'uv' | 'white'
| 'blindingWhite' | 'lightblue' | 'orange'
| 'lightpink' | 'black' | 'lime';

export type RgbColorDefinition = { [k in ColorChannel]: number };

export type RgbColorSet = {
  [color in RgbColor]: RgbColorDefinition;
};

export const rgbColorDefinitions: RgbColorSet = {
  red: {
    redChannel: 255,
    blueChannel: 0,
    greenChannel: 0,
    warmWhiteChannel: 0,
    coldWhiteChannel: 0,
    amberChannel: 0,
    uvChannel: 0,
  },
  blue: {
    redChannel: 0,
    blueChannel: 255,
    greenChannel: 0,
    warmWhiteChannel: 0,
    coldWhiteChannel: 64,
    amberChannel: 0,
    uvChannel: 0,
  },
  green: {
    redChannel: 0,
    blueChannel: 0,
    greenChannel: 255,
    warmWhiteChannel: 0,
    coldWhiteChannel: 0,
    amberChannel: 0,
    uvChannel: 0,
  },
  yellow: {
    redChannel: 255,
    blueChannel: 0,
    greenChannel: 128,
    warmWhiteChannel: 0,
    coldWhiteChannel: 0,
    amberChannel: 255,
    uvChannel: 0,
  },
  purple: {
    redChannel: 255,
    blueChannel: 255,
    greenChannel: 0,
    warmWhiteChannel: 0,
    coldWhiteChannel: 0,
    amberChannel: 0,
    uvChannel: 0,
  },
  cyan: {
    redChannel: 0,
    blueChannel: 255,
    greenChannel: 255,
    warmWhiteChannel: 0,
    coldWhiteChannel: 0,
    amberChannel: 0,
    uvChannel: 0,
  },
  lime: {
    redChannel: 255,
    blueChannel: 0,
    greenChannel: 255,
    warmWhiteChannel: 0,
    coldWhiteChannel: 0,
    amberChannel: 0,
    uvChannel: 0,
  },
  orange: {
    redChannel: 255,
    blueChannel: 0,
    greenChannel: 100,
    warmWhiteChannel: 0,
    coldWhiteChannel: 0,
    amberChannel: 100,
    uvChannel: 0,
  },
  pink: {
    redChannel: 255,
    blueChannel: 128,
    greenChannel: 0,
    warmWhiteChannel: 0,
    coldWhiteChannel: 0,
    amberChannel: 0,
    uvChannel: 0,
  },
  lightpink: {
    redChannel: 192,
    blueChannel: 128,
    greenChannel: 0,
    warmWhiteChannel: 64,
    coldWhiteChannel: 64,
    amberChannel: 0,
    uvChannel: 0,
  },
  white: {
    redChannel: 0,
    blueChannel: 0,
    greenChannel: 0,
    warmWhiteChannel: 255,
    coldWhiteChannel: 255,
    amberChannel: 0,
    uvChannel: 0,
  },
  blindingWhite: {
    redChannel: 255,
    blueChannel: 255,
    greenChannel: 255,
    warmWhiteChannel: 255,
    coldWhiteChannel: 255,
    amberChannel: 255,
    uvChannel: 0,
  },
  uv: {
    redChannel: 0,
    blueChannel: 0,
    greenChannel: 0,
    warmWhiteChannel: 0,
    coldWhiteChannel: 0,
    amberChannel: 0,
    uvChannel: 255,
  },
  lightblue: {
    redChannel: 0,
    blueChannel: 255,
    greenChannel: 0,
    warmWhiteChannel: 0,
    coldWhiteChannel: 128,
    amberChannel: 0,
    uvChannel: 0,
  },
  brown: {
    redChannel: 192,
    blueChannel: 0,
    greenChannel: 0,
    warmWhiteChannel: 0,
    coldWhiteChannel: 0,
    amberChannel: 192,
    uvChannel: 0,
  },
  gold: {
    redChannel: 128,
    blueChannel: 0,
    greenChannel: 0,
    warmWhiteChannel: 32,
    coldWhiteChannel: 0,
    amberChannel: 255,
    uvChannel: 0,
  },
  black: {
    redChannel: 0,
    blueChannel: 0,
    greenChannel: 0,
    warmWhiteChannel: 0,
    coldWhiteChannel: 0,
    amberChannel: 0,
    uvChannel: 0,
  },
};
