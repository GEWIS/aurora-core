import bodyParser from 'body-parser';
import express, { Response as ExResponse, Request as ExRequest } from 'express';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { pinoHttp } from 'pino-http';
import { RegisterRoutes } from '../build/routes';
import apiDocs from '../build/swagger.json';
import { SessionMiddleware } from './modules/auth';
import { oidcResponse } from './modules/auth/passport/oidc-strategy';
import { mockLogin } from './modules/auth/passport/mock-strategy';
import { setupErrorHandler } from './error';
import { apiKeyResponse } from './modules/auth/passport/api-key-strategy';

/**
 * Create an Express instance to listen to HTTP calls.
 * Directly assigns all middlewares and routes.
 *
 * HTTP is only used for the end user to interact with the software,
 * i.e. changing settings or modes.
 */
export default async function createHttp() {
  const app = express();

  app.use(pinoHttp({
    useLevel: 'debug',
  }));

  app.use(cors({ allowedHeaders: ['Cookie', 'Cookies'] }));

  app.use(
    bodyParser.urlencoded({
      extended: true,
    }),
  );
  app.use(bodyParser.json());
  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.use(SessionMiddleware.getInstance().get());

  app.use(passport.initialize());
  app.use(passport.session());

  RegisterRoutes(app);

  app.post('/api/auth/oidc', passport.authenticate('oidc'), oidcResponse);
  app.post('/api/auth/key', passport.authenticate('apikey'), apiKeyResponse);

  app.use('/api-docs', swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => res.send(
    swaggerUi.generateHTML(apiDocs),
  ));

  if (process.env.NODE_ENV === 'development') {
    app.post('/api/auth/mock', passport.authenticate('mock'), mockLogin);
    app.use('/static', express.static('public'));
  }

  setupErrorHandler(app);
  return app;
}
