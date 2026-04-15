import { FileStorage } from '../../../../files/storage/file-storage';
import { Repository } from 'typeorm';
import { File } from '../../../../files/entities';
import LocalPoster from './local-poster';
import { DiskStorage } from '../../../../files/storage';
import dataSource from '../../../../../database';

interface BasePosterParams {
  name: string;
  expirationDate?: Date;
  accentColor?: string;
  footerSize?: string;
  defaultTimeout?: number;
  borrelMode?: boolean;
}

export interface MediaPosterParams extends BasePosterParams {
  type: 'media';
}

export interface UrlPosterParams extends BasePosterParams {
  type: 'url';
  url: string;
}

export interface PhotoPosterParams extends BasePosterParams {
  type: 'photo';
  album: number;
}

export type CreatePosterParams = MediaPosterParams | UrlPosterParams | PhotoPosterParams;

export interface UpdatePosterParams {
  name?: string;
  expirationDate?: Date;
  accentColor?: string;
  footerSize?: string;
  defaultTimeout?: number;
  borrelMode?: boolean;
}

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

  /**
   * Converts a poster entity to the LocalPosterResponse format.
   * @param poster The poster to be converted.
   */
  public toResponse(poster: LocalPoster): LocalPosterResponse {
    return {} as LocalPosterResponse;
  }

  /**
   * Fetches all Local Posters from the database.
   */
  public async getAllLocalPosters(): Promise<LocalPoster[]> {
    return [] as LocalPoster[];
  }

  /**
   * Gets a specific Local Poster from the database.
   * @param id The id of the poster to fetch.
   */
  public async getSingleLocalPoster(id: number): Promise<LocalPoster> {
    return {} as LocalPoster;
  }

  /**
   * Creates a new Local Poster with the media type in the database.
   * This does not yet contain the actual image or video of the poster.
   * @param params Metadata of the poster as specified in the MediaPosterParams interface.
   */
  public async createMediaPoster(params: MediaPosterParams): Promise<LocalPoster> {
    return {} as LocalPoster;
  }

  /**
   * Adds the given image or video to the database entry for the specified poster.
   * @param id Id of the poster to add the media to.
   * @param filename Original filename of the media file.
   * @param filedata Buffer containing the file.
   */
  public async attachMedia(id: number, filename: string, filedata: Buffer): Promise<LocalPoster> {
    return {} as LocalPoster;
  }

  /**
   * Creates a new Local Poster of the url type.
   * @param params The specifics of the poster as specified in the UrlPosterParams interface.
   */
  public async createUrlPoster(params: UrlPosterParams): Promise<LocalPoster> {
    return {} as LocalPoster;
  }

  /**
   * Creates a new Local Poster of the photo type.
   * @param params The specifics of the poster as specified in the PhotoPosterParams interface.
   */
  public async createPhotoPoster(params: PhotoPosterParams): Promise<LocalPoster> {
    return {} as LocalPoster;
  }

  /**
   * Deletes the given poster from the database and storage.
   * @param id The id of the poster to be deleted.
   */
  public async deleteLocalPoster(id: number): Promise<void> {}

  /**
   * Updates the given fields in the database entry of the given poster.
   * @param id The id of the poster to be updated.
   * @param params The fields of the poster to be updated as specified in UpdatePosterParams.
   */
  public async updateLocalPoster(id: number, params: UpdatePosterParams): Promise<LocalPoster> {
    return {} as LocalPoster;
  }
}
