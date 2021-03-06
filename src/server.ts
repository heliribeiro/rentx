import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import swaggerUI from 'swagger-ui-express';

import 'express-async-errors';
import { AppError } from './errors/AppError';

import './shared/container';
import './database';
import { router } from './routes';
import swaggerFile from './swagger.json';

const app = express();

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerFile));

app.use(express.json());

app.use(router);

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        message: err.message,
      });
    }

    return response.status(500).json({
      status: 'error',
      message: `Internal server Error - ${err.message}`,
    });
  },
);

app.listen(3333, () => console.log('Server is running'));
