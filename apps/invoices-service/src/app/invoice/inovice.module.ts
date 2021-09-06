import { Module } from '@nestjs/common';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { Authenticate } from '@invyce/auth-middleware';

@Module({
  imports: [],
  controllers: [InvoiceController],
  providers: [InvoiceService, Authenticate],
})
export class InvoiceModule {}
