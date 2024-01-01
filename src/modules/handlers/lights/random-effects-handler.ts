import { LightsGroup } from '../../lights/entities';
import { BeatEvent } from '../../events/music-emitter-events';
import { BeatFadeOut } from '../../lights/effects';
import { getTwoComplementaryRgbColors } from '../../lights/color-definitions';
import EffectsHandler from './effects-handler';

export default class RandomEffectsHandler extends EffectsHandler {
  private lastSectionStart: number = 0;

  // Override entity register function to assign random effect
  public registerEntity(entity: LightsGroup) {
    super.registerEntity(entity);
    this.assignRandomEffect(entity);
  }

  /**
   * Assign a random effect with random colors to the given lights group
   * @param entity
   * @private
   */
  private assignRandomEffect(entity: LightsGroup) {
    const { colorSpecs } = getTwoComplementaryRgbColors();
    // We currently have only one effect, so that makes our choice easy
    this.groupEffects.set(entity, new BeatFadeOut(
      entity,
      { colors: colorSpecs, enableFade: false },
      this.trackFeatures,
    ));
    // this.groupEffects.set(entity, new Strobe(entity, this.trackFeatures));
  }

  beat(event: BeatEvent): void {
    // If we reach a new section in a song, assign a new effect
    if (event.section && event.section?.start !== this.lastSectionStart) {
      this.lastSectionStart = event.section?.start;
      this.entities.forEach((group) => {
        this.assignRandomEffect(group);
      });
    }

    super.beat(event);
  }
}
