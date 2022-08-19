/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { MQ_HOST } from '@invyce/global-constants';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app: any = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [MQ_HOST()],
        queue: 'report_queue',
        queueOptions: {
          durable: false,
        },
      },
    }
  );

  if (
    process.env['NODE' + '_ENV'] === 'production' ||
    process.env['NODE' + '_ENV'] === 'staging'
  ) {
    app.setGlobalPrefix('/reports');
  }
  const port = process.env.PORT || 3340;
  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port);
  });
}

bootstrap();
