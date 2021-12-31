import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FiancialController } from './financial.controllert';
import { FinancialService } from './financial.service';
import { Authenticate } from '@invyce/auth-middleware';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'EMAIL_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'email_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  providers: [FinancialService, Authenticate],
  controllers: [FiancialController],
})
export class FinancialModule {}
