import { Controller } from '@tsoa/runtime';
import { Body, Get, Post, Request, Response, Route, Security, Tags } from 'tsoa';
import { Request as ExpressRequest } from 'express';
import TimeTrailRaceMode from './time-trail-race-mode';
import ModeManager from '../mode-manager';
import { SecurityGroup } from '../../../helpers/security';
import { RegisterPlayerParams } from './time-trail-race-entities';
import ModeDisabledError from '../mode-disabled-error';
import { InvalidStateError } from './time-trail-race-invalid-state-error';
import logger from '../../../logger';

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
  public getRaceState() {
    const mode = this.modeManager.getMode(TimeTrailRaceMode) as TimeTrailRaceMode | undefined;
    if (mode === undefined) {
      return null;
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
  public raceRegisterPlayer(@Request() req: ExpressRequest, @Body() params: RegisterPlayerParams) {
    const mode = this.modeManager.getMode(TimeTrailRaceMode) as TimeTrailRaceMode | undefined;
    if (mode === undefined) {
      throw new ModeDisabledError('Time Trail Race not enabled');
    }

    logger.audit(
      req.user,
      `Register player "${params.name}" for Spoelbakkenrace "${mode.sessionName}".`,
    );

    return mode.registerPlayer(params);
  }

  @Security('local', [SecurityGroup.ADMIN, SecurityGroup.BAC, SecurityGroup.BOARD])
  @Post('ready')
  @Response<ModeDisabledError>(404, 'Time Trail Race not enabled')
  @Response<InvalidStateError>(428, 'Time Trail Race not in PLAYER_REGISTERED state')
  public raceReady(@Request() req: ExpressRequest) {
    const mode = this.modeManager.getMode(TimeTrailRaceMode) as TimeTrailRaceMode | undefined;
    if (mode === undefined) {
      throw new ModeDisabledError('Time Trail Race not enabled');
    }

    logger.audit(
      req.user,
      `Ready player "${mode.playerParams.name}" for Spoelbakkenrace "${mode.sessionName}".`,
    );

    return mode.ready();
  }

  @Security('local', [SecurityGroup.ADMIN, SecurityGroup.BAC, SecurityGroup.BOARD])
  @Post('start')
  @Response<ModeDisabledError>(404, 'Time Trail Race not enabled')
  @Response<InvalidStateError>(428, 'Time Trail Race not in PLAYER_READY state')
  public raceStart(@Request() req: ExpressRequest) {
    const mode = this.modeManager.getMode(TimeTrailRaceMode) as TimeTrailRaceMode | undefined;
    if (mode === undefined) {
      throw new ModeDisabledError('Time Trail Race not enabled');
    }

    logger.audit(
      req.user,
      `Start player "${mode.playerParams.name}" for Spoelbakkenrace "${mode.sessionName}".`,
    );

    return mode.start();
  }

  @Security('local', [SecurityGroup.ADMIN, SecurityGroup.BAC, SecurityGroup.BOARD])
  @Post('finish')
  @Response<ModeDisabledError>(404, 'Time Trail Race not enabled')
  @Response<InvalidStateError>(428, 'Time Trail Race not in STARTED state')
  public raceFinish(@Request() req: ExpressRequest) {
    const mode = this.modeManager.getMode(TimeTrailRaceMode) as TimeTrailRaceMode | undefined;
    if (mode === undefined) {
      throw new ModeDisabledError('Time Trail Race not enabled');
    }

    logger.audit(
      req.user,
      `Finish player "${mode.playerParams.name}" for Spoelbakkenrace "${mode.sessionName}".`,
    );

    return mode.finish();
  }

  @Security('local', [SecurityGroup.ADMIN, SecurityGroup.BAC, SecurityGroup.BOARD])
  @Post('reveal-score')
  @Response<ModeDisabledError>(404, 'Time Trail Race not enabled')
  @Response<InvalidStateError>(428, 'Time Trail Race not in FINISHED state')
  public raceRevealScore(@Request() req: ExpressRequest) {
    const mode = this.modeManager.getMode(TimeTrailRaceMode) as TimeTrailRaceMode | undefined;
    if (mode === undefined) {
      throw new ModeDisabledError('Time Trail Race not enabled');
    }

    logger.audit(req.user, `Reveal score for Spoelbakkenrace "${mode.sessionName}".`);

    return mode.revealScore();
  }

  @Security('local', [SecurityGroup.ADMIN, SecurityGroup.BAC, SecurityGroup.BOARD])
  @Post('reset-player')
  @Response<ModeDisabledError>(404, 'Time Trail Race not enabled')
  public raceResetPlayer(@Request() req: ExpressRequest) {
    const mode = this.modeManager.getMode(TimeTrailRaceMode) as TimeTrailRaceMode | undefined;
    if (mode === undefined) {
      throw new ModeDisabledError('Time Trail Race not enabled');
    }

    logger.audit(req.user, `Reset player for Spoelbakkenrace "${mode.sessionName}".`);

    return mode.resetToStartState();
  }
}
