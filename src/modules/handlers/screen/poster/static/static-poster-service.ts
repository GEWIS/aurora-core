import { FileStorage } from '../../../../files/storage/file-storage';
import { DiskStorage } from '../../../../files/storage';
import StaticPoster from './static-poster';
import { Repository } from 'typeorm';
import dataSource from '../../../../../database';
import { HttpApiException } from '../../../../../helpers/custom-error';
import { HttpStatusCode } from 'axios';
import { File } from '../../../../files/entities';
import FileResponse from '../../../../files/entities/file-response';

export interface StaticPosterResponse {
  id: number;
  createdAt: string;
  updatedAt: string;
  file?: FileResponse;
  uri?: string;
}

export interface StaticPosterRequest {
  file?: {
    name: string;
    data: Buffer;
  };
  uri?: string;
}

export default class StaticPosterService {
  private storage: FileStorage;

  private repo: Repository<StaticPoster>;

  private fileRepo: Repository<File>;

  constructor() {
    this.storage = new DiskStorage('local-posters');
    this.repo = dataSource.getRepository(StaticPoster);
    this.fileRepo = dataSource.getRepository(File);
  }

  public toResponse(poster: StaticPoster): StaticPosterResponse {
    let file: StaticPosterResponse['file'];
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

  public async getAllStaticPosters(): Promise<StaticPoster[]> {
    return this.repo.find();
  }

  public async getSingleStaticPoster(id: number): Promise<StaticPoster> {
    const poster = await this.repo.findOne({ where: { id } });
    if (poster == null) {
      throw new HttpApiException(HttpStatusCode.NotFound, `Poster with ID "${id}" not found.`);
    }
    return poster;
  }

  public async createStaticPoster(poster: StaticPosterRequest): Promise<StaticPoster> {
    let file: File | undefined;
    if (poster.file) {
      const fileParams = await this.storage.saveFile(poster.file.name, poster.file.data);
      file = await this.fileRepo.save(fileParams);
    }

    return this.repo.save({ file, uri: poster.uri });
  }

  public async deleteStaticPoster(id: number): Promise<void> {
    const poster = await this.getSingleStaticPoster(id);
    if (poster.file) {
      await this.fileRepo.delete(poster.file.id);
      await this.storage.deleteFile(poster.file);
    }
    await this.repo.remove(poster);
  }
}
