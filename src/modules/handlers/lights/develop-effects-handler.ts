import EffectsHandler from './effects-handler';
import { LightsGroup } from '../../lights/entities';
import Wave from '../../lights/effects/color/wave';
import { RgbColor } from '../../lights/color-definitions';
import { SearchLight } from '../../lights/effects/movement';

export default class DevelopEffectsHandler extends EffectsHandler {
  public registerEntity(entity: LightsGroup) {
    super.registerEntity(entity);
    this.groupColorEffects.set(entity, [
      new Wave(entity, { color: RgbColor.BLUE }),
    ]);
    this.groupMovementEffects.set(entity, [
      new SearchLight(entity, { radiusFactor: 1.3, cycleTime: 3000 }),
    ]);
  }
}
