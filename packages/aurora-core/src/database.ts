import { createSqliteDataSource } from '@gewis/aurora-db-sqlite';
import { registerDataSource } from './ports/data-source.port';
import ServerSetting from './modules/server-settings/server-setting';
import { Entities as BaseEntities } from './modules/root/entities';
import { Entities as AuthEntities, IntegrationEntities } from '@gewis/aurora-auth';
import { Entities as FileEntities } from './modules/files/entities';
import { Entities as AuditEntities } from './modules/audit/entities';
import { Entities as SpotifyEntities } from './modules/spotify/entities';
import { Entities as LightsEntities } from './modules/lights/entities';
import { Entities as TimedEventsEntities } from './modules/timed-events/entities';
import LocalPoster from './modules/handlers/screen/poster/local/local-poster';

const dataSource = createSqliteDataSource({
  entities: [
    ServerSetting,
    ...TimedEventsEntities,
    ...BaseEntities,
    ...AuthEntities,
    ...IntegrationEntities,
    ...FileEntities,
    ...AuditEntities,
    ...SpotifyEntities,
    ...LightsEntities,
    LocalPoster,
  ],
});

registerDataSource(dataSource);

export const initializeDataSource = async (): Promise<void> => {
  await dataSource.initialize();
};

export default dataSource;
