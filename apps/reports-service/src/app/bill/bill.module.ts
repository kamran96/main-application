import { Module } from '@nestjs/common';
import { BillController } from './bill.controller';
import { BillService } from './bill.service';

@Module({
  imports: [],
  controllers: [BillController],
  providers: [BillService],
})
export class BillModule {}
