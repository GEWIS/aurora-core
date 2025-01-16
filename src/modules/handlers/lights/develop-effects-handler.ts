import EffectsHandler from './effects-handler';
import { LightsGroup } from '../../lights/entities';
import { RgbColor } from '../../lights/color-definitions';
import { BeatFadeOut } from '../../lights/effects/color';
import TableRotate from '../../lights/effects/movement/table-rotate';
import logger from '../../../logger';
import { ArtificialBeatGenerator } from '../../beats/artificial-beat-generator';

export default class DevelopEffectsHandler extends EffectsHandler {
  public registerEntity(entity: LightsGroup) {
    if (this.entities.length === 0) {
      ArtificialBeatGenerator.getInstance().start(120);
    }

    super.registerEntity(entity);
    setTimeout(() => {
      logger.info(`Set develop effects for ${entity.name}`);
      this.groupColorEffects.set(entity, [
        new BeatFadeOut(entity, {
          colors: [
            RgbColor.ORANGE,
            RgbColor.BLUE,
            // RgbColor.GREEN,
            // RgbColor.YELLOW,
            // RgbColor.LIGHTPINK,
          ],
          nrBlacks: 1,
        }),
        // new Wave(entity, { color: RgbColor.ORANGE, nrWaves: 4 }),
      ]);
      this.groupMovementEffects.set(entity, [new TableRotate(entity, {})]);
    }, 3000);
  }

  public removeEntity(entityCopy: LightsGroup) {
    super.removeEntity(entityCopy);

    if (this.entities.length === 0) {
      ArtificialBeatGenerator.getInstance().stop();
    }
  }
}
