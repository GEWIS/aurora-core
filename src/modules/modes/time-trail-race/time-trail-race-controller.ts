import { Controller } from '@tsoa/runtime';
import { Body, Get, Post, Response, Route, Security, Tags } from 'tsoa';
import TimeTrailRaceMode from './time-trail-race-mode';
import ModeManager from '../mode-manager';
import { SecurityGroup } from '../../../helpers/security';
import { RegisterPlayerParams } from './time-trail-race-entities';
import ModeDisabledError from '../mode-disabled-error';
import { InvalidStateError } from './time-trail-race-invalid-state-error';

@Route('modes/time-trail-race')
@Tags('Modes')
export class TimeTrailRaceController extends Controller {
  private modeManager: ModeManager;

  constructor() {
    super();
    this.modeManager = ModeManager.getInstance();
  }

  @Security('local', [
    SecurityGroup.ADMIN,
    SecurityGroup.BAC,
    SecurityGroup.BOARD,
    SecurityGroup.SCREEN_SUBSCRIBER,
  ])
  @Get('')
  @Response<string>(404, 'Time Trail Race not enabled')
  public getRaceState() {
    const mode = this.modeManager.getMode(TimeTrailRaceMode) as TimeTrailRaceMode | undefined;
    if (mode === undefined) {
      throw new ModeDisabledError('Time Trail Race not enabled');
    }

    return {
      state: mode.state,
      sessionName: mode.sessionName,
      scoreboard: mode.scoreboard,
    };
  }

  @Security('local', [SecurityGroup.ADMIN, SecurityGroup.BAC, SecurityGroup.BOARD])
  @Post('register-player')
  @Response<ModeDisabledError>(404, 'Time Trail Race not enabled')
  @Response<InvalidStateError>(428, 'Time Trail Race not in INITIALIZED or SCOREBOARD state')
  public raceRegisterPlayer(@Body() params: RegisterPlayerParams) {
    const mode = this.modeManager.getMode(TimeTrailRaceMode) as TimeTrailRaceMode | undefined;
    if (mode === undefined) {
      throw new ModeDisabledError('Time Trail Race not enabled');
    }

    return mode.registerPlayer(params);
  }

  @Security('local', [SecurityGroup.ADMIN, SecurityGroup.BAC, SecurityGroup.BOARD])
  @Post('ready')
  @Response<ModeDisabledError>(404, 'Time Trail Race not enabled')
  @Response<InvalidStateError>(428, 'Time Trail Race not in PLAYER_REGISTERED state')
  public raceReady() {
    const mode = this.modeManager.getMode(TimeTrailRaceMode) as TimeTrailRaceMode | undefined;
    if (mode === undefined) {
      throw new ModeDisabledError('Time Trail Race not enabled');
    }

    return mode.ready();
  }

  @Security('local', [SecurityGroup.ADMIN, SecurityGroup.BAC, SecurityGroup.BOARD])
  @Post('start')
  @Response<ModeDisabledError>(404, 'Time Trail Race not enabled')
  @Response<InvalidStateError>(428, 'Time Trail Race not in PLAYER_READY state')
  public raceStart() {
    const mode = this.modeManager.getMode(TimeTrailRaceMode) as TimeTrailRaceMode | undefined;
    if (mode === undefined) {
      throw new ModeDisabledError('Time Trail Race not enabled');
    }

    return mode.start();
  }

  @Security('local', [SecurityGroup.ADMIN, SecurityGroup.BAC, SecurityGroup.BOARD])
  @Post('finish')
  @Response<ModeDisabledError>(404, 'Time Trail Race not enabled')
  @Response<InvalidStateError>(428, 'Time Trail Race not in STARTED state')
  public raceFinish() {
    const mode = this.modeManager.getMode(TimeTrailRaceMode) as TimeTrailRaceMode | undefined;
    if (mode === undefined) {
      throw new ModeDisabledError('Time Trail Race not enabled');
    }

    return mode.finish();
  }

  @Security('local', [SecurityGroup.ADMIN, SecurityGroup.BAC, SecurityGroup.BOARD])
  @Post('reveal-score')
  @Response<ModeDisabledError>(404, 'Time Trail Race not enabled')
  @Response<InvalidStateError>(428, 'Time Trail Race not in FINISHED state')
  public raceRevealScore() {
    const mode = this.modeManager.getMode(TimeTrailRaceMode) as TimeTrailRaceMode | undefined;
    if (mode === undefined) {
      throw new ModeDisabledError('Time Trail Race not enabled');
    }

    return mode.revealScore();
  }
}
