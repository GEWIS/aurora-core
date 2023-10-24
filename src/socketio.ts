import { Server as SocketIoServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { DefaultEventsMap, EventsMap } from 'socket.io/dist/typed-events';
import { SessionMiddleware, User } from './modules/auth';

const devEnv = process.env.NODE_ENV === 'development';

interface SocketData {
  user: User,
}

/**
 * Create a SocketIO instance and attach it to the Express HTTP server
 *
 * Websockets are used by the entities (lights, audios and screens) to listen
 * for instructions/tasks/messages. They should subscribe to their corresponding
 * namespaces. Authentication with a session cookie is necessary.
 * @param httpServer Express.JS HttpServer instance
 */
export default function createWebsocket(httpServer: HttpServer) {
  const io = new SocketIoServer<
  DefaultEventsMap, EventsMap, DefaultEventsMap, SocketData
  >(httpServer, {
    cookie: true,
    cors: {
      origin: '*',
      allowedHeaders: devEnv ? ['cookie_development'] : [],
    },
  });

  const wrap = (
    middleware: (req: Request, res: Response, next: NextFunction) => void,
  ) => (socket: Socket, next: any) => middleware(socket.request as Request, {} as Response, next);

  /**
   * Set the "cookies" header to "cookie" in development to allow SocketIO auth without CORS
   * Web browsers protect users by not being able to set cookies manually in API requests
   * Unfortunately, when testing, it might be that you test from a different hostname. To not
   * trigger CORS but to also allow authorization via cookies, you should put the auth
   * cookie in the "cookie_development" header. Please do not do this in production.
   */
  if (devEnv) {
    io.use((socket, next) => {
      if (socket.request.headers.cookie == null) {
        // eslint-disable-next-line no-param-reassign
        socket.request.headers.cookie = socket.request.headers.cookie_development?.toString();
      }
      next();
    });
  }
  io.use(wrap(SessionMiddleware.getInstance().get()));
  io.use(wrap(passport.initialize()));
  io.use(wrap(passport.session()));

  io.use((socket, next) => {
    // Cannot override IncomingMessage interface
    // @ts-ignore
    if (socket.request.user) {
      // @ts-ignore
      // eslint-disable-next-line no-param-reassign
      socket.data.user = socket.request.user;
      next();
    } else {
      next(new Error('unauthorized'));
    }
  });

  io.on('connect', (socket) => {
    socket.emit('Hello world!');
  });

  return io;
}
