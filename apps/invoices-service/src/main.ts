/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import * as fs from 'fs';
import * as path from 'path';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const ssl = process.env.SSL === 'true' ? true : false;
  let httpsOptions = null;
  if (ssl) {
    const keyPath = process.env.SSL_KEY_PATH || '../../../certs/localhost.key';
    const certPath =
      process.env.SSL_CERT_PATH || '../../../certs/localhost.crt';
    httpsOptions = {
      key: fs.readFileSync(path.join(__dirname, keyPath)),
      cert: fs.readFileSync(path.join(__dirname, certPath)),
    };
  }
  const app = await NestFactory.create(AppModule, { httpsOptions });

  const hostname = process.env.HOSTNAME || 'localhost';
  const port = process.env.PORT || 3337;
  app.use(cookieParser());
  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.use(helmet());

  if (
    process.env['NODE' + '_ENV'] === 'production' ||
    process.env['NODE' + '_ENV'] === 'staging'
  ) {
    app.setGlobalPrefix('/invoices');
  }
  await app.listen(port, () => {
    const address =
      'http' + (ssl ? 's' : '') + '://' + hostname + ':' + port + '/';
    Logger.log('Listening at ' + address);
  });
}

bootstrap();
