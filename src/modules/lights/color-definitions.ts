import { ColorChannel, IColorsRgb } from './entities/colors-rgb';

export enum WheelColor {
  WHITE = 'white',
  RED = 'red',
  GREEN = 'green',
  BLUE = 'blue',
  YELLOW = 'yellow',
  LIGHTBLUE = 'lightblue',
  ORANGE = 'orange',
  ROSERED = 'rosered',
}

export enum RgbColor {
  WHITE = 'white',
  RED = 'red',
  GREEN = 'green',
  BLUE = 'blue',
  YELLOW = 'yellow',
  LIGHTBLUE = 'lightblue',
  ORANGE = 'orange',
  ROSERED = 'rosered',
  PURPLE = 'purple',
  CYAN = 'cyan',
  PINK = 'pink',
  GOLD = 'gold',
  BROWN = 'brown',
  LIGHTPINK = 'lightpink',
  LIME = 'lime',
  UV = 'uv',
  BLINDINGWHITE = 'blindingwhite',
}

export const wheelColors = Object.values(WheelColor);

export const rgbColors = Object.values(RgbColor);

export type RgbColorSpecification = {
  definition: Required<IColorsRgb>;
  alternative: WheelColor;
  complementary: RgbColor[];
  hex: string;
};

export type RgbColorSet = {
  [color in RgbColor]: RgbColorSpecification;
};

export type RgbColorAlternatives = {
  [color in RgbColor]: WheelColor;
};

