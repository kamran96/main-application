import { Module } from '@nestjs/common';
import { Authenticate } from '@invyce/auth-middleware';

import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';

@Module({
  imports: [],
  providers: [InvoiceService],
  controllers: [InvoiceController],
})
export class InvoiceModule {
  configure(route) {
    route.apply(Authenticate).forRoutes(InvoiceController);
  }
}
