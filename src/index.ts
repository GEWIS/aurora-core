import './env';
import { createServer } from 'http';
import * as fs from 'fs';
import path from 'node:path';
import logger from './logger';
import createHttp from './http';
import dataSource from './database';
import HandlerManager from './modules/root/handler-manager';
import createWebsocket from './socketio';
import './modules/audit/audit-logger';
import { SpotifyApiHandler, SpotifyTrackHandler } from './modules/spotify';
import { MusicEmitter } from './modules/events';
import LightsControllerManager from './modules/root/lights-controller-manager';
import ModeManager from './modules/modes/mode-manager';
import { ArtificialBeatGenerator } from './modules/beats/artificial-beat-generator';
import initBackofficeSynchronizer from './modules/backoffice/synchronizer';
import { SocketioNamespaces } from './socketio-namespaces';
import SocketConnectionManager from './modules/root/socket-connection-manager';
import { BackofficeSyncEmitter } from './modules/events/backoffice-sync-emitter';
import { activeDirectoryConnect } from './modules/infoscreen/entities/ldap-connector';
import ServerSettingsStore from './modules/root/server-settings-store';
import registerCronJobs from './cron';

async function createApp(): Promise<void> {
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

  await dataSource.initialize();

  await ServerSettingsStore.getInstance().initialize();

  const app = await createHttp();
  const httpServer = createServer(app);
  const io = createWebsocket(httpServer);

  const musicEmitter = new MusicEmitter();
  const backofficeSyncEmitter = new BackofficeSyncEmitter();

  const handlerManager = HandlerManager.getInstance(io, musicEmitter, backofficeSyncEmitter);
  await handlerManager.init();
  const socketConnectionManager = new SocketConnectionManager(
    handlerManager,
    io,
    backofficeSyncEmitter,
  );
  await socketConnectionManager.clearSavedSocketIds();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- TODO should this be used somewhere?
  const lightsControllerManager = new LightsControllerManager(
    io.of(SocketioNamespaces.LIGHTS),
    handlerManager,
    musicEmitter,
  );

  await activeDirectoryConnect().catch(() => {
    // eslint-disable-next-line no-console -- non intrusive console warn for providing information
    console.warn('Could not connect to LDAP. This will cause parts of the website to malfunction.');
  });

  ModeManager.getInstance().init(musicEmitter, backofficeSyncEmitter);
  ArtificialBeatGenerator.getInstance().init(musicEmitter);

  if (
    process.env.SPOTIFY_ENABLE === 'true' &&
    process.env.SPOTIFY_CLIENT_ID &&
    process.env.SPOTIFY_CLIENT_SECRET &&
    process.env.SPOTIFY_REDIRECT_URI
  ) {
    logger.info('Initialize Spotify...');
    await SpotifyApiHandler.getInstance().init();
    await SpotifyTrackHandler.getInstance().init(musicEmitter);
  }

  initBackofficeSynchronizer(io.of('/backoffice'), {
    musicEmitter,
    backofficeEmitter: backofficeSyncEmitter,
  });

  registerCronJobs();

  const port = process.env.PORT || 3000;
  httpServer.listen(port, () => logger.info(`Listening at http://localhost:${port}`));
}

if (require.main === module) {
  process.on('SIGINT', () => {
    // this is only called on ctrl+c, not restart
    process.kill(process.pid, 'SIGINT');
  });

  // Only execute the application directly if this is the main execution file.
  createApp().catch((e) => {
    logger.fatal(e);
  });
}
