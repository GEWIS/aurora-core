import { BaseFile } from '../entities';

export abstract class FileStorage {
  /**
   * Save a file with the given name to storage
   * @return The location of the file
   */
  public abstract saveFile(fileName: string, fileData: Buffer): Promise<string>;

  /**
   * Get the file from storage as a buffer object
   * @throws Error when file could not be found in storage
   */
  public abstract getFile(file: BaseFile): Promise<Buffer>;

  /**
   * Delete the file from the storage system
   * @returns true when file was deleted, false when file does not exist in storage
   * @throws Error when file could not be deleted
   */
  public abstract deleteFile(file: BaseFile): Promise<boolean>;
}
