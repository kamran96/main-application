import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Authenticate } from '@invyce/auth-middleware';
import { BillController } from './bill.controller';
import { BillService } from './bill.service';
import { MQ_HOST } from '@invyce/global-constants';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'EMAIL_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [MQ_HOST()],
          queue: 'email_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
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
  controllers: [BillController],
  providers: [BillService],
})
export class BillModule {
  configure(route) {
    route.apply(Authenticate).forRoutes(BillController);
  }
}
