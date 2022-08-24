import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { Authenticate } from '@invyce/auth-middleware';
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
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {
  configure(route) {
    route.apply(Authenticate).forRoutes(PaymentController);
  }
}
