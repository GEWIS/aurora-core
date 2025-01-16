import EffectsHandler from './effects-handler';
import { LightsGroup } from '../../lights/entities';
import { RgbColor } from '../../lights/color-definitions';
import { Wave } from '../../lights/effects/color';
import TableRotate from '../../lights/effects/movement/table-rotate';
import logger from '../../../logger';
import { ArtificialBeatGenerator } from '../../beats/artificial-beat-generator';
import {
  LightsEffectDirection,
  LightsEffectPattern,
} from '../../lights/effects/lights-effect-pattern';

export default class DevelopEffectsHandler extends EffectsHandler {
  public registerEntity(entity: LightsGroup) {
    if (this.entities.length === 0) {
      ArtificialBeatGenerator.getInstance().start(120);
    }

    super.registerEntity(entity);
    setTimeout(() => {
      logger.info(`Set develop effects for ${entity.name}`);
      this.groupColorEffects.set(entity, [
        // new BeatFadeOut(entity, {
        //   colors: [
        //     RgbColor.ORANGE,
        //     RgbColor.BLUE,
        //     // RgbColor.GREEN,
        //     // RgbColor.YELLOW,
        //     // RgbColor.LIGHTPINK,
        //   ],
        //   nrBlacks: 1,
        // }),
        new Wave(entity, {
          colors: [RgbColor.ORANGE],
          nrWaves: 1,
          pattern: LightsEffectPattern.HORIZONTAL,
          direction: LightsEffectDirection.BACKWARDS,
        }),
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
