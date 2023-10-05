import bodyParser from 'body-parser';
import express, { Response as ExResponse, Request as ExRequest } from 'express';
import swaggerUi from 'swagger-ui-express';
import { RegisterRoutes } from '../build/routes';
import apiDocs from '../build/swagger.json';

export default function createHttp() {
  const app = express();

  app.use(
    bodyParser.urlencoded({
      extended: true,
    }),
  );
  app.use(bodyParser.json());

  RegisterRoutes(app);

  if (process.env.NODE_ENV === 'development') {
    app.use('/api-docs', swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => res.send(
      swaggerUi.generateHTML(apiDocs),
    ));
  }

  return app;
}
