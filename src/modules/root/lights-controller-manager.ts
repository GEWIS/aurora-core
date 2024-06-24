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
import { SocketioNamespaces } from '../../socketio-namespaces';

const DMX_VALUES_LENGTH = 512;

export default class LightsControllerManager {
  /**
   * Mapping of lights controller IDs to their corresponding objects.
   * Used to always use the same (in-memory) lights controller object instance when working with it,
   * as light groups also contain an instance (and a different one in memory for each group)
   * @private
   */
  private lightsControllers: Map<number, LightsController> = new Map();

  /**
   * Mapping from the lights controller ID to its previously sent DMX values
   * @private
   */
  private lightsControllersValues: Map<number, number[]> = new Map();

  /**
   * Timestamp of the previous tick.
   * used to verify whether a light has changed its state and thus a new DMX packet should be created
   * @private
   */
  private previousTick = new Date();

  private constructNewValuesArray(): number[] {
    return new Array(DMX_VALUES_LENGTH).fill(0);
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
    setInterval(this.tick.bind(this), Number(process.env.LIGHTS_TICK_INTERVAL) ?? 29);
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
   * Given a fixture, the old DMX packet and the new DMX packet,
   * copy the old values to the new packet
   * @param p
   * @param oldValues
   * @param newValues
   * @private
   */
  private reuseOldDmxValues(
    p: LightsGroupPars | LightsGroupMovingHeadRgbs | LightsGroupMovingHeadWheels,
    oldValues: number[],
    newValues: number[],
  ): number[] {
    const oldRelativePacket = oldValues.slice(p.firstChannel - 1, p.firstChannel + 15);
    newValues.splice(p.firstChannel - 1, 16, ...oldRelativePacket);
    return newValues;
  }

  /**
   * Given a fixture, put the new DMX values in the correct spot in the packet
   * @param p
   * @param packet Array of 512 integers [0, 255]
   * @private
   */
  private calculateNewDmxValues(
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
    this.lightsControllersValues.forEach((packet, id) => {
      const controller = this.lightsControllers.get(id);
      if (!controller) return;
      const socketId = controller.getSocketId(this.websocket.name as SocketioNamespaces);
      this.websocket.sockets.get(socketId || '')?.emit('dmx_packet', packet);
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

    const newControllerValues = new Map<number, number[]>();

    lightGroups.flat().forEach((g) => {
      const oldValues = this.getOldValues(g.controller);
      let newValues = newControllerValues.get(g.controller.id) ?? this.constructNewValuesArray();

      g.pars.forEach((p) => {
        if (this.hasUpdated(p.fixture.valuesUpdatedAt)) {
          newValues = this.calculateNewDmxValues(p, newValues);
        } else {
          newValues = this.reuseOldDmxValues(p, oldValues, newValues);
        }
      });

      g.movingHeadRgbs.forEach((p) => {
        if (this.hasUpdated(p.fixture.valuesUpdatedAt)) {
          newValues = this.calculateNewDmxValues(p, newValues);
        } else {
          newValues = this.reuseOldDmxValues(p, oldValues, newValues);
        }
      });

      g.movingHeadWheels.forEach((p) => {
        if (this.hasUpdated(p.fixture.valuesUpdatedAt)) {
          newValues = this.calculateNewDmxValues(p, newValues);
        } else {
          newValues = this.reuseOldDmxValues(p, oldValues, newValues);
        }
      });

      newControllerValues.set(g.controller.id, newValues);
    });

    // If a controller has no active light groups, send only zeroes
    Array.from(this.lightsControllers.keys()).forEach((controllerId) => {
      if (!newControllerValues.has(controllerId)) {
        newControllerValues.set(controllerId, this.constructNewValuesArray());
      }
    });

    this.lightsControllersValues = newControllerValues;
    this.previousTick = new Date();
    this.sendDMXValuesToController();
  }
}
