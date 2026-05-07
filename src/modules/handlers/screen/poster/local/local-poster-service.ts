import { FileStorage } from '../../../../files/storage/file-storage';
import { Repository } from 'typeorm';
import { File } from '../../../../files/entities';
import LocalPoster from './local-poster';
import { DiskStorage } from '../../../../files/storage';
import dataSource from '../../../../../database';
import { HttpApiException } from '../../../../../helpers/custom-error';
import { HttpStatusCode } from 'axios';
import { FooterSize, PosterType } from '../poster';
import FileResponse from '../../../../files/entities/file-response';

interface BasePosterParams {
  name: string;
  label?: string;
  startDate?: Date;
  expirationDate?: Date;
  accentColor?: string;
  footerSize?: FooterSize;
  defaultTimeout?: number;
  borrelMode?: boolean;
  trello?: boolean;
}

export interface MediaPosterRequest extends BasePosterParams {
  type: PosterType.IMAGE | PosterType.VIDEO;
}

export interface ExternalPosterRequest extends BasePosterParams {
  type: PosterType.EXTERNAL;
  uri: string;
}

export interface PhotoPosterRequest extends BasePosterParams {
  type: PosterType.PHOTO;
  albums: number[];
}

export type CreatePosterRequest = MediaPosterRequest | ExternalPosterRequest | PhotoPosterRequest;

export interface UpdatePosterRequest {
  name?: string;
  label?: string;
  startDate?: Date;
  expirationDate?: Date;
  accentColor?: string;
  footerSize?: FooterSize;
  defaultTimeout?: number;
  borrelMode?: boolean;
}

export interface LocalPosterResponse {
  id: number;
  name: string;
  label?: string;
  type: PosterType;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  startDate?: Date;
  expirationDate?: Date;
  accentColor?: string;
  footerSize: FooterSize;
  defaultTimeout: number;
  borrelMode: boolean;
  protected: boolean;
  uri?: string;
  albums?: number[];
  file?: FileResponse;
}

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
      name: poster.name,
      label: poster.label ?? undefined,
      type: poster.type,
      enabled: poster.enabled,
      createdAt: poster.createdAt.toISOString(),
      updatedAt: poster.updatedAt.toISOString(),
      startDate: poster.startDate ?? undefined,
      expirationDate: poster.expirationDate ?? undefined,
      accentColor: poster.accentColor ?? undefined,
      footerSize: poster.footerSize,
      defaultTimeout: poster.defaultTimeout,
      borrelMode: poster.borrelMode,
      protected: poster.protected,
      uri: poster.uri ?? undefined,
      albums: poster.albums ?? undefined,
      file: file,
    };
  }

  /**
   * Fetches all Local Posters from the database.
   */
  public async getAllLocalPosters(): Promise<LocalPoster[]> {
    return this.repo.find();
  }

  /**
   * Gets a specific Local Poster from the database.
   * @param id The id of the poster to fetch.
   */
  public async getSingleLocalPoster(id: number): Promise<LocalPoster> {
    const poster = await this.repo.findOne({ where: { id } });
    if (poster == null) {
      throw new HttpApiException(HttpStatusCode.NotFound, `Poster with ID "${id}" not found.`);
    }
    return poster;
  }

  /**
   * Creates a new Local Poster with the media type in the database.
   * This does not yet contain the actual image or video of the poster.
   * @param params Metadata of the poster as specified in the MediaPosterParams interface.
   */
  public async createMediaPoster(params: MediaPosterRequest): Promise<LocalPoster> {
    const {
      name,
      label,
      type,
      startDate,
      expirationDate,
      accentColor,
      footerSize,
      defaultTimeout,
      borrelMode,
      trello,
    } = params;
    return this.repo.save({
      name,
      label,
      type,
      startDate,
      expirationDate,
      accentColor,
      footerSize,
      defaultTimeout,
      borrelMode,
      trello,
    });
  }

  /**
   * Adds the given image or video to the database entry for the specified poster.
   * @param id Id of the poster to add the media to.
   * @param filename Original filename of the media file.
   * @param filedata Buffer containing the file.
   */
  public async attachMedia(id: number, filename: string, filedata: Buffer): Promise<LocalPoster> {
    const poster = await this.getSingleLocalPoster(id);
    if (poster.type != PosterType.IMAGE && poster.type != PosterType.VIDEO) {
      throw new HttpApiException(
        HttpStatusCode.BadRequest,
        `Poster with ID "${id}" is not a media poster.`,
      );
    }

    const fileParams = await this.storage.saveFile(filename, filedata);
    poster.file = await this.fileRepo.save(fileParams);
    return this.repo.save(poster);
  }

  /**
   * Creates a new Local Poster of the url type.
   * @param params The specifics of the poster as specified in the UrlPosterParams interface.
   */
  public async createExternalPoster(params: ExternalPosterRequest): Promise<LocalPoster> {
    const {
      name,
      label,
      type,
      startDate,
      expirationDate,
      accentColor,
      footerSize,
      defaultTimeout,
      borrelMode,
      uri,
      trello,
    } = params;
    return this.repo.save({
      name,
      label,
      type,
      startDate,
      expirationDate,
      accentColor,
      footerSize,
      defaultTimeout,
      borrelMode,
      uri,
      trello,
    });
  }

  /**
   * Creates a new Local Poster of the photo type.
   * @param params The specifics of the poster as specified in the PhotoPosterParams interface.
   */
  public async createPhotoPoster(params: PhotoPosterRequest): Promise<LocalPoster> {
    const {
      name,
      label,
      type,
      startDate,
      expirationDate,
      accentColor,
      footerSize,
      defaultTimeout,
      borrelMode,
      albums,
      trello,
    } = params;
    return this.repo.save({
      name,
      label,
      type,
      startDate,
      expirationDate,
      accentColor,
      footerSize,
      defaultTimeout,
      borrelMode,
      albums,
      trello,
    });
  }

  /**
   * Deletes the given poster from the database and storage.
   * @param id The id of the poster to be deleted.
   */
  public async deleteLocalPoster(id: number): Promise<void> {
    const poster = await this.getSingleLocalPoster(id);
    if (poster.file) {
      await this.fileRepo.delete(poster.file.id);
      await this.storage.deleteFile(poster.file);
    }
    await this.repo.remove(poster);
  }

  /**
   * Updates the given fields in the database entry of the given poster.
   * @param id The id of the poster to be updated.
   * @param params The fields of the poster to be updated as specified in UpdatePosterParams.
   */
  public async updateLocalPoster(id: number, params: UpdatePosterRequest): Promise<LocalPoster> {
    const poster = await this.getSingleLocalPoster(id);
    Object.assign(poster, params);
    return this.repo.save(poster);
  }

  /**
   * Changes the enabled status of the given poster.
   * @param id The id of the poster to enable/disable.
   * @param enabled The state to put the poster in.
   */
  public async togglePosterEnable(id: number, enabled: boolean): Promise<LocalPoster> {
    const poster = await this.getSingleLocalPoster(id);
    poster.enabled = enabled;
    return this.repo.save(poster);
  }

  /**
   * Deletes every poster with the trello flag from the database.
   */
  public async deleteTrelloPosters(): Promise<void> {
    const posters = await this.repo.find({ where: { trello: true } });
    await Promise.all(posters.map((poster) => this.deleteLocalPoster(poster.id)));
  }
}
