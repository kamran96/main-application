/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { MQ_HOST } from '@invyce/global-constants';

import { AppModule } from './app/app.module';

console.log(MQ_HOST(), 'host');
async function bootstrap() {
  const app: any = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [MQ_HOST()],
        queue: 'email_queue',
        queueOptions: {
          durable: false,
        },
      },
    }
  );

  const port = process.env.PORT || 3339;
  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port);
  });
}

bootstrap();
