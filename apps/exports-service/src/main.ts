/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3342;
  app.enableCors({
    origin: true,
    credentials: true,
  });

  if (process.env['NODE' + '_ENV'] === 'production') {
    app.setGlobalPrefix('/exports');
  }
  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port);
  });
}

bootstrap();