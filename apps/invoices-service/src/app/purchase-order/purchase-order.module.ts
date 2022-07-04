import { Module } from '@nestjs/common';
import { Authenticate } from '@invyce/auth-middleware';
import { PurchaseOrderController } from './purchase-order.controller';
import { PurchaseOrderService } from './purchase-order.service';

@Module({
  imports: [],
  controllers: [PurchaseOrderController],
  providers: [PurchaseOrderService],
})
export class PurchaseOrderModule {
  configure(route) {
    route.apply(Authenticate).forRoutes(PurchaseOrderController);
  }
}
