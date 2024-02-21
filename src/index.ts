import './env';
import { createServer } from 'http';
import logger from './logger';
import createHttp from './http';
import dataSource from './database';
import HandlerManager from './modules/root/handler-manager';
import createWebsocket from './socketio';
import { SpotifyApiHandler, SpotifyTrackHandler } from './modules/spotify';
import { MusicEmitter } from './modules/events';
import LightsControllerManager from './modules/root/lights-controller-manager';
import ModeManager from './modules/modes/mode-manager';
import { ArtificialBeatGenerator } from './modules/beats/artificial-beat-generator';
import initBackofficeSynchronizer from './modules/backoffice/synchronizer';
import { SocketioNamespaces } from './socketio-namespaces';
import SocketConnectionManager from './modules/root/socket-connection-manager';

async function createApp(): Promise<void> {
  await dataSource.initialize();
  const app = await createHttp();
  const httpServer = createServer(app);
  const io = createWebsocket(httpServer);

  const musicEmitter = new MusicEmitter();

  const handlerManager = HandlerManager.getInstance(io, musicEmitter);
  await handlerManager.init();
  const socketConnectionManager = new SocketConnectionManager(handlerManager, io);
  const lightsControllerManager = new LightsControllerManager(
    io.of(SocketioNamespaces.LIGHTS),
    handlerManager,
    musicEmitter,
  );

  ModeManager.getInstance().init(musicEmitter);
  ArtificialBeatGenerator.getInstance().init(musicEmitter);

  if (process.env.SPOTIFY_ENABLE === 'true' && process.env.SPOTIFY_CLIENT_ID
    && process.env.SPOTIFY_CLIENT_SECRET && process.env.SPOTIFY_REDIRECT_URI) {
    logger.info('Initialize Spotify...');
    await SpotifyApiHandler.getInstance().init();
    await SpotifyTrackHandler.getInstance().init(musicEmitter);
    logger.info('Spotify initialized!');
  }

  initBackofficeSynchronizer(io.of('/backoffice'), { musicEmitter });

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
