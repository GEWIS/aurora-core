import { BeatGenerator } from './beat-generator';
import { MusicEmitter } from '../events';
import BeatPropagator from './beat-propagator';
import { BeatEvent } from '../events/music-emitter-events';
import logger from '../../logger';

/**
 * External interface class responsible for holding all beat generator instances and
 * transmitting the beats of the leading (highest-prio) generator.
 */
export default class BeatManager {
  private static instance: BeatManager;

  private musicEmitter: MusicEmitter;

  private readonly propagator: BeatPropagator;

  private generators: BeatGenerator[] = [];

  constructor() {
    this.propagator = new BeatPropagator(this.emitBeat.bind(this));
  }

  public static getInstance() {
    if (!BeatManager.instance) {
      BeatManager.instance = new BeatManager();
    }
    return BeatManager.instance;
  }

  /**
   * Register a new beat generator. Higher priority generators override the beats of
   * lower priority generators.
   * @param generator
   * @param priority
   */
  public add(generator: BeatGenerator, priority: number): void {
    generator.setPropagator(this.propagator);
    this.propagator.addPriority(generator, priority);
    this.generators.push(generator);
    generator.start();
  }

  /**
   * Deregister a beat generator.
   * @param id
   */
  public remove(id: string): void {
    const index = this.generators.findIndex((g) => g.getId() === id);
    if (index >= 0) {
      this.propagator.removePriority(this.generators[index]);
      this.generators.splice(index, 1);
    }
  }

  /**
   * Get a beat detector from storage if it exists.
   * @param id
   */
  public get(id: string): BeatGenerator | undefined {
    return this.generators.find((g) => g.getId() === id);
  }

  /**
   * Returns whether the manager has a beat generator with the given ID.
   * @param id
   */
  public has(id: string): boolean {
    return this.get(id) !== undefined;
  }

  public init(musicEmitter: MusicEmitter) {
    if (this.musicEmitter) {
      throw new Error('Beat Manager already initialized');
    }
    this.musicEmitter = musicEmitter;
  }

  public emitBeat(event: BeatEvent) {
    if (this.musicEmitter) {
      this.musicEmitter.emitAudio('beat', event);
    } else {
      logger.warn('BeatManager tries to emit beat, but class instance is not initialized!');
    }
  }
}
