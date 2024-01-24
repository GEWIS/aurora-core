import { Controller } from '@tsoa/runtime';
import {
  Body, Delete, Post, Route, Security, Tags,
} from 'tsoa';
import { ArtificialBeatGenerator, StartArtificialBeatGeneratorParams } from './artificial-beat-generator';
import { SecurityGroup } from '../../helpers/security';

@Tags('Artificial Beat Generator')
@Route('beat-generator')
export class ArtificialBeatController extends Controller {
  @Security('local', [SecurityGroup.ADMIN, SecurityGroup.AVICO, SecurityGroup.BAC, SecurityGroup.BOARD])
  @Post('')
  public startArtificialBeatGenerator(@Body() params: StartArtificialBeatGeneratorParams) {
    const generator = ArtificialBeatGenerator.getInstance();
    generator.start(params.bpm);
  }

  @Security('local', [SecurityGroup.ADMIN, SecurityGroup.AVICO, SecurityGroup.BAC, SecurityGroup.BOARD])
  @Delete('')
  public stopArtificialBeatGenerator() {
    const generator = ArtificialBeatGenerator.getInstance();
    if (!generator.active) {
      this.setStatus(404);
      return;
    }
    generator.stop();
  }
}
