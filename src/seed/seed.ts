import RootAudioService from '../modules/root/root-audio-service';
import RootScreenService from '../modules/root/root-screen-service';
import RootLightsService from '../modules/root/root-lights-service';
import dataSource from '../database';
import { LightsGroup, LightsMovingHeadWheel } from '../modules/lights/entities';
import { RgbColor } from '../modules/lights/color-definitions';
import { SparkleCreateParams } from '../modules/lights/effects/color/sparkle';
import { StaticColorCreateParams } from '../modules/lights/effects/color/static-color';
import { LightsPredefinedEffect } from '../modules/lights/entities/sequences/lights-predefined-effect';
import { LightsEffectsCreateParams } from '../modules/lights/effects';
import { WaveCreateParams } from '../modules/lights/effects/color/wave';

export default async function seedDatabase() {
  const rootAudioService = new RootAudioService();
  await Promise.all([rootAudioService.createAudio({ name: 'PCGEWISHOK' })]);

  const rootScreenService = new RootScreenService();
  await Promise.all([
    rootScreenService.createScreen({ name: 'PCGEWISB-links' }),
    rootScreenService.createScreen({ name: 'PCGEWISB-rechts' }),
    rootScreenService.createScreen({ name: 'PCGEWISINFO' }),
  ]);

  const rootLightsService = new RootLightsService();
  const controller = await rootLightsService.createController({ name: 'GEWIS-BAR' });

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const eurolite_LED_7C_7 = await rootLightsService.createLightsPar({
    name: 'Eurolite LED 7C-7',
    masterDimChannel: 1,
    shutterChannel: 2,
    shutterOptionValues: {
      open: 0,
      strobe: 220,
    },
    colorRedChannel: 3,
    colorGreenChannel: 4,
    colorBlueChannel: 5,
    colorColdWhiteChannel: 6,
    colorWarmWhiteChannel: 7,
    colorAmberChannel: 8,
    colorUvChannel: 9,
  });
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const eurolite_LED_TMH_S30 = await rootLightsService.createMovingHeadWheel({
    name: 'Eurolite LED TMH-S30',
    masterDimChannel: 10,
    shutterChannel: 9,
    shutterOptionValues: {
      open: 0,
      strobe: 220,
    },
    colorWheelChannel: 6,
    goboWheelChannel: 7,
    goboRotateChannel: 8,
    panChannel: 1,
    finePanChannel: 2,
    tiltChannel: 3,
    fineTiltChannel: 4,
    movingSpeedChannel: 5,
    colorWheelChannelValues: [],
    goboWheelChannelValues: [],
  });
  eurolite_LED_TMH_S30.resetChannelAndValue = [12, 255];
  await dataSource.getRepository(LightsMovingHeadWheel).save(eurolite_LED_TMH_S30);

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const ayra_ERO_506 = await rootLightsService.createMovingHeadRgb({
    name: 'Ayra ERO 506',
    masterDimChannel: 6,
    shutterChannel: 7,
    shutterOptionValues: {
      open: 255,
      strobe: 110,
    },
    panChannel: 1,
    finePanChannel: 2,
    tiltChannel: 3,
    fineTiltChannel: 4,
    colorRedChannel: 8,
    colorGreenChannel: 9,
    colorBlueChannel: 10,
    colorColdWhiteChannel: 11,
    colorAmberChannel: 12,
    colorUvChannel: 13,
  });

  const gewisRoom = await rootLightsService.createLightGroup(controller.id, {
    name: 'Ruimte',
    pars: [
      { fixtureId: eurolite_LED_7C_7.id, firstChannel: 1 },
      { fixtureId: eurolite_LED_7C_7.id, firstChannel: 17 },
      { fixtureId: eurolite_LED_7C_7.id, firstChannel: 33 },
      { fixtureId: eurolite_LED_7C_7.id, firstChannel: 49 },
      { fixtureId: eurolite_LED_7C_7.id, firstChannel: 65 },
      { fixtureId: eurolite_LED_7C_7.id, firstChannel: 81 },
      { fixtureId: eurolite_LED_7C_7.id, firstChannel: 193 },
      { fixtureId: eurolite_LED_7C_7.id, firstChannel: 209 },
      { fixtureId: eurolite_LED_7C_7.id, firstChannel: 225 },
      { fixtureId: eurolite_LED_7C_7.id, firstChannel: 241 },
      { fixtureId: eurolite_LED_7C_7.id, firstChannel: 257 },
      { fixtureId: eurolite_LED_7C_7.id, firstChannel: 273 },
    ],
    movingHeadRgbs: [],
    movingHeadWheels: [],
  });
  const gewisBar = await rootLightsService.createLightGroup(controller.id, {
    name: 'Bar',
    pars: [
      { fixtureId: eurolite_LED_7C_7.id, firstChannel: 97 },
      { fixtureId: eurolite_LED_7C_7.id, firstChannel: 113 },
      { fixtureId: eurolite_LED_7C_7.id, firstChannel: 289 },
      { fixtureId: eurolite_LED_7C_7.id, firstChannel: 305 },
    ],
    movingHeadRgbs: [],
    movingHeadWheels: [],
  });
  const gewisLounge = await rootLightsService.createLightGroup(controller.id, {
    name: 'Lounge',
    pars: [{ fixtureId: eurolite_LED_7C_7.id, firstChannel: 129 }],
    movingHeadRgbs: [],
    movingHeadWheels: [],
  });
  const gewisMHRoom = await rootLightsService.createLightGroup(controller.id, {
    name: 'Ruimte MH',
    pars: [],
    movingHeadRgbs: [],
    movingHeadWheels: [
      { fixtureId: eurolite_LED_TMH_S30.id, firstChannel: 161 },
      { fixtureId: eurolite_LED_TMH_S30.id, firstChannel: 177 },
    ],
  });
  const royMHs = await rootLightsService.createLightGroup(controller.id, {
    name: 'Roy MH',
    pars: [],
    movingHeadRgbs: [
      { fixtureId: ayra_ERO_506.id, firstChannel: 353 },
      { fixtureId: ayra_ERO_506.id, firstChannel: 369 },
    ],
    movingHeadWheels: [],
  });

  return Promise.all(
    [gewisRoom, gewisBar, gewisLounge, gewisMHRoom, royMHs].map(
      (g) => dataSource.getRepository(LightsGroup).findOne({ where: { id: g!.id } })!,
    ),
  );
}

