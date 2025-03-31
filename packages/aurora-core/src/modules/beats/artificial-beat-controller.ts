import { Controller } from '@tsoa/runtime';
import { Body, Delete, Get, Post, Request, Route, Security, Tags } from 'tsoa';
import { Request as ExpressRequest } from 'express';
import { ArtificialBeatGenerator, ArtificialBeatGeneratorParams } from './artificial-beat-generator';
import { SecurityNames } from '@gewis/aurora-core-util';
import logger from '@gewis/aurora-core-logger';
import { securityGroups } from '@gewis/aurora-core-util';

@Tags('Artificial Beat Generator')
@Route('beat-generator')
export class ArtificialBeatController extends Controller {
  @Security(SecurityNames.LOCAL, securityGroups.beats.base)
  @Get('')
  public getArtificalBeatGenerator(): ArtificialBeatGeneratorParams | null {
    const generator = ArtificialBeatGenerator.getInstance();
    if (!generator.active || !generator.bpm) return null;
    return {
      bpm: generator.bpm,
    };
  }

  @Security(SecurityNames.LOCAL, securityGroups.beats.base)
  @Post('')
  public startArtificialBeatGenerator(@Request() req: ExpressRequest, @Body() params: ArtificialBeatGeneratorParams) {
    logger.audit(req.user, `Set Artificial Beat Generator BPM to "${params.bpm}".`);

    const generator = ArtificialBeatGenerator.getInstance();
    generator.start(params.bpm);
  }

  @Security(SecurityNames.LOCAL, securityGroups.beats.base)
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
