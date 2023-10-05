import { Repository } from 'typeorm';
import { Audio } from './entities';
import dataSource from '../../database';

export interface AudioResponse extends Pick<Audio, 'id' | 'createdAt' | 'updatedAt' | 'name'> {}

export interface AudioCreateParams extends Pick<Audio, 'name'> {}

export default class RootAudioService {
  private repository: Repository<Audio>;

  constructor() {
    this.repository = dataSource.getRepository(Audio);
  }

  private toAudioResponse(audio: Audio): AudioResponse {
    return {
      id: audio.id,
      createdAt: audio.createdAt,
      updatedAt: audio.updatedAt,
      name: audio.name,
    };
  }

  public async getAllAudios(): Promise<AudioResponse[]> {
    const audios = await this.repository.find();
    return audios.map((a) => ({
      id: a.id,
      createdAt: a.createdAt,
      updatedAt: a.updatedAt,
      name: a.name,
    }));
  }

  public async getSingleAudio(id: number): Promise<Audio | null> {
    return this.repository.findOne({ where: { id } });
  }

  public async createAudio(params: AudioCreateParams): Promise<AudioResponse> {
    const audio = await this.repository.save({
      name: params.name,
    });
    return {
      id: audio.id,
      createdAt: audio.createdAt,
      updatedAt: audio.updatedAt,
      name: audio.name,
    };
  }
}