export const rgbColorDefinitions: RgbColorSet = {
  [RgbColor.WHITE]: {
    definition: {
      redChannel: 0,
      blueChannel: 0,
      greenChannel: 0,
      warmWhiteChannel: 255,
      coldWhiteChannel: 255,
      amberChannel: 0,
      uvChannel: 0,
    },
    alternative: WheelColor.WHITE,
    complementary: [],
    hex: '#fff',
  },
  [RgbColor.RED]: {
    definition: {
      redChannel: 255,
      blueChannel: 0,
      greenChannel: 0,
      warmWhiteChannel: 0,
      coldWhiteChannel: 0,
      amberChannel: 0,
      uvChannel: 0,
    },
    alternative: WheelColor.RED,
    complementary: [
      RgbColor.BLUE,
      RgbColor.GREEN,
      RgbColor.YELLOW,
      RgbColor.LIGHTBLUE,
      RgbColor.PURPLE,
      RgbColor.CYAN,
      RgbColor.GOLD,
      RgbColor.LIME,
    ],
    hex: '#ff1919',
  },
  [RgbColor.GREEN]: {
    definition: {
      redChannel: 0,
      blueChannel: 0,
      greenChannel: 255,
      warmWhiteChannel: 0,
      coldWhiteChannel: 0,
      amberChannel: 0,
      uvChannel: 0,
    },
    alternative: WheelColor.GREEN,
    complementary: [
      RgbColor.RED,
      RgbColor.BLUE,
      RgbColor.YELLOW,
      RgbColor.LIGHTBLUE,
      RgbColor.ORANGE,
      RgbColor.ROSERED,
      RgbColor.PURPLE,
      RgbColor.CYAN,
      RgbColor.PINK,
      RgbColor.GOLD,
      RgbColor.BROWN,
      RgbColor.LIGHTPINK,
    ],
    hex: '#00e60c',
  },
  [RgbColor.BLUE]: {
    definition: {
      redChannel: 0,
      blueChannel: 255,
      greenChannel: 0,
      warmWhiteChannel: 0,
      coldWhiteChannel: 64,
      amberChannel: 0,
      uvChannel: 0,
    },
    alternative: WheelColor.BLUE,
    complementary: [
      RgbColor.RED,
      RgbColor.GREEN,
      RgbColor.YELLOW,
      RgbColor.ORANGE,
      RgbColor.ROSERED,
      RgbColor.PINK,
      RgbColor.GOLD,
      RgbColor.BROWN,
      RgbColor.LIGHTPINK,
      RgbColor.LIME,
    ],
    hex: '#0000ff',
  },
  [RgbColor.YELLOW]: {
    definition: {
      redChannel: 255,
      blueChannel: 0,
      greenChannel: 128,
      warmWhiteChannel: 0,
      coldWhiteChannel: 0,
      amberChannel: 255,
      uvChannel: 0,
    },
    alternative: WheelColor.YELLOW,
    complementary: [
      RgbColor.RED,
      RgbColor.GREEN,
      RgbColor.BLUE,
      RgbColor.LIGHTBLUE,
      RgbColor.PURPLE,
      RgbColor.CYAN,
      RgbColor.LIME,
    ],
    hex: '#fba900',
  },
  [RgbColor.LIGHTBLUE]: {
    definition: {
      redChannel: 0,
      blueChannel: 255,
      greenChannel: 0,
      warmWhiteChannel: 0,
      coldWhiteChannel: 128,
      amberChannel: 0,
      uvChannel: 0,
    },
    alternative: WheelColor.BLUE,
    complementary: [
      RgbColor.RED,
      RgbColor.GREEN,
      RgbColor.YELLOW,
      RgbColor.ORANGE,
      RgbColor.ROSERED,
      RgbColor.PURPLE,
      RgbColor.PINK,
      RgbColor.GOLD,
      RgbColor.BROWN,
      RgbColor.LIME,
    ],
    hex: '#6a6aff',
  },
  [RgbColor.ORANGE]: {
    definition: {
      redChannel: 255,
      blueChannel: 0,
      greenChannel: 100,
      warmWhiteChannel: 0,
      coldWhiteChannel: 0,
      amberChannel: 100,
      uvChannel: 0,
    },
    alternative: WheelColor.ORANGE,
    complementary: [
      RgbColor.GREEN,
      RgbColor.BLUE,
      RgbColor.LIGHTBLUE,
      RgbColor.PURPLE,
      RgbColor.CYAN,
      RgbColor.PINK,
      RgbColor.LIGHTPINK,
      RgbColor.LIME,
    ],
    hex: '#ff8000',
  },
  [RgbColor.ROSERED]: {
    definition: {
      redChannel: 255,
      blueChannel: 0,
      greenChannel: 0,
      warmWhiteChannel: 0,
      coldWhiteChannel: 64,
      amberChannel: 0,
      uvChannel: 0,
    },
    alternative: WheelColor.RED,
    complementary: [
      RgbColor.GREEN,
      RgbColor.BLUE,
      RgbColor.LIGHTBLUE,
      RgbColor.PURPLE,
      RgbColor.CYAN,
      RgbColor.BROWN,
      RgbColor.LIME,
    ],
    hex: '#ff3a7c',
  },
  [RgbColor.PURPLE]: {
    definition: {
      redChannel: 255,
      blueChannel: 255,
      greenChannel: 0,
      warmWhiteChannel: 0,
      coldWhiteChannel: 0,
      amberChannel: 0,
      uvChannel: 0,
    },
    alternative: WheelColor.BLUE,
    complementary: [
      RgbColor.RED,
      RgbColor.GREEN,
      RgbColor.YELLOW,
      RgbColor.LIGHTBLUE,
      RgbColor.ORANGE,
      RgbColor.ROSERED,
      RgbColor.CYAN,
      RgbColor.GOLD,
      RgbColor.BROWN,
      RgbColor.LIGHTPINK,
      RgbColor.LIME,
    ],
    hex: '#ff00f9',
  },
  [RgbColor.CYAN]: {
    definition: {
      redChannel: 0,
      blueChannel: 255,
      greenChannel: 255,
      warmWhiteChannel: 0,
      coldWhiteChannel: 0,
      amberChannel: 0,
      uvChannel: 0,
    },
    alternative: WheelColor.BLUE,
    complementary: [
      RgbColor.RED,
      RgbColor.BLUE,
      RgbColor.YELLOW,
      RgbColor.ORANGE,
      RgbColor.ROSERED,
      RgbColor.PINK,
      RgbColor.GOLD,
      RgbColor.BROWN,
      RgbColor.LIGHTPINK,
      RgbColor.LIME,
    ],
    hex: '#00d7fc',
  },
  [RgbColor.PINK]: {
    definition: {
      redChannel: 255,
      blueChannel: 128,
      greenChannel: 0,
      warmWhiteChannel: 0,
      coldWhiteChannel: 0,
      amberChannel: 0,
      uvChannel: 0,
    },
    alternative: WheelColor.RED,
    complementary: [
      RgbColor.GREEN,
      RgbColor.BLUE,
      RgbColor.LIGHTBLUE,
      RgbColor.ORANGE,
      RgbColor.CYAN,
      RgbColor.GOLD,
      RgbColor.BROWN,
      RgbColor.LIME,
    ],
    hex: '#f948c4',
  },
  [RgbColor.GOLD]: {
    definition: {
      redChannel: 128,
      blueChannel: 0,
      greenChannel: 0,
      warmWhiteChannel: 32,
      coldWhiteChannel: 0,
      amberChannel: 255,
      uvChannel: 0,
    },
    alternative: WheelColor.YELLOW,
    complementary: [
      RgbColor.RED,
      RgbColor.GREEN,
      RgbColor.BLUE,
      RgbColor.LIGHTBLUE,
      RgbColor.PURPLE,
      RgbColor.CYAN,
      RgbColor.PINK,
      RgbColor.LIGHTPINK,
      RgbColor.LIME,
    ],
    hex: '#ffbf00',
  },
  [RgbColor.BROWN]: {
    definition: {
      redChannel: 192,
      blueChannel: 0,
      greenChannel: 0,
      warmWhiteChannel: 0,
      coldWhiteChannel: 0,
      amberChannel: 192,
      uvChannel: 0,
    },
    alternative: WheelColor.YELLOW,
    complementary: [
      RgbColor.GREEN,
      RgbColor.BLUE,
      RgbColor.LIGHTBLUE,
      RgbColor.PURPLE,
      RgbColor.CYAN,
      RgbColor.PINK,
      RgbColor.LIGHTPINK,
      RgbColor.LIME,
    ],
    hex: '#ff4d00',
  },
  [RgbColor.LIGHTPINK]: {
    definition: {
      redChannel: 192,
      blueChannel: 128,
      greenChannel: 0,
      warmWhiteChannel: 64,
      coldWhiteChannel: 64,
      amberChannel: 0,
      uvChannel: 0,
    },
    alternative: WheelColor.RED,
    complementary: [
      RgbColor.GREEN,
      RgbColor.BLUE,
      RgbColor.ORANGE,
      RgbColor.CYAN,
      RgbColor.GOLD,
      RgbColor.BROWN,
      RgbColor.LIME,
    ],
    hex: '#fc8ddb',
  },
  [RgbColor.LIME]: {
    definition: {
      redChannel: 255,
      blueChannel: 0,
      greenChannel: 255,
      warmWhiteChannel: 0,
      coldWhiteChannel: 0,
      amberChannel: 0,
      uvChannel: 0,
    },
    alternative: WheelColor.GREEN,
    complementary: [
      RgbColor.RED,
      RgbColor.GREEN,
      RgbColor.BLUE,
      RgbColor.YELLOW,
      RgbColor.LIGHTBLUE,
      RgbColor.ORANGE,
      RgbColor.ROSERED,
      RgbColor.PURPLE,
      RgbColor.CYAN,
      RgbColor.PINK,
      RgbColor.GOLD,
      RgbColor.BROWN,
      RgbColor.LIGHTPINK,
    ],
    hex: '#80ff00',
  },
  [RgbColor.BLINDINGWHITE]: {
    definition: {
      redChannel: 255,
      blueChannel: 255,
      greenChannel: 255,
      warmWhiteChannel: 255,
      coldWhiteChannel: 255,
      amberChannel: 255,
      uvChannel: 0,
    },
    alternative: WheelColor.WHITE,
    complementary: [],
    hex: '#ffffff',
  },
  [RgbColor.UV]: {
    definition: {
      redChannel: 0,
      blueChannel: 0,
      greenChannel: 0,
      warmWhiteChannel: 0,
      coldWhiteChannel: 0,
      amberChannel: 0,
      uvChannel: 255,
    },
    alternative: WheelColor.WHITE,
    complementary: [],
    hex: '#330066',
  },
};

export function getTwoComplementaryRgbColors(): {
  colorNames: RgbColor[];
  colorSpecs: RgbColorSpecification[];
} {
  // Account for the colors without any complements
  const possibleColors = (Object.keys(rgbColorDefinitions) as RgbColor[]).filter(
    (c) => rgbColorDefinitions[c].complementary.length > 0,
  );

  const index = Math.floor(Math.random() * possibleColors.length);
  const baseColorName = possibleColors[index];
  const baseColor = rgbColorDefinitions[baseColorName];
  if (baseColor.complementary.length === 0)
    throw new Error(`Selected color ${baseColorName}, which has no complements`);
  const complementaryName =
    baseColor.complementary[Math.floor(Math.random() * baseColor.complementary.length)];
  const complementaryColor = rgbColorDefinitions[complementaryName];

  return {
    colorNames: [baseColorName, complementaryName],
    colorSpecs: [baseColor, complementaryColor],
  };
}
