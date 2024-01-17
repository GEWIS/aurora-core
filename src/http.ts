import bodyParser from 'body-parser';
import express, { Response as ExResponse, Request as ExRequest, NextFunction } from 'express';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { ValidateError } from '@tsoa/runtime';
import { RegisterRoutes } from '../build/routes';
import apiDocs from '../build/swagger.json';
import { SessionMiddleware } from './modules/auth';
import { oidcResponse } from './modules/auth/passport/oidc-strategy';
import { mockLogin } from './modules/auth/passport/mock-strategy';

/**
 * Create an Express instance to listen to HTTP calls.
 * Directly assigns all middlewares and routes.
 *
 * HTTP is only used for the end user to interact with the software,
 * i.e. changing settings or modes.
 */
export default async function createHttp() {
  const app = express();

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

  if (process.env.NODE_ENV === 'development') {
    app.use('/api-docs', swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => res.send(
      swaggerUi.generateHTML(apiDocs),
    ));
    app.post('/api/auth/mock', passport.authenticate('mock'), mockLogin);
    app.use('/static', express.static('public'));
  }

  app.use((
    err: unknown,
    req: ExRequest,
    res: ExResponse,
    next: NextFunction,
  ): ExResponse | void => {
    if (err instanceof ValidateError) {
      console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
      return res.status(422).json({
        message: 'Validation Failed',
        details: err?.fields,
      });
    }
    if (err instanceof Error) {
      return res.status(500).json({
        message: 'Internal Server Error',
      });
    }

    return next();
  });

  app.use((_req, res: ExResponse) => {
    res.status(404).send({
      message: 'Not Found',
    });
  });

  return app;
}
