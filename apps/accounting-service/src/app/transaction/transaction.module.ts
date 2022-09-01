import { Module } from '@nestjs/common';
import { Authenticate } from '@invyce/auth-middleware';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { MQ_HOST } from '@invyce/global-constants';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'REPORT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [MQ_HOST()],
          queue: 'report_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {
  configure(route) {
    route.apply(Authenticate).forRoutes(TransactionController);
  }
}
