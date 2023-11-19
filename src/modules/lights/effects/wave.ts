import LightsEffect, { LightsEffectBuilder } from './lights-effect';
import { LightsGroup } from '../entities';
import { RgbColorSpecification } from '../color-definitions';

export class Wave extends LightsEffect {
  private cycleStartTick: Date = new Date();

  constructor(
    lightsGroup: LightsGroup,
    private color: RgbColorSpecification,
    private size = 1,
    private cycleTime = 1000,
  ) {
    super(lightsGroup);
  }

  public static build(
    color: RgbColorSpecification,
    size?: number,
    cycleTime?: number,
  ): LightsEffectBuilder {
    return (lightsGroup) => new Wave(lightsGroup, color, size, cycleTime);
  }

  beat(): void {}

  private getProgression(currentTick: Date) {
    return Math.min(1, (currentTick.getTime() - this.cycleStartTick.getTime()) / this.cycleTime);
  }

  tick(): LightsGroup {
    const currentTick = new Date();
    const progression = this.getProgression(currentTick);
    if (progression >= 1) {
      this.cycleStartTick = currentTick;
    }
    const nrLights = this.lightsGroup.pars.length;

    this.lightsGroup.pars.sort((p1, p2) => p2.firstChannel - p1.firstChannel).forEach((p, i) => {
      const brightness = Math.sin(((i / nrLights) + progression) * 2 * Math.PI);
      p.fixture.setMasterDimmer(Math.max(0, brightness * 255));
      p.fixture.setColor(this.color.definition);
    });

    return this.lightsGroup;
  }
}
