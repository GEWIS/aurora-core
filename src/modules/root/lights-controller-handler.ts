import { singleton } from 'tsyringe';
import { Namespace } from 'socket.io';
import { LightsController } from './entities';
import BaseLightsHandler from '../handlers/base-lights-handler';
import LightsGroupPars from './entities/lights/lights-group-pars';
import LightsGroupMovingHeadRgbs from './entities/lights/lights-group-moving-head-rgbs';
import LightsGroupMovingHeadWheels from './entities/lights/lights-group-moving-head-wheels';

@singleton()
export default class LightsControllerHandler {
  private lightsControllers: Map<number, LightsController> = new Map();

  private lightsControllersValues: Map<number, number[]> = new Map();

  private lightsHandlers: BaseLightsHandler[] = [];

  protected websocket: Namespace;

  private previousTick = new Date();

  private constructNewValuesArray(): number[] {
    return new Array(512).fill(0);
  }

  constructor(socket: Namespace, lightControllers: LightsController[] = []) {
    this.websocket = socket;

    lightControllers.forEach((c) => {
      this.lightsControllersValues.set(c.id, this.constructNewValuesArray());
    });

    setInterval(this.tick.bind(this), 25);
  }

  private getOldValues(controller: LightsController): number[] {
    let result = this.lightsControllersValues.get(controller.id);
    if (result === undefined) {
      result = this.constructNewValuesArray();
      this.lightsControllersValues.set(controller.id, result);
      this.lightsControllers.set(controller.id, controller);
      console.log('ping!');
    }
    return result;
  }

  registerLightsHandlers(lightsHandlers: BaseLightsHandler[]) {
    this.lightsHandlers.push(...lightsHandlers);
  }

  registerLightsHandler(lightsHandler: BaseLightsHandler) {
    this.lightsHandlers.push(lightsHandler);
  }

  removeLightsHandler(lightsHandler: BaseLightsHandler) {
    this.lightsHandlers = this.lightsHandlers
      .filter((h) => h.identifier !== lightsHandler.identifier);
  }

  /**
   * Given a par in a light group, put the new DMX values in the correct spot in the packet
   * @param p
   * @param packet Array of 512 integers [0, 255]
   * @private
   */
  private setParValues(p: LightsGroupPars, packet: number[]) {
    const o = [...packet];
    o[p.getActualChannel(p.par.masterDimChannel) - 1] = p.par.channelValues.masterDimChannel;
    o[p.getActualChannel(p.par.strobeChannel) - 1] = p.par.channelValues.strobeChannel;
    o[p.getActualChannel(p.par.color.redChannel) - 1] = p.par.channelValues.redChannel;
    o[p.getActualChannel(p.par.color.greenChannel) - 1] = p.par.channelValues.greenChannel;
    o[p.getActualChannel(p.par.color.blueChannel) - 1] = p.par.channelValues.blueChannel;
    if (p.par.color.coldWhiteChannel != null) {
      o[p.getActualChannel(p.par.color.coldWhiteChannel) - 1] = p.par
        .channelValues.coldWhiteChannel || 0;
    }
    if (p.par.color.warmWhiteChannel != null) {
      o[p.getActualChannel(p.par.color.warmWhiteChannel) - 1] = p.par
        .channelValues.warmWhiteChannel || 0;
    }
    if (p.par.color.amberChannel != null) {
      o[p.getActualChannel(p.par.color.amberChannel) - 1] = p.par
        .channelValues.coldWhiteChannel || 0;
    }
    if (p.par.color.uvChannel != null) {
      o[p.getActualChannel(p.par.color.uvChannel) - 1] = p.par
        .channelValues.coldWhiteChannel || 0;
    }
    return o;
  }

  /**
   * Given a moving head (RGB) in a light group,
   * put the new DMX values in the correct spot in the packet
   * @param p
   * @param packet Array of 512 integers [0, 255]
   * @private
   */
  private setMovingHeadRgbValues(p: LightsGroupMovingHeadRgbs, packet: number[]) {
    const o = [...packet];
    o[p.getActualChannel(p.movingHead.masterDimChannel) - 1] = p.movingHead
      .channelValues.masterDimChannel;
    o[p.getActualChannel(p.movingHead.strobeChannel) - 1] = p.movingHead
      .channelValues.strobeChannel;
    o[p.getActualChannel(p.movingHead.color.redChannel) - 1] = p.movingHead
      .channelValues.redChannel;
    o[p.getActualChannel(p.movingHead.color.greenChannel) - 1] = p.movingHead
      .channelValues.greenChannel;
    o[p.getActualChannel(p.movingHead.color.blueChannel) - 1] = p.movingHead
      .channelValues.blueChannel;
    if (p.movingHead.color.coldWhiteChannel != null) {
      o[p.getActualChannel(p.movingHead.color.coldWhiteChannel) - 1] = p.movingHead
        .channelValues.coldWhiteChannel || 0;
    }
    if (p.movingHead.color.warmWhiteChannel != null) {
      o[p.getActualChannel(p.movingHead.color.warmWhiteChannel) - 1] = p.movingHead
        .channelValues.warmWhiteChannel || 0;
    }
    if (p.movingHead.color.amberChannel != null) {
      o[p.getActualChannel(p.movingHead.color.amberChannel) - 1] = p.movingHead
        .channelValues.coldWhiteChannel || 0;
    }
    if (p.movingHead.color.uvChannel != null) {
      o[p.getActualChannel(p.movingHead.color.uvChannel) - 1] = p.movingHead
        .channelValues.coldWhiteChannel || 0;
    }
    o[p.getActualChannel(p.movingHead.movement.panChannel) - 1] = p.movingHead
      .channelValues.panChannel;
    if (p.movingHead.movement.finePanChannel != null) {
      o[p.getActualChannel(p.movingHead.movement.finePanChannel) - 1] = p.movingHead
        .channelValues.finePanChannel || 0;
    }
    o[p.getActualChannel(p.movingHead.movement.tiltChannel) - 1] = p.movingHead
      .channelValues.tiltChannel;
    if (p.movingHead.movement.fineTiltChannel != null) {
      o[p.getActualChannel(p.movingHead.movement.fineTiltChannel) - 1] = p.movingHead
        .channelValues.fineTiltChannel || 0;
    }
    if (p.movingHead.movement.movingSpeedChannel != null) {
      o[p.getActualChannel(p.movingHead.movement.movingSpeedChannel) - 1] = p.movingHead
        .channelValues.movingSpeedChannel || 0;
    }
    return o;
  }

