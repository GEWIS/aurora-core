import { Namespace } from 'socket.io';
import { LightsController } from './entities';
import BaseLightsHandler from '../handlers/base-lights-handler';
import { MusicEmitter } from '../events';
import {
  LightsGroupPars,
  LightsGroupMovingHeadRgbs,
  LightsGroupMovingHeadWheels,
  LightsGroup,
} from '../lights/entities';
import HandlerManager from './handler-manager';
import { TrackPropertiesEvent } from '../events/music-emitter-events';

export default class LightsControllerManager {
  private lightsControllers: Map<number, LightsController> = new Map();

  private lightsControllersValues: Map<number, number[]> = new Map();

  private previousTick = new Date();

  private constructNewValuesArray(): number[] {
    return new Array(512).fill(0);
  }

  constructor(
    protected websocket: Namespace,
    protected handlerManager: HandlerManager,
    musicEmitter: MusicEmitter,
    lightControllers: LightsController[] = [],
  ) {
    lightControllers.forEach((c) => {
      this.lightsControllersValues.set(c.id, this.constructNewValuesArray());
    });

    musicEmitter.on('features', this.setTrackFeatures.bind(this));

    // Tick rate (currently 40Hz)
    setInterval(this.tick.bind(this), 250);
  }

  private getOldValues(controller: LightsController): number[] {
    let result = this.lightsControllersValues.get(controller.id);
    if (result === undefined) {
      result = this.constructNewValuesArray();
      this.lightsControllersValues.set(controller.id, result);
      this.lightsControllers.set(controller.id, controller);
    }
    return result;
  }

  private get lightsHandlers() {
    return this.handlerManager.getHandlers(LightsGroup) as BaseLightsHandler[];
  }

  private setTrackFeatures(event: TrackPropertiesEvent) {
    this.lightsHandlers.forEach((h) => h.setFeatures(event));
  }

  /**
   * Given a fixture, put the new DMX values in the correct spot in the packet
   * @param p
   * @param packet Array of 512 integers [0, 255]
   * @private
   */
  private setDmxValues(
    p: LightsGroupPars | LightsGroupMovingHeadRgbs | LightsGroupMovingHeadWheels,
    packet: number[],
  ) {
    const dmxValues = p.fixture.toDmx();
    packet.splice(p.firstChannel - 1, dmxValues.length, ...dmxValues);
    return packet;
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

  /**
   * Compare the given date with the time of the previous tick
   * @param valuesUpdatedAt
   * @private
   */
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

    lightGroups.flat().forEach((g) => {
      let oldValues = this.getOldValues(g.controller);

      g.pars
        .filter((p) => this.hasUpdated(p.fixture.valuesUpdatedAt))
        .forEach((p) => {
          oldValues = this.setDmxValues(p, oldValues);
        });

      g.movingHeadRgbs
        .filter((p) => this.hasUpdated(p.fixture.valuesUpdatedAt))
        .forEach((p) => {
          oldValues = this.setDmxValues(p, oldValues);
        });

      g.movingHeadWheels
        .filter((p) => this.hasUpdated(p.fixture.valuesUpdatedAt))
        .forEach((p) => {
          oldValues = this.setDmxValues(p, oldValues);
        });

      this.lightsControllersValues.set(g.controller.id, oldValues);
    });
    this.previousTick = new Date();
    this.sendDMXValuesToController();
  }
}
