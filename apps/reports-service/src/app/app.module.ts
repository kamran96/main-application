import { Module } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BillModule } from './bill/bill.module';
import { InvoiceModule } from './invoice/invoice.module';

dotenv.config();

@Module({
  imports: [InvoiceModule, BillModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
