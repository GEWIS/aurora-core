import EffectsHandler from './effects-handler';
import { LightsGroup } from '../../lights/entities';
import Sparkle from '../../lights/effects/sparkle';

export default class DevelopEffectsHandler extends EffectsHandler {
  public registerEntity(entity: LightsGroup) {
    super.registerEntity(entity);
    this.groupEffects.set(entity, new Sparkle(entity, ['green', 'yellow']));
  }
}