export async function seedOpeningSequence(
  room: LightsGroup,
  bar: LightsGroup,
  movingHeadsGEWIS: LightsGroup,
  movingHeadsRoy?: LightsGroup,
) {
  const repo = dataSource.getRepository(LightsPredefinedEffect);
  const trackUri = 'spotify:track:22L7bfCiAkJo5xGSQgmiIO';

  const addStep = async (
    effect: LightsEffectsCreateParams,
    timestamp: number,
    duration: number,
    lightGroups: LightsGroup[],
  ) => {
    await repo.save({
      trackUri,
      timestamp,
      duration,
      effect: effect.type,
      effectProps: JSON.stringify(effect.props),
      lightGroups,
    } as LightsPredefinedEffect);
  };

  const borrelRuimte: StaticColorCreateParams = {
    type: 'StaticColor',
    props: {
      color: RgbColor.RED,
      relativeBrightness: 0.8,
    },
  };
  const borrelBar: StaticColorCreateParams = {
    type: 'StaticColor',
    props: {
      color: RgbColor.GREEN,
      relativeBrightness: 0.8,
    },
  };

  const allOfTheLights: SparkleCreateParams = {
    type: 'Sparkle',
    props: {
      colors: [RgbColor.BLUE],
      ratio: 0.2,
      dimDuration: 25,
      cycleTime: 75,
    },
  };

  const movingHeadsWhite: StaticColorCreateParams = {
    type: 'StaticColor',
    props: { color: RgbColor.WHITE },
  };

  const spots = [room, bar];
  if (movingHeadsRoy) spots.push(movingHeadsRoy);

  await addStep(borrelRuimte, 0, 14000, [room]);
  await addStep(borrelBar, 0, 14000, [bar]);

  const registerDim = async (
    dimStart: number,
    dimEnd: number,
    stepDuration: number,
    dim = true,
    effectRoom: StaticColorCreateParams = borrelRuimte,
    effectBar: StaticColorCreateParams = borrelBar,
  ) => {
    const steps = Math.round((dimEnd - dimStart) / stepDuration);
    await Promise.all(
      new Array(Math.round(steps) + 1).fill(0).map(async (x, i) => {
        const progression = Math.min(i / steps, 1);
        const relativeBrightness = dim ? 0.8 * (1 - progression) : 0.8 * progression;
        await addStep(
          {
            ...effectRoom,
            props: { ...effectRoom.props, relativeBrightness },
          },
          dimStart + i * stepDuration,
          stepDuration + 25,
          [room],
        );
        await addStep(
          {
            ...effectBar,
            props: { ...effectBar.props, relativeBrightness },
          },
          dimStart + i * stepDuration,
          stepDuration + 25,
          [bar],
        );
      }),
    );
  };

  await registerDim(14000, 27500, 250);

  // Keep SearchLight animation on till the moving-head only blackout.
  await addStep({ type: 'SearchLight', props: { radiusFactor: 1.5 } }, 28000, 189000, [
    movingHeadsGEWIS,
  ]);

  // Refrein 1
  await addStep(movingHeadsWhite, 28000, 32000, [movingHeadsGEWIS]);
  await addStep(allOfTheLights, 27500, 1500, [room, bar]);
  await addStep(
    { type: 'Wave', props: { color: RgbColor.ROSERED } } as WaveCreateParams,
    29000,
    4000,
    spots,
  );
  await addStep(allOfTheLights, 33000, 2000, [room, bar]);
  await addStep(
    { type: 'Wave', props: { color: RgbColor.ROSERED } } as WaveCreateParams,
    35000,
    5000,
    spots,
  );
  await addStep(allOfTheLights, 40000, 1500, [room, bar]);
  await addStep(
    { type: 'Wave', props: { color: RgbColor.ROSERED } } as WaveCreateParams,
    41500,
    13500,
    spots,
  );

  // Couplet
  await addStep(
    { type: 'BeatFadeOut', props: { colors: [RgbColor.PURPLE, RgbColor.GREEN], nrBlacks: 1 } },
    55000,
    5500,
    spots,
  );
  // BLACKOUT (at 1 minute exactly for 2,5 seconds)
  await addStep(
    { type: 'BeatFadeOut', props: { colors: [RgbColor.PURPLE, RgbColor.GREEN], nrBlacks: 1 } },
    62500,
    19000,
    spots,
  );
  await addStep(movingHeadsWhite, 63000, 155000, [movingHeadsGEWIS]);

  await addStep(allOfTheLights, 81500, 2000, spots);
  await addStep({ type: 'Wave', props: { color: RgbColor.PINK } }, 83500, 4500, spots);
  await addStep(allOfTheLights, 88000, 2000, spots);
  await addStep({ type: 'Wave', props: { color: RgbColor.PINK } }, 90000, 4800, spots);
  await addStep(allOfTheLights, 94800, 1600, spots);
  await addStep(
    { type: 'Sparkle', props: { colors: [RgbColor.GREEN, RgbColor.BROWN] } },
    96000,
    12400,
    spots,
  );
  await addStep(allOfTheLights, 108400, 1600, spots);
  await addStep(
    { type: 'BeatFadeOut', props: { colors: [RgbColor.ORANGE, RgbColor.LIGHTBLUE], nrBlacks: 1 } },
    110000,
    25800,
    spots,
  );

  // Refrein
  await addStep(allOfTheLights, 135800, 1200, spots);
  await addStep({ type: 'Wave', props: { color: RgbColor.YELLOW } }, 138000, 4000, spots);
  await addStep(allOfTheLights, 142000, 2000, spots);
  await addStep({ type: 'Wave', props: { color: RgbColor.YELLOW } }, 144000, 4000, spots);
  await addStep(allOfTheLights, 148000, 2000, spots);

  await addStep(
    { type: 'Sparkle', props: { colors: [RgbColor.BLUE, RgbColor.LIME] } },
    150000,
    12500,
    spots,
  );
  await addStep(allOfTheLights, 162500, 1000, spots);
  await addStep(
    {
      type: 'Sparkle',
      props: {
        colors: [RgbColor.GOLD],
        dimDuration: 2000,
        cycleTime: 125,
        ratio: 0.05,
      },
    },
    163500,
    27000,
    spots,
  );
  await addStep(
    { type: 'Wave', props: { color: RgbColor.YELLOW, cycleTime: 425 } },
    190500,
    27500,
    spots,
  );

  await addStep(movingHeadsWhite, 218000, 26000, [movingHeadsGEWIS]);
  await addStep({ type: 'SearchLight', props: { cycleTime: 10000 } }, 218000, 26000, [
    movingHeadsGEWIS,
  ]);

  // Slowly turn on lights
  await registerDim(
    231000,
    244000,
    250,
    false,
    { type: 'StaticColor', props: { color: RgbColor.UV } },
    { type: 'StaticColor', props: { color: RgbColor.UV } },
  );

  await addStep({ type: 'SingleFlood', props: { dimMilliseconds: 5000 } }, 244000, 7000, spots);
  await addStep({ type: 'SingleFlood', props: { dimMilliseconds: 5000 } }, 251000, 7000, spots);
  await addStep(allOfTheLights, 258000, 1000, spots);
  await addStep({ type: 'Strobe', props: { durationMs: 3000 } }, 259000, 3000, spots);

  await addStep(
    { type: 'BeatFadeOut', props: { colors: [RgbColor.RED, RgbColor.CYAN] } },
    262000,
    23000,
    spots,
  );
  await addStep(movingHeadsWhite, 262000, 23000, [movingHeadsGEWIS]);
  await addStep({ type: 'RandomPosition', props: { beatsToMove: 1 } }, 262000, 23000, [
    movingHeadsGEWIS,
  ]);

  await addStep(borrelRuimte, 285000, 15000, [room]);
  await addStep(borrelBar, 285000, 15000, [bar]);
}
