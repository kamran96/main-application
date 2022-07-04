/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
// import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // const app: any = await NestFactory.createMicroservice<MicroserviceOptions>(
  //   AppModule,
  //   {
  //     transport: Transport.RMQ,
  //     options: {
  //       urls: ['amqp://127.0.0.1:5672'],
  //       queue: 'report_queue',
  //       queueOptions: {
  //         durable: false,
  //       },
  //     },
  //   }
  // );

  app.enableCors({
    credentials: true,
    origin: true,
  });

  if (process.env['NODE' + '_ENV'] === 'production') {
    app.setGlobalPrefix('/reports');
  }
  const port = process.env.PORT || 3340;
  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port);
  });
}

bootstrap();
