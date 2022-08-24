import { Module } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InvoiceModule } from './invoices/invoice.module';

dotenv.config();

@Module({
  imports: [InvoiceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
