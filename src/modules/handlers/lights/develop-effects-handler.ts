import EffectsHandler from './effects-handler';
import { LightsGroup } from '../../lights/entities';
import { RgbColor } from '../../lights/color-definitions';
import { Fire, StaticColor } from '../../lights/effects/color';
import TableRotate from '../../lights/effects/movement/table-rotate';

export default class DevelopEffectsHandler extends EffectsHandler {
  public registerEntity(entity: LightsGroup) {
    super.registerEntity(entity);
    this.groupColorEffects.set(entity, [new Fire(entity, {})]);
    this.groupMovementEffects.set(entity, [new TableRotate(entity, {})]);
  }
}
