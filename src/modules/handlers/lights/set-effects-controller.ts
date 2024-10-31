import { Controller } from '@tsoa/runtime';
import { Body, Post, Request, Route, Security, Tags } from 'tsoa';
import { Request as ExpressRequest } from 'express';
import SetEffectsHandler from './set-effects-handler';
import HandlerManager from '../../root/handler-manager';
import { LightsGroup } from '../../lights/entities';
import { SecurityNames } from '../../../helpers/security';
import { LightsEffectsColorCreateParams } from '../../lights/effects/color';
import { LightsEffectsMovementCreateParams } from '../../lights/effects/movement';
import logger from '../../../logger';
import { securityGroups } from '../../../helpers/security-groups';

@Route('handler/lights/set-effects')
@Tags('Handlers')
export class SetEffectsController extends Controller {
  /**
   * Given a list of color effects to create, add the given effects to the lightsgroup with the
   * given ID. Remove all color effects if an empty array is given
   * @param id
   * @param req
   * @param effects
   */
  @Security(SecurityNames.LOCAL, securityGroups.effects.base)
  @Post('{id}/color')
  public async applyLightsEffectColor(
    id: number,
    @Request() req: ExpressRequest,
    @Body() effects: LightsEffectsColorCreateParams[],
  ) {
    const handler: SetEffectsHandler | undefined = HandlerManager.getInstance()
      .getHandlers(LightsGroup)
      .find((h) => h.constructor.name === SetEffectsHandler.name) as SetEffectsHandler | undefined;
    if (!handler) throw new Error('SetEffectsHandler not found');

    const lightsGroup = handler.entities.find((e) => e.id === id);

    const effectNames = effects.map((e) => `"${e.type}"`);
    logger.audit(
      req.user,
      `Apply color effects ${effectNames} to lights group "${lightsGroup?.name}" (id: ${id}).`,
    );

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
   * @param req
   * @param effects
   */
  @Security(SecurityNames.LOCAL, securityGroups.effects.base)
  @Post('{id}/movement')
  public async applyLightsEffectMovement(
    id: number,
    @Request() req: ExpressRequest,
    @Body() effects: LightsEffectsMovementCreateParams[],
  ) {
    const handler: SetEffectsHandler | undefined = HandlerManager.getInstance()
      .getHandlers(LightsGroup)
      .find((h) => h.constructor.name === SetEffectsHandler.name) as SetEffectsHandler | undefined;
    if (!handler) throw new Error('SetEffectsHandler not found');

    const lightsGroup = handler.entities.find((e) => e.id === id);

    const effectNames = effects.map((e) => `"${e.type}"`);
    logger.audit(
      req.user,
      `Apply movement effects ${effectNames} to lights group "${lightsGroup?.name}" (id: ${id}).`,
    );

    if (lightsGroup === undefined) {
      this.setStatus(404);
      return { message: 'LightsGroup not found in SetEffectsHandler' };
    }

    handler.parseAndSetMovementEffects(id, effects);

    return { message: 'success' };
  }
}
