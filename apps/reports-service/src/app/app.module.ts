import { Module } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { AccountModule } from './account/account.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BillModule } from './bill/bill.module';
import { InvoiceModule } from './invoice/invoice.module';
import { PaymentModule } from './payment/payment.module';
import { TransactionModule } from './transaction/transaction.module';

dotenv.config();

@Module({
  imports: [
    InvoiceModule,
    BillModule,
    TransactionModule,
    AccountModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
