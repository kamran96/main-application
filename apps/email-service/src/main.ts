/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { MQ_HOST } from '@invyce/global-constants';

import { AppModule } from './app/app.module';

console.log(
  'amqp://user:ECjKUsxejvQHxVbe@rabbit-rabbitmq.default.svc.cluster.local',
  'host'
);
async function bootstrap() {
  const app: any = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [
          process.env['NODE' + '_ENV'] === 'production'
            ? `amqp://user:ECjKUsxejvQHxVbe@rabbit-rabbitmq.default.svc.cluster.local`
            : 'amqp://localhost:5672',
        ],
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