  /**
   * Given a moving head (Wheel) in a light group,
   * put the new DMX values in the correct spot in the packet
   * @param p
   * @param packet Array of 512 integers [0, 255]
   * @private
   */
  private setMovingHeadWheelValues(p: LightsGroupMovingHeadWheels, packet: number[]) {
    const o = [...packet];
    o[p.getActualChannel(p.movingHead.masterDimChannel) - 1] = p.movingHead
      .channelValues.masterDimChannel;
    o[p.getActualChannel(p.movingHead.strobeChannel) - 1] = p.movingHead
      .channelValues.masterDimChannel;
    o[p.getActualChannel(p.movingHead.movement.panChannel) - 1] = p.movingHead
      .channelValues.panChannel;
    o[p.getActualChannel(p.movingHead.colorWheelChannel) - 1] = p.movingHead
      .channelValues.colorWheelChannel;
    o[p.getActualChannel(p.movingHead.goboWheelChannel) - 1] = p.movingHead
      .channelValues.goboWheelChannel;
    if (p.movingHead.goboRotateChannel != null) {
      o[p.getActualChannel(p.movingHead.goboRotateChannel) - 1] = p.movingHead
        .channelValues.goboRotateChannel || 0;
    }
    if (p.movingHead.movement.finePanChannel != null) {
      o[p.getActualChannel(p.movingHead.movement.finePanChannel) - 1] = p.movingHead
        .channelValues.finePanChannel || 0;
    }
    o[p.getActualChannel(p.movingHead.movement.tiltChannel) - 1] = p.movingHead
      .channelValues.tiltChannel;
    if (p.movingHead.movement.fineTiltChannel != null) {
      o[p.getActualChannel(p.movingHead.movement.fineTiltChannel) - 1] = p.movingHead
        .channelValues.fineTiltChannel || 0;
    }
    if (p.movingHead.movement.movingSpeedChannel != null) {
      o[p.getActualChannel(p.movingHead.movement.movingSpeedChannel) - 1] = p.movingHead
        .channelValues.movingSpeedChannel || 0;
    }
    return o;
  }

  /**
   *
   * @private
   */
  private sendDMXValuesToController() {
    // TODO: Send each packet to the correct controller
    this.lightsControllersValues.forEach((packet, id) => {
      this.websocket.emit('dmx_packet', packet);
    });
  }

  private hasUpdated(valuesUpdatedAt?: Date) {
    if (valuesUpdatedAt === undefined) return true;
    return valuesUpdatedAt > this.previousTick;
  }

  /**
   * Recalculate the DMX channel values of all lights and
   * send them to their respective DMX controllers
   * @private
   */
  private tick() {
    const lightGroups = this.lightsHandlers.map((h) => h.tick());
    // console.log(this.previousTick, lightGroups.flat()[0].pars[0].par.valuesUpdatedAt);
    lightGroups.flat().forEach((g) => {
      let oldValues = this.getOldValues(g.controller);

      g.pars
        .filter((p) => this.hasUpdated(p.par.valuesUpdatedAt))
        .forEach((p) => {
          oldValues = this.setParValues(p, oldValues);
        });

      g.movingHeadRgbs
        .filter((p) => this.hasUpdated(p.movingHead.valuesUpdatedAt))
        .forEach((p) => {
          oldValues = this.setMovingHeadRgbValues(p, oldValues);
        });

      g.movingHeadWheels
        .filter((p) => this.hasUpdated(p.movingHead.valuesUpdatedAt))
        .forEach((p) => {
          oldValues = this.setMovingHeadWheelValues(p, oldValues);
        });

      this.lightsControllersValues.set(g.controller.id, oldValues);
    });
    this.previousTick = new Date();
    this.sendDMXValuesToController();
  }
}