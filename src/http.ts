import bodyParser from 'body-parser';
import express, { Response as ExResponse, Request as ExRequest } from 'express';
import swaggerUi from 'swagger-ui-express';
import passport from 'passport';
import cors from 'cors';
import { RegisterRoutes } from '../build/routes';
import apiDocs from '../build/swagger.json';
import { SessionMiddleware } from './modules/auth';

export default function createHttp() {
  const app = express();

  app.use(cors({ allowedHeaders: ['Cookie', 'Cookies'] }));

  app.use(
    bodyParser.urlencoded({
      extended: true,
    }),
  );
  app.use(bodyParser.json());
  app.use(SessionMiddleware.getInstance().get());

  RegisterRoutes(app);

  if (process.env.NODE_ENV === 'development') {
    app.use('/api-docs', swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => res.send(
      swaggerUi.generateHTML(apiDocs),
    ));
    app.post('/auth/mock', passport.authenticate('custom'), (req: ExRequest, res: ExResponse) => res.status(204).send());
  }

  return app;
}
