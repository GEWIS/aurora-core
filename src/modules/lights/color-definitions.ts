import { ColorChannel } from './entities/colors';

export const wheelColors = [
  'white', 'red', 'green', 'blue', 'yellow', 'lightblue', 'orange', 'rosered',
];
export type WheelColor = typeof wheelColors[number];

export const rgbColors = [
  ...wheelColors,
  'purple', 'cyan', 'pink', 'gold', 'brown', 'lightpink', 'lime',
  'uv', 'blindingwhite'];
export type RgbColor = typeof rgbColors[number];

// TODO: implement wheel colors
export type RgbColorDefinition = { [k in ColorChannel]: number };
export type WheelColorDefinition = RgbColorDefinition;

export type RgbColorSpecification = {
  definition: RgbColorDefinition,
  alternative: WheelColor,
  complementary: RgbColor[],
};

export type RgbColorSet = {
  [color in RgbColor]: RgbColorSpecification;
};

export type RgbColorAlternatives = {
  [color in RgbColor]: WheelColor;
};

export const rgbColorDefinitions: RgbColorSet = {
  white: {
    definition: {
      redChannel: 0,
      blueChannel: 0,
      greenChannel: 0,
      warmWhiteChannel: 255,
      coldWhiteChannel: 255,
      amberChannel: 0,
      uvChannel: 0,
    },
    alternative: 'white',
    complementary: [],
  },
  red: {
    definition: {
      redChannel: 255,
      blueChannel: 0,
      greenChannel: 0,
      warmWhiteChannel: 0,
      coldWhiteChannel: 0,
      amberChannel: 0,
      uvChannel: 0,
    },
    alternative: 'red',
    complementary: ['blue', 'green', 'yellow', 'lightblue', 'purple', 'cyan', 'gold', ' lime'],
  },
  green: {
    definition: {
      redChannel: 0,
      blueChannel: 0,
      greenChannel: 255,
      warmWhiteChannel: 0,
      coldWhiteChannel: 0,
      amberChannel: 0,
      uvChannel: 0,
    },
    alternative: 'green',
    complementary: ['red', 'blue', ' yellow', 'lightblue', 'orange', 'rosered', 'purple', 'cyan', 'pink', 'gold', 'brown', 'lightpink'],
  },
  blue: {
    definition: {
      redChannel: 0,
      blueChannel: 255,
      greenChannel: 0,
      warmWhiteChannel: 0,
      coldWhiteChannel: 64,
      amberChannel: 0,
      uvChannel: 0,
    },
    alternative: 'blue',
    complementary: ['red', 'green', 'yellow', 'orange', 'rosered', 'pink', 'gold', 'brown', 'lightpink', 'lime'],
  },
  yellow: {
    definition: {
      redChannel: 255,
      blueChannel: 0,
      greenChannel: 128,
      warmWhiteChannel: 0,
      coldWhiteChannel: 0,
      amberChannel: 255,
      uvChannel: 0,
    },
    alternative: 'yellow',
    complementary: ['red', 'green', 'blue', 'lightblue', 'purple', 'cyan', 'lime'],
  },
  lightblue: {
    definition: {
      redChannel: 0,
      blueChannel: 255,
      greenChannel: 0,
      warmWhiteChannel: 0,
      coldWhiteChannel: 128,
      amberChannel: 0,
      uvChannel: 0,
    },
    alternative: 'blue',
    complementary: ['red', 'green', 'yellow', 'orange', 'rosered', 'purple', 'pink', 'gold', 'brown', 'lime'],
  },
  orange: {
    definition: {
      redChannel: 255,
      blueChannel: 0,
      greenChannel: 100,
      warmWhiteChannel: 0,
      coldWhiteChannel: 0,
      amberChannel: 100,
      uvChannel: 0,
    },
    alternative: 'orange',
    complementary: ['green', 'blue', 'lightblue', 'purple', 'cyan', 'pink', 'lightpink', 'lime'],
  },
  rosered: {
    definition: {
      redChannel: 255,
      blueChannel: 0,
      greenChannel: 0,
      warmWhiteChannel: 0,
      coldWhiteChannel: 64,
      amberChannel: 0,
      uvChannel: 0,
    },
    alternative: 'red',
    complementary: ['green', 'blue', 'lightblue', 'purple', 'cyan', 'brown', 'lime'],
  },
  purple: {
    definition: {
      redChannel: 255,
      blueChannel: 255,
      greenChannel: 0,
      warmWhiteChannel: 0,
      coldWhiteChannel: 0,
      amberChannel: 0,
      uvChannel: 0,
    },
    alternative: 'blue',
    complementary: ['red', 'green', 'yellow', 'lightblue', 'orange', 'rosered', 'cyan', 'gold', 'brown', 'lightpink', 'lime'],
  },
  cyan: {
    definition: {
      redChannel: 0,
      blueChannel: 255,
      greenChannel: 255,
      warmWhiteChannel: 0,
      coldWhiteChannel: 0,
      amberChannel: 0,
      uvChannel: 0,
    },
    alternative: 'blue',
    complementary: ['red', 'blue', 'yellow', 'orange', 'rosered', 'pink', 'gold', 'brown', 'lightpink', 'lime'],
  },
  pink: {
    definition: {
      redChannel: 255,
      blueChannel: 128,
      greenChannel: 0,
      warmWhiteChannel: 0,
      coldWhiteChannel: 0,
      amberChannel: 0,
      uvChannel: 0,
    },
    alternative: 'red',
    complementary: ['green', 'blue', 'lightblue', 'orange', 'cyan', 'gold', 'brown', 'lime'],
  },
  gold: {
    definition: {
      redChannel: 128,
      blueChannel: 0,
      greenChannel: 0,
      warmWhiteChannel: 32,
      coldWhiteChannel: 0,
      amberChannel: 255,
      uvChannel: 0,
    },
    alternative: 'yellow',
    complementary: ['red', 'green', 'blue', 'lightblue', 'purple', 'cyan', 'pink', 'lightpink', 'lime'],
  },
  brown: {
    definition: {
      redChannel: 192,
      blueChannel: 0,
      greenChannel: 0,
      warmWhiteChannel: 0,
      coldWhiteChannel: 0,
      amberChannel: 192,
      uvChannel: 0,
    },
    alternative: 'yellow',
    complementary: ['green', 'blue', 'lightblue', 'purple', 'cyan', 'pink', 'lightpink', 'lime'],
  },
  lightpink: {
    definition: {
      redChannel: 192,
      blueChannel: 128,
      greenChannel: 0,
      warmWhiteChannel: 64,
      coldWhiteChannel: 64,
      amberChannel: 0,
      uvChannel: 0,
    },
    alternative: 'red',
    complementary: ['green', 'blue', 'orange', 'cyan', 'gold', 'brown', 'lime'],
  },
  lime: {
    definition: {
      redChannel: 255,
      blueChannel: 0,
      greenChannel: 255,
      warmWhiteChannel: 0,
      coldWhiteChannel: 0,
      amberChannel: 0,
      uvChannel: 0,
    },
    alternative: 'green',
    complementary: ['red', 'green', 'blue', 'yellow', 'lightblue', 'orange', 'rosered', 'purple', 'cyan', 'pink', 'gold', 'brown', 'lightpink'],
  },
  blindingWhite: {
    definition: {
      redChannel: 255,
      blueChannel: 255,
      greenChannel: 255,
      warmWhiteChannel: 255,
      coldWhiteChannel: 255,
      amberChannel: 255,
      uvChannel: 0,
    },
    alternative: 'white',
    complementary: [],
  },
  uv: {
    definition: {
      redChannel: 0,
      blueChannel: 0,
      greenChannel: 0,
      warmWhiteChannel: 0,
      coldWhiteChannel: 0,
      amberChannel: 0,
      uvChannel: 255,
    },
    alternative: 'white',
    complementary: [],
  },
};

