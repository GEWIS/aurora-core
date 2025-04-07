import { Controller } from '@tsoa/runtime';
import { Body, Delete, Get, Post, Request, Route, Tags } from 'tsoa';
import { Request as ExpressRequest } from 'express';
import {
  ArtificialBeatGenerator,
  ArtificialBeatGeneratorParams,
} from './artificial-beat-generator';
import { SecurityNames } from '../../helpers/security';
import logger from '../../logger';
import { securityGroups } from '../../helpers/security-groups';
import { Security } from '../auth';

@Tags('Artificial Beat Generator')
@Route('beat-generator')
export class ArtificialBeatController extends Controller {
  @Security(SecurityNames.LOCAL, securityGroups.beats.base)
  @Security(SecurityNames.INTEGRATION, ['getArtificialBeatGenerator'])
  @Get('')
  public getArtificialBeatGenerator(): ArtificialBeatGeneratorParams | null {
    const generator = ArtificialBeatGenerator.getInstance();
    if (!generator.active || !generator.bpm) return null;
    return {
      bpm: generator.bpm,
    };
  }

  @Security(SecurityNames.LOCAL, securityGroups.beats.base)
  @Security(SecurityNames.INTEGRATION, ['startArtificialBeatGenerator'])
  @Post('')
  public startArtificialBeatGenerator(
    @Request() req: ExpressRequest,
    @Body() params: ArtificialBeatGeneratorParams,
  ) {
    logger.audit(req.user, `Set Artificial Beat Generator BPM to "${params.bpm}".`);

    const generator = ArtificialBeatGenerator.getInstance();
    generator.start(params.bpm);
  }

  @Security(SecurityNames.LOCAL, securityGroups.beats.base)
  @Security(SecurityNames.INTEGRATION, ['stopArtificialBeatGenerator'])
  @Delete('')
  public stopArtificialBeatGenerator(@Request() req: ExpressRequest) {
    logger.audit(req.user, 'Stop Artificial Beat Generator.');

    const generator = ArtificialBeatGenerator.getInstance();
    if (!generator.active) {
      this.setStatus(404);
      return;
    }
    generator.stop();
  }
}
