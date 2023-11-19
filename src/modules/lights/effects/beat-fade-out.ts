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
    private addBlacks = false,
  ) {
    super(lightsGroup, features);
  }

  /**
   * Create an constructor function that will create this effect with the given parameters
   * Used when you want to reference effects, but are not in the context of handlers.
   * @param colors One or more colors that should be shown
   * @param enableFade Whether the lights should be turned off using a fade effect
   * on each beat
   * @param addBlacks If a "black" color should be added
   */
  public static build(
    colors: RgbColorSpecification[],
    enableFade?: boolean,
    addBlacks?: boolean,
  ): LightsEffectBuilder<BeatFadeOut> {
    return (
      lightsGroup: LightsGroup,
      features?: TrackPropertiesEvent,
    ) => new BeatFadeOut(lightsGroup, colors, features, enableFade, addBlacks);
  }

  beat(event: BeatEvent): void {
    this.lastBeat = new Date().getTime();
    this.beatLength = event.beat.duration * 1000;
    this.phase = (this.phase + 1) % (this.colors.length + (this.addBlacks ? 1 : 0));
  }

  tick(): LightsGroup {
    const beatProgression = this.enableFade ? Math.max(
      1 - ((new Date().getTime() - this.lastBeat) / this.beatLength),
      0,
    ) : 1;

    const nrColors = this.colors.length + (this.addBlacks ? 1 : 0);
    this.lightsGroup.pars.forEach((p, i) => {
      const index = (i + this.phase) % nrColors;
      if (index === this.colors.length) {
        p.fixture.setMasterDimmer(0);
        return;
      }
      const color = this.colors[index];
      p.fixture.setMasterDimmer(Math.round(255 * beatProgression));
      p.fixture.setColor(color.definition);
    });

    this.lightsGroup.movingHeadWheels.forEach((m) => m.fixture.blackout());
    this.lightsGroup.movingHeadRgbs.forEach((m) => m.fixture.blackout());

    return this.lightsGroup;
  }
}
