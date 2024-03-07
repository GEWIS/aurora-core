import { Controller } from '@tsoa/runtime';
import { Body, Post, Route, Security, Tags } from 'tsoa';
import SetEffectsHandler from './set-effects-handler';
import HandlerManager from '../../root/handler-manager';
import { LightsGroup } from '../../lights/entities';
import { SecurityGroup } from '../../../helpers/security';
import { LightsEffectsColorCreateParams } from '../../lights/effects/color';
import { LightsEffectsMovementCreateParams } from '../../lights/effects/movement';

@Route('handler/lights/set-effects')
@Tags('Handlers')
export class SetEffectsController extends Controller {
  /**
   * Given a list of color effects to create, add the given effects to the lightsgroup with the
   * given ID. Remove all color effects if an empty array is given
   * @param id
   * @param effects
   */
  @Security('local', [
    SecurityGroup.ADMIN,
    SecurityGroup.AVICO,
    SecurityGroup.BAC,
    SecurityGroup.BOARD
  ])
  @Post('{id}/color')
  public async applyLightsEffectColor(
    id: number,
    @Body() effects: LightsEffectsColorCreateParams[]
  ) {
    const handler: SetEffectsHandler | undefined = HandlerManager.getInstance()
      .getHandlers(LightsGroup)
      .find((h) => h.constructor.name === SetEffectsHandler.name) as SetEffectsHandler | undefined;
    if (!handler) throw new Error('SetEffectsHandler not found');

    const lightsGroup = handler.entities.find((e) => e.id === id);

    if (lightsGroup === undefined) {
      this.setStatus(404);
      return { message: 'LightsGroup not found in SetEffectsHandler' };
    }

    handler.parseAndSetColorEffects(id, effects);

    return { message: 'success' };
  }

  /**
   * Given a list of movement effects to create, add the given effects to the lightsgroup with the
   * given ID. Remove all movement effects if an empty array is given
   * @param id
   * @param effects
   */
  @Security('local', [
    SecurityGroup.ADMIN,
    SecurityGroup.AVICO,
    SecurityGroup.BAC,
    SecurityGroup.BOARD
  ])
  @Post('{id}/movement')
  public async applyLightsEffectMovement(
    id: number,
    @Body() effects: LightsEffectsMovementCreateParams[]
  ) {
    const handler: SetEffectsHandler | undefined = HandlerManager.getInstance()
      .getHandlers(LightsGroup)
      .find((h) => h.constructor.name === SetEffectsHandler.name) as SetEffectsHandler | undefined;
    if (!handler) throw new Error('SetEffectsHandler not found');

    const lightsGroup = handler.entities.find((e) => e.id === id);

    if (lightsGroup === undefined) {
      this.setStatus(404);
      return { message: 'LightsGroup not found in SetEffectsHandler' };
    }

    handler.parseAndSetMovementEffects(id, effects);

    return { message: 'success' };
  }
}
