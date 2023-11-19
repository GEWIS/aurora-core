import EffectsHandler from './effects-handler';
import { LightsGroup } from '../../lights/entities';
import { Wave } from '../../lights/effects/wave';
import { rgbColorDefinitions } from '../../lights/color-definitions';
import { SearchLight } from '../../lights/effects';

export default class DevelopEffectsHandler extends EffectsHandler {
  public registerEntity(entity: LightsGroup) {
    super.registerEntity(entity);
    this.groupEffects.set(entity, [
      new Wave(entity, rgbColorDefinitions.blue),
      new SearchLight(entity, 1.3, 3000),
    ]);
  }
}
