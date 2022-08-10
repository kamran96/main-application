import { Module } from '@nestjs/common';
import { Authenticate } from '@invyce/auth-middleware';
import { PurchaseOrderController } from './purchase-order.controller';
import { PurchaseOrderService } from './purchase-order.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
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
  ],
  controllers: [PurchaseOrderController],
  providers: [PurchaseOrderService],
})
export class PurchaseOrderModule {
  configure(route) {
    route.apply(Authenticate).forRoutes(PurchaseOrderController);
  }
}
