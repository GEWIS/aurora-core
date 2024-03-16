import { DataSource } from 'typeorm';
import { Entities as BaseEntities } from './modules/root/entities';
import { Entities as AuthEntities } from './modules/auth/entities';
import { Entities as SpotifyEntities } from './modules/spotify/entities';
import { Entities as LightsEntities } from './modules/lights/entities';
import { Entities as InfoScreenEntities } from './modules/infoscreen/entities';

const dataSource = new DataSource({
  host: process.env.TYPEORM_HOST,
  port: parseInt(process.env.TYPEORM_PORT || '3001', 10),
  database: process.env.TYPEORM_DATABASE,
  type: process.env.TYPEORM_CONNECTION as any,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
  logging: process.env.TYPEORM_LOGGING === 'true',
  extra: {
    authPlugins: {
      mysql_clear_password: () => () => Buffer.from(`${process.env.TYPEORM_PASSWORD}\0`),
    },
  },
  entities: [
    ...BaseEntities,
    ...AuthEntities,
    ...SpotifyEntities,
    ...LightsEntities,
    ...InfoScreenEntities,
  ],
});

export default dataSource;
