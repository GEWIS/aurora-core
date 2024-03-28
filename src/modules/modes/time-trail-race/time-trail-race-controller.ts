import { Controller } from '@tsoa/runtime';
import { Body, Get, Post, Response, Route, Security, Tags } from 'tsoa';
import TimeTrailRaceMode from './time-trail-race-mode';
import ModeManager from '../mode-manager';
import { SecurityGroup } from '../../../helpers/security';
import { RegisterPlayerParams } from './time-trail-race-entities';

@Route('modes/time-trail-race')
@Tags('Modes')
export class TimeTrailRaceController extends Controller {
  private modeManager: ModeManager;

  constructor() {
    super();
    this.modeManager = ModeManager.getInstance();
  }

  @Security('local', [SecurityGroup.ADMIN, SecurityGroup.BAC, SecurityGroup.BOARD])
  @Get('state')
  @Response<string>(411, 'Time Trail Race not enabled')
  public getRaceState() {
    const mode = this.modeManager.getMode(TimeTrailRaceMode) as TimeTrailRaceMode | undefined;
    if (mode === undefined) {
      this.setStatus(411);
      return 'Time Trail Mode not enabled';
    }

    return mode.state;
  }

  @Security('local', [SecurityGroup.ADMIN, SecurityGroup.BAC, SecurityGroup.BOARD])
  @Post('register-player')
  @Response<string>(411, 'Time Trail Race not enabled')
  @Response<string>(411, 'Time Trail Race not in INITIALIZED or SCOREBOARD state')
  public raceRegisterPlayer(@Body() params: RegisterPlayerParams) {
    const mode = this.modeManager.getMode(TimeTrailRaceMode) as TimeTrailRaceMode | undefined;
    if (mode === undefined) {
      this.setStatus(411);
      return 'Time Trail Mode not enabled';
    }

    if (!mode.registerPlayer(params)) {
      this.setStatus(411);
      return 'Time Trail Race not in INITIALIZED or SCOREBOARD state';
    }

    this.setStatus(204);
    return '';
  }

  @Security('local', [SecurityGroup.ADMIN, SecurityGroup.BAC, SecurityGroup.BOARD])
  @Post('ready')
  @Response<string>(411, 'Time Trail Race not enabled')
  @Response<string>(411, 'Time Trail Race not in PLAYER_REGISTERED state')
  public raceReady() {
    const mode = this.modeManager.getMode(TimeTrailRaceMode) as TimeTrailRaceMode | undefined;
    if (mode === undefined) {
      this.setStatus(411);
      return 'Time Trail Mode not enabled';
    }

    if (!mode.ready()) {
      this.setStatus(411);
      return 'Time Trail Race not in PLAYER_REGISTERED state';
    }

    this.setStatus(204);
    return '';
  }

  @Security('local', [SecurityGroup.ADMIN, SecurityGroup.BAC, SecurityGroup.BOARD])
  @Post('start')
  @Response<string>(411, 'Time Trail Race not enabled')
  @Response<string>(411, 'Time Trail Race not in PLAYER_READY state')
  public raceStart() {
    const mode = this.modeManager.getMode(TimeTrailRaceMode) as TimeTrailRaceMode | undefined;
    if (mode === undefined) {
      this.setStatus(411);
      return 'Time Trail Mode not enabled';
    }

    if (!mode.start()) {
      this.setStatus(411);
      return 'Time Trail Race not in PLAYER_READY state';
    }

    this.setStatus(204);
    return '';
  }

  @Security('local', [SecurityGroup.ADMIN, SecurityGroup.BAC, SecurityGroup.BOARD])
  @Post('finish')
  @Response<string>(411, 'Time Trail Race not enabled')
  @Response<string>(411, 'Time Trail Race not in STARTED state')
  public raceFinish() {
    const mode = this.modeManager.getMode(TimeTrailRaceMode) as TimeTrailRaceMode | undefined;
    if (mode === undefined) {
      this.setStatus(411);
      return 'Time Trail Mode not enabled';
    }

    if (!mode.finish()) {
      this.setStatus(411);
      return 'Time Trail Race not in STARTED state';
    }

    this.setStatus(204);
    return '';
  }

  @Security('local', [SecurityGroup.ADMIN, SecurityGroup.BAC, SecurityGroup.BOARD])
  @Post('reveal-score')
  @Response<string>(411, 'Time Trail Race not enabled')
  @Response<string>(411, 'Time Trail Race not in FINISHED state')
  public raceRevealScore() {
    const mode = this.modeManager.getMode(TimeTrailRaceMode) as TimeTrailRaceMode | undefined;
    if (mode === undefined) {
      this.setStatus(411);
      return 'Time Trail Mode not enabled';
    }

    if (!mode.revealScore()) {
      this.setStatus(411);
      return 'Time Trail Race not in FINISHED state';
    }

    this.setStatus(204);
    return '';
  }
}
