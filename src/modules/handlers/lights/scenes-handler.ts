import BaseLightsHandler from '../base-lights-handler';
import { LightsGroup } from '../../lights/entities';
import { LightsScene } from '../../lights/entities/scenes';

export class ScenesHandler extends BaseLightsHandler {
  beat(): void {}

  tick(): LightsGroup[] {
    return this.entities;
  }

  applyScene(scene: LightsScene): void {
    this.entities.forEach((lightsGroup) => {
      lightsGroup.pars.forEach((par) => {
        const sceneForFixture = scene.pars.find((p) => p.groupParId === par.id);
        if (sceneForFixture) {
          par.fixture.setOverrideDmx(sceneForFixture.dmxValues);
        } else {
          par.fixture.clearOverrideDmx();
        }
      });
      lightsGroup.movingHeadRgbs.forEach((movingHeadRgb) => {
        const sceneForFixture = scene.movingHeadRgbs
          .find((p) => p.groupMovingHeadRgbId === movingHeadRgb.id);
        if (sceneForFixture) {
          movingHeadRgb.fixture.setOverrideDmx(sceneForFixture.dmxValues);
        } else {
          movingHeadRgb.fixture.clearOverrideDmx();
        }
      });
      lightsGroup.movingHeadWheels.forEach((movingHeadWheels) => {
        const sceneForFixture = scene.movingHeadWheels
          .find((p) => p.groupMovingHeadWheelId === movingHeadWheels.id);
        if (sceneForFixture) {
          movingHeadWheels.fixture.setOverrideDmx(sceneForFixture.dmxValues);
        } else {
          movingHeadWheels.fixture.clearOverrideDmx();
        }
      });
    });
  }
}