export const rgbColorAlternatives: RgbColorAlternatives = {
  white: 'white',
  red: 'red',
  blue: 'blue',
  green: 'green',
  yellow: 'yellow',
  lightblue: 'lightblue',
  orange: 'orange',
  rosered: 'rosered',
  purple: 'blue',
  cyan: 'blue',
  pink: 'red',
  gold: 'yellow',
  brown: 'yellow',
  uv: 'white',
  blindingwhite: 'white',
  lightpink: 'red',
  lime: 'green',
};

export const palettes: RgbColor[][] = [
  ['red', 'yellow'],
  ['red', 'lightblue'],
  ['red', 'purple'],
  ['red', 'cyan'],
  ['red', 'gold'],
  ['red', 'lime'],
  ['blue', 'yellow'],
  ['blue', 'orange'],
  ['blue', 'rosered'],
  ['blue', 'pink'],
];

export function getTwoComplementaryRgbColors(): RgbColorSpecification[] {
  // Account for the colors without any complements
  const possibleColors = Object.keys(rgbColorDefinitions)
    .filter((c) => rgbColorDefinitions[c].complementary.length > 0);

  const index = Math.floor(Math.random() * possibleColors.length);
  const baseColorName = possibleColors[index];
  const baseColor = rgbColorDefinitions[baseColorName];
  if (baseColor.complementary.length === 0) throw new Error(`Selected color ${baseColorName}, which has no complements`);
  const complementaryName = baseColor.complementary[
    Math.floor(Math.random() * baseColor.complementary.length)
  ];
  const complementaryColor = rgbColorDefinitions[complementaryName];

  return [baseColor, complementaryColor];
}
