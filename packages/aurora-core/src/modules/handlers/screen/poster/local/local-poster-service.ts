import { FileStorage } from '../../../../files/storage/file-storage';
import { DiskStorage } from '../../../../files/storage';
import LocalPoster from './local-poster';
import { Repository } from 'typeorm';
import dataSource from '../../../../../database';
import { HttpApiException } from '@gewis/aurora-core-util';
import { HttpStatusCode } from 'axios';
import { BaseFile, File } from '../../../../files/entities';

export interface LocalPosterResponse {
  id: number;
  createdAt: string;
  updatedAt: string;
  file?: {
    location: string;
    name: string;
  };
  uri?: string;
}

export interface LocalPosterRequest {
  file?: {
    name: string;
    data: Buffer;
  };
  uri?: string;
}

export default class LocalPosterService {
  private storage: FileStorage;

  private repo: Repository<LocalPoster>;

  private fileRepo: Repository<File>;

  constructor() {
    this.storage = new DiskStorage('local-posters');
    this.repo = dataSource.getRepository(LocalPoster);
    this.fileRepo = dataSource.getRepository(File);
  }

  public toResponse(poster: LocalPoster): LocalPosterResponse {
    let file: LocalPosterResponse['file'];
    if (poster.file) {
      const location = this.storage.getPublicFileUri(poster.file);
      if (location) {
        file = {
          location,
          name: poster.file.originalName,
        };
      }
    }

    return {
      id: poster.id,
      createdAt: poster.createdAt.toISOString(),
      updatedAt: poster.updatedAt.toISOString(),
      file,
      uri: poster.uri ?? undefined,
    };
  }

  public async getAllLocalPosters(): Promise<LocalPoster[]> {
    return this.repo.find();
  }

  public async getSingleLocalPoster(id: number): Promise<LocalPoster> {
    const poster = await this.repo.findOne({ where: { id } });
    if (poster == null) {
      throw new HttpApiException(HttpStatusCode.NotFound, `Poster with ID "${id}" not found.`);
    }
    return poster;
  }

  public async createLocalPoster(poster: LocalPosterRequest): Promise<LocalPoster> {
    let file: File | undefined;
    if (poster.file) {
      const fileParams = await this.storage.saveFile(poster.file.name, poster.file.data);
      file = await this.fileRepo.save(fileParams);
    }

    return this.repo.save({ file, uri: poster.uri });
  }

  public async deleteLocalPoster(id: number): Promise<void> {
    const poster = await this.getSingleLocalPoster(id);
    if (poster.file) {
      await this.fileRepo.delete(poster.file.id);
      await this.storage.deleteFile(poster.file);
    }
    await this.repo.remove(poster);
  }
}
