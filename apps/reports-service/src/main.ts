/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as path from 'path';
import * as fs from 'fs';
import * as cookieParser from 'cookie-parser';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { MQ_HOST } from '@invyce/global-constants';

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
  await app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [MQ_HOST()],
      queue: 'report_queue',
      queueOptions: {
        durable: false,
      },
    },
  });

  app.startAllMicroservices();

  if (
    process.env['NODE' + '_ENV'] === 'production' ||
    process.env['NODE' + '_ENV'] === 'staging'
  ) {
    app.setGlobalPrefix('/reports');
  }

  const port = process.env.PORT || 3340;
  const hostname = process.env.HOSTNAME || 'localhost';

  app.use(cookieParser());
  app.enableCors({
    origin: true,
    credentials: true,
  });

  await app.listen(port, () => {
    const address =
      'http' + (ssl ? 's' : '') + '://' + hostname + ':' + port + '/';
    Logger.log('Listening at ' + address);
  });
}

bootstrap();
