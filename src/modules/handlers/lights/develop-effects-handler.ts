import EffectsHandler from './effects-handler';
import { LightsGroup } from '../../lights/entities';
import { RgbColor } from '../../lights/color-definitions';
import { BeatFadeOut, Wave } from '../../lights/effects/color';
import TableRotate from '../../lights/effects/movement/table-rotate';
import logger from '../../../logger';

export default class DevelopEffectsHandler extends EffectsHandler {
  public registerEntity(entity: LightsGroup) {
    super.registerEntity(entity);
    setTimeout(() => {
      logger.info(`Set develop effects for ${entity.name}`);
      this.groupColorEffects.set(entity, [
        new BeatFadeOut(entity, { colors: [RgbColor.ORANGE, RgbColor.BLUE], nrBlacks: 1 }),
      ]);
      this.groupMovementEffects.set(entity, [new TableRotate(entity, {})]);
    }, 5000);
  }
}
