import fs from 'fs';
import { DataSource, DataSourceOptions, EntitySchema } from 'typeorm';

export type EntityList = (Function | EntitySchema<any>)[];

export interface CreateDataSourceParams {
  entities: EntityList;
  options?: Partial<DataSourceOptions>;
}

export const createSqliteDataSource = ({
  entities,
  options = {},
}: CreateDataSourceParams): DataSource => {
  const baseOptions = {
    host: process.env.TYPEORM_HOST,
    port: parseInt(process.env.TYPEORM_PORT || '3001', 10),
    database: process.env.TYPEORM_DATABASE,
    type: process.env.TYPEORM_CONNECTION as DataSourceOptions['type'],
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
    entities,
  };

  return new DataSource({
    ...baseOptions,
    ...options,
    entities,
  } as DataSourceOptions);
};
