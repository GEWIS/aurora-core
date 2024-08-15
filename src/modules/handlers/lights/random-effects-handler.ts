import { LightsGroup } from '../../lights/entities';
import { BeatEvent } from '../../events/music-emitter-events';
import { BeatFadeOut, Sparkle, StaticColor, Wave } from '../../lights/effects/color';
import { getTwoComplementaryRgbColors, RgbColor } from '../../lights/color-definitions';
import EffectsHandler from './effects-handler';
import { SearchLight } from '../../lights/effects/movement';

export default class RandomEffectsHandler extends EffectsHandler {
  private lastSectionStart: number = 0;

  private colors: RgbColor[] = getTwoComplementaryRgbColors().colorNames;

  // Override entity register function to assign random effect
  public registerEntity(entity: LightsGroup) {
    super.registerEntity(entity);
    this.assignRandomEffect(entity);
  }

  private updateRandomColor() {
    const colors = getTwoComplementaryRgbColors();
    this.colors = colors.colorNames;
  }

  /**
   * Assign a random effect with random colors to the given lights group
   * @param entity
   * @private
   */
  private assignRandomEffect(entity: LightsGroup) {
    // Destroy the existing effect(s)
    this.clearEffect(entity);

    if (entity.movingHeadWheels.length === 0) {
      const random = Math.random();
      if (random < 0.8) {
        this.groupColorEffects.set(
          entity,
          new BeatFadeOut(
            entity,
            { colors: this.colors, enableFade: false, nrBlacks: 1 },
            this.trackFeatures,
          ),
        );
      } else if (random < 0.9) {
        this.groupColorEffects.set(entity, new Wave(entity, { color: this.colors[0] }));
      } else {
        this.groupColorEffects.set(entity, new Sparkle(entity, { colors: this.colors }));
      }
    } else {
      this.groupColorEffects.set(entity, new StaticColor(entity, { color: RgbColor.WHITE }));
    }
    this.groupMovementEffects.set(entity, new SearchLight(entity, {}));
  }

  beat(event: BeatEvent): void {
    // If we reach a new section in a song, assign a new effect
    if (event.section && event.section?.start !== this.lastSectionStart) {
      this.lastSectionStart = event.section?.start;
      this.updateRandomColor();
      this.entities.forEach((group) => {
        this.assignRandomEffect(group);
      });
    }

    super.beat(event);
  }
}
