/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
// import * as csurf from 'csurf';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3334;

  const options = {
    credentials: true,
    origin: true,
  };

  app.enableCors(options);
  app.use(cookieParser());
  app.use(helmet());

  // app.use(csurf());

  if (process.env['NODE_ENV'] === 'production') {
    app.setGlobalPrefix('/users');
  }

  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port);
  });
}

bootstrap();
