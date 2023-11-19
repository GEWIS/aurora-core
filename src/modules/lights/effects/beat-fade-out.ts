import LightsEffect, { LightsEffectBuilder } from './lights-effect';
import { BeatEvent, TrackPropertiesEvent } from '../../events/music-emitter-events';
import { LightsGroup } from '../entities';
import { RgbColorSpecification } from '../color-definitions';

export default class BeatFadeOut extends LightsEffect {
  private phase = 0;

  private lastBeat = new Date().getTime(); // in ms since epoch;

  private beatLength: number = 1; // in ms;

  constructor(
    lightsGroup: LightsGroup,
    private colors: RgbColorSpecification[],
    features?: TrackPropertiesEvent,
    private enableFade = true,
  ) {
    super(lightsGroup, features);
  }

  /**
   * Create an constructor function that will create this effect with the given parameters
   * Used when you want to reference effects, but are not in the context of handlers.
   * @param colors
   */
  public static build(
    colors: RgbColorSpecification[],
    enableFade = true,
  ): LightsEffectBuilder<BeatFadeOut> {
    return (
      lightsGroup: LightsGroup,
      features?: TrackPropertiesEvent,
    ) => new BeatFadeOut(lightsGroup, colors, features, enableFade);
  }

  beat(event: BeatEvent): void {
    this.lastBeat = new Date().getTime();
    this.beatLength = event.beat.duration * 1000;
    this.phase = (this.phase + 1) % this.colors.length;
  }

  tick(): LightsGroup {
    const beatProgression = this.enableFade ? Math.max(
      1 - ((new Date().getTime() - this.lastBeat) / this.beatLength),
      0,
    ) : 1;

    this.lightsGroup.pars.forEach((p, i) => {
      const index = (i + this.phase) % this.colors.length;
      const color = this.colors[index];
      p.fixture.setMasterDimmer(Math.round(255 * beatProgression));
      p.fixture.setColor(color.definition);
    });

    this.lightsGroup.movingHeadWheels.forEach((m) => m.fixture.blackout());
    this.lightsGroup.movingHeadRgbs.forEach((m) => m.fixture.blackout());

    return this.lightsGroup;
  }
}
