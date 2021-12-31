import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

export * from './lib/rabbitmq-module';

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'contact-created',
          type: 'topic',
        },
      ],
      uri: 'amqp://rabbitmq:rabbitmq@localhost:5672',
      connectionInitOptions: { wait: false },
    }),
  ],
})
export class RabbitMqModule {}
