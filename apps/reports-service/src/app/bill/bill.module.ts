import { Module } from '@nestjs/common';
import { Authenticate } from '@invyce/auth-middleware';
import { BillController } from './bill.controller';
import { BillService } from './bill.service';

@Module({
  imports: [],
  controllers: [BillController],
  providers: [BillService],
})
export class BillModule {
  configure(route) {
    route.apply(Authenticate).forRoutes(BillController);
  }
}
