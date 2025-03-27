import './env';
import { createServer } from 'http';
import * as fs from 'fs';
import path from 'node:path';
import logger from '@gewis/aurora-core-logger';
import createHttp from './http';
import HandlerManager from './modules/root/handler-manager';
import createWebsocket from './socketio';
import './modules/audit/audit-logger';
import { SpotifyApiHandler, SpotifyTrackHandler } from './modules/spotify';
import LightsControllerManager from './modules/root/lights-controller-manager';
import ModeManager from './modules/modes/mode-manager';
import { ArtificialBeatGenerator } from './modules/beats/artificial-beat-generator';
import initBackofficeSynchronizer from './modules/backoffice/synchronizer';
import { SocketioNamespaces } from '@gewis/aurora-core-util';
import SocketConnectionManager from './modules/root/socket-connection-manager';
import EmitterStore from './modules/events/emitter-store';
// do not remove; used for extending existing types
import Types from './types';
import {OrderManager, OrderSettingsDefault} from './modules/orders';
import TimedEventsService from './modules/timed-events/timed-events-service';
import LightsSwitchManager from './modules/root/lights-switch-manager';
import { AuroraConfig } from '@gewis/aurora-core-util'
import { DataSourceSingleton } from '@gewis/aurora-core-database-util'
import { Entities as BaseEntities } from './modules/root/entities';
import { Entities as AuthEntities } from './modules/auth/entities';
import { Entities as FileEntities } from './modules/files/entities';
import { Entities as AuditEntities } from './modules/audit/entities';
import { Entities as SpotifyEntities } from './modules/spotify/entities';
import { Entities as LightsEntities } from './modules/lights/entities';
import { Entities as TimedEventsEntities } from './modules/timed-events/entities';
import LocalPoster from './modules/handlers/screen/poster/local/local-poster';
import {ScreenHandlerSettings, ScreenHandlerSettingsDefaults} from "./modules/handlers/screen/screen-handler-settings";
import {OrderSettings} from "./modules/orders";
import { ServerSettingsStore, ServerSetting } from '@gewis/aurora-core-server-settings';

async function createApp(config: AuroraConfig): Promise<void> {
  // Fix for production issue where a Docker volume overwrites the contents of a folder instead of merging them
  if (process.env.STATIC_FILES_LOCATION) {
    const audioFromPath = path.join(__dirname, '../public/audio');
    const audioToPath = path.join(process.env.STATIC_FILES_LOCATION, '/audio');

    if (!fs.existsSync(audioToPath)) {
      fs.mkdirSync(audioToPath);
    }
    // Empty the directory before filling it with new files
    fs.readdirSync(audioToPath).forEach((f) => fs.rmSync(path.join(audioToPath, f)));
    fs.cpSync(audioFromPath, audioToPath, { recursive: true });
  }

  await DataSourceSingleton.getInstance().initialize([
    ServerSetting,
    ...TimedEventsEntities,
    ...BaseEntities,
    ...AuthEntities,
    ...FileEntities,
    ...AuditEntities,
    ...SpotifyEntities,
    ...LightsEntities,
    LocalPoster
  ])

  await ServerSettingsStore.getInstance().initialize<ScreenHandlerSettings>('screenHandler', ScreenHandlerSettingsDefaults)
  await ServerSettingsStore.getInstance().initialize<OrderSettings>('orders', OrderSettingsDefault)

  await TimedEventsService.getInstance().registerAllDatabaseEvents();

  const app = await createHttp(config);
  const httpServer = createServer(app);
  const io = createWebsocket(httpServer);

  const emitterStore = EmitterStore.getInstance();

  ArtificialBeatGenerator.getInstance().init(emitterStore.musicEmitter);

  const lightsSwitchManager = LightsSwitchManager.getInstance();
  const handlerManager = HandlerManager.getInstance(io, emitterStore);
  await handlerManager.init();
  const socketConnectionManager = new SocketConnectionManager(
    handlerManager,
    lightsSwitchManager,
    io,
    emitterStore.backofficeSyncEmitter,
  );
  await socketConnectionManager.clearSavedSocketIds();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- TODO should this be used somewhere?
  const lightsControllerManager = new LightsControllerManager(
    io.of(SocketioNamespaces.LIGHTS),
    handlerManager,
    lightsSwitchManager,
    emitterStore.musicEmitter,
  );

  ModeManager.getInstance().init(emitterStore);

  if (
    process.env.SPOTIFY_ENABLE === 'true' &&
    process.env.SPOTIFY_CLIENT_ID &&
    process.env.SPOTIFY_CLIENT_SECRET &&
    process.env.SPOTIFY_REDIRECT_URI
  ) {
    logger.info('Initialize Spotify...');
    await SpotifyApiHandler.getInstance().init();
    await SpotifyTrackHandler.getInstance().init(emitterStore.musicEmitter);
  }

    OrderManager.getInstance().init(emitterStore.orderEmitter);

  initBackofficeSynchronizer(io.of('/backoffice'), emitterStore);

  const port = process.env.PORT || 3000;
  httpServer.listen(port, () => logger.info(`Listening at http://localhost:${port}`));
}

export function start(config: AuroraConfig) {
  process.on('SIGINT', () => {
    // this is only called on ctrl+c, not restart
    process.kill(process.pid, 'SIGINT');
  });

  // Only execute the application directly if this is the main execution file.
  createApp(config).catch((e) => {
    logger.fatal(e);
  });
}

export { DataSourceSingleton }
