import { DataSource } from 'typeorm';
import fs from 'fs';

export class DataSourceSingleton {
  private static instance: DataSourceSingleton

  private initialized = false;

  private dataSource: DataSource;

  private createDataSource(entities: any[]) {
    return new DataSource({
        host: process.env.TYPEORM_HOST,
        port: parseInt(process.env.TYPEORM_PORT || '3001', 10),
        database: process.env.TYPEORM_DATABASE,
        type: process.env.TYPEORM_CONNECTION as any,
        username: process.env.TYPEORM_USERNAME,
        password: process.env.TYPEORM_PASSWORD,
        ...(process.env.TYPEORM_SSL_ENABLED === 'true' && process.env.TYPEORM_SSL_CACERTS
          ? {
            ssl: {
              ca: fs.readFileSync(process.env.TYPEORM_SSL_CACERTS),
            },
          }
          : {}),
        synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
        logging: process.env.TYPEORM_LOGGING === 'true',
        extra: {
          authPlugins: {
            mysql_clear_password: () => () => Buffer.from(`${process.env.TYPEORM_PASSWORD}\0`),
          },
        },
        entities: entities
      });
  }

  public static getInstance() {
    if (this.instance == null) {
      this.instance = new DataSourceSingleton();
    }
    return this.instance;
  }

  public get() {
    return this.dataSource;
  }

  public async initialize(entities: any[]) {
    if (this.initialized) {
      throw new Error('DataSource already initialized!')
    }

    this.dataSource = this.createDataSource(entities)
    await this.dataSource.initialize()
    this.initialized = true;
  }
}
