import { FileStorage } from '../../../../files/storage/file-storage';
import { Repository } from 'typeorm';
import { File } from '../../../../files/entities';
import LocalPoster from './local-poster';
import { DiskStorage } from '../../../../files/storage';
import dataSource from '../../../../../database';
import {
  MediaPosterParams,
  PhotoPosterParams,
  UpdatePosterParams,
  UrlPosterParams,
} from './local-poster-controller';

export interface LocalPosterResponse {}

export default class LocalPosterService {
  private storage: FileStorage;

  private repo: Repository<LocalPoster>;

  private fileRepo: Repository<File>;

  constructor() {
    this.storage = new DiskStorage('posters');
    this.repo = dataSource.getRepository(LocalPoster);
    this.fileRepo = dataSource.getRepository(File);
  }

  public toResponse(poster: LocalPoster): LocalPosterResponse {
    return {} as LocalPosterResponse;
  }

  public async getAllLocalPosters(): Promise<LocalPoster[]> {
    return [] as LocalPoster[];
  }

  public async getSingleLocalPoster(id: number): Promise<LocalPoster> {
    return {} as LocalPoster;
  }

  public async createMediaPoster(params: MediaPosterParams): Promise<LocalPoster> {
    return {} as LocalPoster;
  }

  public async attachMedia(id: number, file: { name: string; data: Buffer }): Promise<LocalPoster> {
    return {} as LocalPoster;
  }

  public async createUrlPoster(params: UrlPosterParams): Promise<LocalPoster> {
    return {} as LocalPoster;
  }

  public async createPhotoPoster(params: PhotoPosterParams): Promise<LocalPoster> {
    return {} as LocalPoster;
  }

  public async deleteLocalPoster(id: number): Promise<void> {}

  public async updateLocalPoster(id: number, params: UpdatePosterParams): Promise<LocalPoster> {
    return {} as LocalPoster;
  }
}
