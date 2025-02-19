import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import * as fs from 'fs';
import { FileStorage } from './file-storage';
import { BaseFile } from '../entities';

export default class DiskStorage extends FileStorage {
  private readonly workdir: string;

  constructor(workdir: string) {
    super();
    this.workdir = workdir;
  }

  /**
   * Returns an uuidv4 string.
   * This separate function is created to make testing easier.
   */
  private static getRandomName() {
    return uuidv4();
  }

  public validateFileLocation(location: string): void {
    const directory = path.dirname(location);
    if (path.join(__dirname, '/../../..', this.workdir) !== directory) {
      throw new TypeError(`Given file is not located in the directory: ${directory}`);
    }
  }

  private static readFile(location: string) {
    return fs.readFileSync(location);
  }

  private static writeFile(location: string, data: Buffer) {
    return fs.writeFileSync(location, data);
  }

  private static removeFile(location: string) {
    return fs.rmSync(location);
  }

  private static fileExists(location: string): boolean {
    return fs.existsSync(location);
  }

  async saveFile(fileName: string, fileData: Buffer): Promise<string> {
    const fileExtension = path.extname(fileName);
    const randomFileName = `${DiskStorage.getRandomName()}${fileExtension}`;
    const fileLocation = path.join(__dirname, '/../../..', this.workdir, randomFileName);

    DiskStorage.writeFile(fileLocation, fileData);
    return Promise.resolve(fileLocation);
  }

  getFile(file: BaseFile): Promise<Buffer> {
    this.validateFileLocation(file.location);
    if (!DiskStorage.fileExists(file.location)) {
      return Promise.reject(new Error(`Given file does not exist on disk: ${file.location}`));
    }

    const data = DiskStorage.readFile(file.location);
    return Promise.resolve(data);
  }

  deleteFile(file: BaseFile): Promise<boolean> {
    this.validateFileLocation(file.location);
    if (!DiskStorage.fileExists(file.location)) {
      return Promise.resolve(false);
    }

    DiskStorage.removeFile(file.location);
    return Promise.resolve(true);
  }
}
