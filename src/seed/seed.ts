import RootAudioService from '../modules/root/root-audio-service';
import RootScreenService from '../modules/root/root-screen-service';
import RootLightsService from '../modules/root/root-lights-service';
import dataSource from '../database';
import { LightsMovingHeadWheel } from '../modules/lights/entities';

export default async function seedDatabase() {
  const rootAudioService = new RootAudioService();
  const audios = await Promise.all([
    rootAudioService.createAudio({ name: 'PCGEWISHOK' }),
  ]);

  const rootScreenService = new RootScreenService();
  const screens = await Promise.all([
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
    strobeChannel: 2,
    colorRedChannel: 3,
    colorBlueChannel: 4,
    colorGreenChannel: 5,
    colorColdWhiteChannel: 6,
    colorWarmWhiteChannel: 7,
    colorAmberChannel: 8,
    colorUvChannel: 9,
  });
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const eurolite_LED_TMH_S30 = await rootLightsService.createMovingHeadWheel({
    name: 'Eurolite LED TMH-S30',
    masterDimChannel: 10,
    strobeChannel: 9,
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

  const lightsGroup1 = await rootLightsService.createLightGroup(controller.id, {
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
  const lightsGroup2 = await rootLightsService.createLightGroup(controller.id, {
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
  const lightsGroup3 = await rootLightsService.createLightGroup(controller.id, {
    name: 'Lounge',
    pars: [
      { fixtureId: eurolite_LED_7C_7.id, firstChannel: 129 },
    ],
    movingHeadRgbs: [],
    movingHeadWheels: [],
  });
  const lightsGroup4 = await rootLightsService.createLightGroup(controller.id, {
    name: 'Ruimte MH',
    pars: [],
    movingHeadRgbs: [],
    movingHeadWheels: [
      { fixtureId: eurolite_LED_TMH_S30.id, firstChannel: 161 },
      { fixtureId: eurolite_LED_TMH_S30.id, firstChannel: 177 },
    ],
  });
}
