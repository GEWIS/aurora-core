import { Controller } from '@tsoa/runtime';
import {
  Body, Delete, Post, Route, Tags,
} from 'tsoa';
import { ArtificialBeatGenerator, StartArtificialBeatGeneratorParams } from './artificial-beat-generator';

@Tags('Artificial Beat Generator')
@Route('beat-generator')
export class ArtificialBeatController extends Controller {
  @Post('')
  public startArtificialBeatGenerator(@Body() params: StartArtificialBeatGeneratorParams) {
    const generator = ArtificialBeatGenerator.getInstance();
    generator.start(params.bpm);
  }

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
