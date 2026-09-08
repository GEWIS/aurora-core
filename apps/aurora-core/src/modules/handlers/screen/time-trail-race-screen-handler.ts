import BaseScreenHandler from '../../root/base-screen-handler';
import { FeatureEnabled } from '../../server-settings';

@FeatureEnabled('TimeTrailRace')
export default class TimeTrailRaceScreenHandler extends BaseScreenHandler {
  changeTrack(): void {}

  beat(): void {}

  initialized<T>(params: T): void {
    this.sendEvent('race-initialized', params);
  }

  playerRegistered<T>(params: T): void {
    this.sendEvent('race-player-registered', params);
  }

  playerReady<T>(params: T): void {
    this.sendEvent('race-player-ready', params);
  }

  started<T>(params: T): void {
    this.sendEvent('race-started', params);
  }

  finished<T>(params: T): void {
    this.sendEvent('race-finished', params);
  }

  showScoreboard<T>(params: T): void {
    this.sendEvent('race-scoreboard', params);
  }
}
