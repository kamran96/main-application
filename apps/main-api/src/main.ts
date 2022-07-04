/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

const port = process.env.PORT || 8081;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(bodyParser.json({ limit: '5mb' }));
  app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
  app.enableCors();
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);
  Logger.log(`Server Running on http://localhost:${port}`, 'nestjs');
}
bootstrap();
