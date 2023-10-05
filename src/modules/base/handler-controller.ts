import { Controller } from '@tsoa/runtime';
import { injectable } from 'tsyringe';
import { Get, Route } from 'tsoa';
import Handlers from './handlers';
import { Audio } from './entities';

@injectable()
@Route('handler')
export class HandlerController extends Controller {
  constructor(private handlers: Handlers) {
    super();
  }

  @Get('audio')
  public async getAudioHandlers() {
    return this.handlers.getHandlers(Audio).map((h) => ({
      name: h.constructor.name,
      id: h.identifier,
    }));
  }
}
