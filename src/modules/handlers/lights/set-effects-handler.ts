import EffectsHandler from './effects-handler';
import { LightsGroup } from '../../lights/entities';
import { LightsEffectBuilder } from '../../lights/effects/lights-effect';
import { LIGHTS_EFFECTS, LightsEffectsCreateParams } from '../../lights/effects';
import { BeatEvent } from '../../events/music-emitter-events';

export default class SetEffectsHandler extends EffectsHandler {
  /**
   * Attach the given effect to the given lightsGroup
   * @param lightsGroup
   * @param effects
   */
  public setEffect(lightsGroup: LightsGroup, effects: LightsEffectBuilder[]) {
    // Reset the current lights before setting anything new
    lightsGroup.blackout();
    this.groupEffects.set(lightsGroup, effects.map((e) => e(lightsGroup, this.trackFeatures)));
  }

  /**
   * Remove any existing effects from the lightsGroup. Will default to blackout
   * @param lightsGroup
   */
  public removeEffect(lightsGroup: LightsGroup) {
    lightsGroup.blackout();
    this.groupEffects.set(lightsGroup, null);
  }

  /**
   * Given a list of effects to create, add the given effects to the given
   * lightgroup. Remove all effects if an empty array is given
   * @param id
   * @param effects
   */
  public parseAndSetEffects(id: number, effects: LightsEffectsCreateParams[]) {
    const lightsGroup = this.entities.find((e) => e.id === id);
    if (lightsGroup === undefined) throw new Error(`LightsGroup with ID ${id} is not registered to this handler.`);

    if (effects.length === 0) {
      this.removeEffect(lightsGroup);
      return;
    }

    const effectBuilders = effects.map((effect) => LIGHTS_EFFECTS.map((EFFECT) => {
      if (EFFECT.name === effect.type) {
        // @ts-ignore No idea how to do this properly with Typescript
        return EFFECT.build(effect.props);
      }
      return undefined;
    }).filter((e) => e !== undefined)
      .map((e) => e!)
      .flat()[0]);

    this.setEffect(lightsGroup, effectBuilders);
  }
}
