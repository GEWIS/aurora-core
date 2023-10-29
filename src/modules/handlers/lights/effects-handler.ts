import BaseLightsHandler from '../base-lights-handler';
import { LightsGroup } from '../../lights/entities';
import LightsEffect from '../../lights/effects/lights-effect';

export default abstract class EffectsHandler extends BaseLightsHandler {
  /**
   * Assign every group of lights exactly one effect
   */
  protected groupEffects: Map<LightsGroup, LightsEffect | null> = new Map();

  // Override entity register function to also populate the groupEffect mapping
  public registerEntity(entity: LightsGroup) {
    super.registerEntity(entity);
    this.groupEffects.set(entity, null);
  }

  // We should also remove the entity from the effects mapping
  public removeEntity(entity: LightsGroup) {
    this.groupEffects.delete(entity);
    super.removeEntity(entity);
  }

  tick(): LightsGroup[] {
    const result: LightsGroup[] = [];

    this.groupEffects.forEach((effect, group) => {
      if (!effect) {
        group.blackout();
        result.push(group);
      } else {
        result.push(effect.tick());
      }
    });

    return result;
  }
}
