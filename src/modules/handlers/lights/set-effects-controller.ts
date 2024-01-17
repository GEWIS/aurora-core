import { Controller } from '@tsoa/runtime';
import {
  Body, Post, Route, Tags,
} from 'tsoa';
import SetEffectsHandler from './set-effects-handler';
import HandlerManager from '../../root/handler-manager';
import { LightsGroup } from '../../lights/entities';
import { LightsEffectsCreateParams } from '../../lights/effects';

@Route('handler/lights/set-effects')
@Tags('Handlers')
export class SetEffectsController extends Controller {
  /**
   * Given a list of effects to create, add the given effects to the lightsgroup with the
   * given ID. Remove all effects if an empty array is given
   * @param id
   * @param effects
   */
  @Post('{id}')
  public async applyLightsEffect(id: number, @Body() effects: LightsEffectsCreateParams[]) {
    const handler: SetEffectsHandler | undefined = HandlerManager.getInstance()
      .getHandlers(LightsGroup)
      .find((h) => h.constructor.name === SetEffectsHandler.name) as SetEffectsHandler | undefined;
    if (!handler) throw new Error('SetEffectsHandler not found');

    const lightsGroup = handler.entities.find((e) => e.id === id);

    if (lightsGroup === undefined) {
      this.setStatus(404);
      return { message: 'LightsGroup not found in SetEffectsHandler' };
    }

    handler.parseAndSetEffects(id, effects);

    return { message: 'success' };
  }
}
