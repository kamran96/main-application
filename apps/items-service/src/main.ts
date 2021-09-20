/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Console } from 'console';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3335;
  app.use(cookieParser());

  console.log(process.env['NODE' + '_ENV']);
  if (process.env['NODE' + '_ENV'] === 'production') {
    app.setGlobalPrefix('/items');
  }
  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port);
  });
}

bootstrap();
