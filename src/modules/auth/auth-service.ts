import { Repository } from 'typeorm';
import crypto from 'crypto';
import { ApiKey } from './entities';
import dataSource from '../../database';
import { Audio, LightsController, Screen } from '../root/entities';

export interface GenerateApiKeyParams {
  audio?: Audio | null;
  screen?: Screen | null;
  lightsController?: LightsController | null;
}

export default class AuthService {
  private apiKeyRepository: Repository<ApiKey>;

  constructor() {
    this.apiKeyRepository = dataSource.getRepository(ApiKey);
  }

  private generateKey(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  public async createApiKey({ audio, screen, lightsController }: GenerateApiKeyParams) {
    return this.apiKeyRepository.save({
      key: this.generateKey(),
      audio,
      screen,
      lightsController
    });
  }

  public async getAudioApiKey(audio: Audio) {
    return this.apiKeyRepository.findOne({ where: { audio: { id: audio.id } } });
  }

  public async getScreenApiKey(screen: Screen) {
    return this.apiKeyRepository.findOne({ where: { screen: { id: screen.id } } });
  }

  public async getLightsControllerApiKey(lightsController: LightsController) {
    return this.apiKeyRepository.findOne({
      where: { lightsController: { id: lightsController.id } }
    });
  }
}
