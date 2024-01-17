import LightsEffect, { LightsEffectBuilder } from './lights-effect';
import { LightsGroup } from '../entities';
import { RgbColorSpecification } from '../color-definitions';

export interface WaveProps {
  color: RgbColorSpecification,
  size?: number,
  cycleTime?: number,
}

const DEFAULT_SIZE = 1;
const DEFAULT_CYCLE_TIME = 1000;

export default class Wave extends LightsEffect {
  private cycleStartTick: Date = new Date();

  private props: WaveProps;

  constructor(lightsGroup: LightsGroup, props: WaveProps) {
    super(lightsGroup);
    this.props = props;
  }

  public static build(props: WaveProps): LightsEffectBuilder {
    return (lightsGroup) => new Wave(lightsGroup, props);
  }

  beat(): void {}

  private getProgression(currentTick: Date) {
    const cycleTime = this.props.cycleTime ?? DEFAULT_CYCLE_TIME;
    return Math.min(1, (currentTick.getTime() - this.cycleStartTick.getTime()) / cycleTime);
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
      p.fixture.setColor(this.props.color.definition);
    });

    return this.lightsGroup;
  }
}
