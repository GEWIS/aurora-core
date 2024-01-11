import LightsEffect, { LightsEffectBuilder } from './lights-effect';
import { LightsGroup } from '../entities';
import { RgbColorSpecification } from '../color-definitions';

export interface WaveProps {
  color: RgbColorSpecification,
  size?: number,
  cycleTime?: number,
}

export default class Wave extends LightsEffect {
  private cycleStartTick: Date = new Date();

  private color: RgbColorSpecification;

  private size = 1;

  private cycleTime = 1000;

  constructor(lightsGroup: LightsGroup, props: WaveProps) {
    super(lightsGroup);
    this.color = props.color;
    if (props.size !== undefined) this.size = props.size;
    if (props.cycleTime !== undefined) this.cycleTime = props.cycleTime;
  }

  public static build(props: WaveProps): LightsEffectBuilder {
    return (lightsGroup) => new Wave(lightsGroup, props);
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
