import LightsEffect, { LightsEffectBuilder } from './lights-effect';
import { LightsGroup } from '../entities';
import { rgbColorDefinitions } from '../color-definitions';

const TURN_ON_TIME = 75;
const KEEP_ON_TIME = 100;

export default class SingleFlood extends LightsEffect {
  private effectStartTime = new Date();

  constructor(lightsGroup: LightsGroup, private milliseconds = 500) {
    super(lightsGroup);
  }

  beat(): void {
  }

  public static build(milliseconds?: number): LightsEffectBuilder {
    return (lightsGroup) => new SingleFlood(lightsGroup, milliseconds);
  }

  private getProgression(currentTick: Date) {
    const diff = Math.max(0, currentTick.getTime() - this.effectStartTime.getTime());
    if (diff < TURN_ON_TIME) return diff / TURN_ON_TIME;
    if (diff < TURN_ON_TIME + KEEP_ON_TIME) return 1;
    return 1 - Math.min(1, (diff - TURN_ON_TIME - KEEP_ON_TIME) / this.milliseconds);
  }

  tick(): LightsGroup {
    const progression = this.getProgression(new Date());

    this.lightsGroup.pars.forEach((p) => {
      p.fixture.setColor(rgbColorDefinitions.orange.definition);
      p.fixture.setMasterDimmer(255 * progression);
    });

    this.lightsGroup.movingHeadWheels.forEach((m) => m.fixture.blackout());
    this.lightsGroup.movingHeadRgbs.forEach((m) => m.fixture.blackout());

    return this.lightsGroup;
  }
}
