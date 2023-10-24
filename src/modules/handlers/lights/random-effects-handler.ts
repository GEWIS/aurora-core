import BaseLightsHandler from '../base-lights-handler';
import { LightsGroup } from '../../lights/entities';
import { BeatEvent } from '../../events/MusicEmitter';
import LightsEffect from '../../lights/effects/LightsEffect';
import BeatFadeOut from '../../lights/effects/BeatFadeOut';
import { rgbColors, wheelColors } from '../../lights/ColorDefinitions';

export default class RandomEffectsHandler extends BaseLightsHandler {
  /**
   * Assign every group of lights exactly one effect
   */
  private groupEffects: Map<LightsGroup, LightsEffect | null> = new Map();

  private lastSectionStart: number = 0;

  // Override entity register function to also populate the groupEffect mapping
  public registerEntity(entity: LightsGroup) {
    super.registerEntity(entity);
    this.assignRandomEffect(entity);
  }

  // We should also remove the entity from the effects mapping
  public removeEntity(entity: LightsGroup) {
    this.groupEffects.delete(entity);
    super.removeEntity(entity);
  }

  /**
   * Assign a random effect with random colors to the given lights group
   * @param entity
   * @private
   */
  private assignRandomEffect(entity: LightsGroup) {
    const color = wheelColors[Math.floor(Math.random() * wheelColors.length)];
    const rgbColor = rgbColors[Math.floor(Math.random() * rgbColors.length)];
    // We currently have only one effect, so that makes our choice easy
    this.groupEffects.set(entity, new BeatFadeOut(entity, color, this.trackFeatures, rgbColor));
  }

  tick(): LightsGroup[] {
    const result: LightsGroup[] = [];

    this.groupEffects.forEach((effect) => {
      if (!effect) return;
      result.push(effect.tick());
    });

    return result;
  }

  beat(event: BeatEvent): void {
    // If we reach a new section in a song, assign a new effect
    if (event.section && event.section?.start !== this.lastSectionStart) {
      this.lastSectionStart = event.section?.start;
      this.entities.forEach((group) => {
        this.assignRandomEffect(group);
      });
    }

    // Propagate the beat to every effect
    this.groupEffects.forEach((effect) => {
      if (!effect) return;
      effect.beat(event);
    });
  }
}
