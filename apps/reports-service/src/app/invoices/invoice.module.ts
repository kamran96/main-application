import { Module } from '@nestjs/common';
import { ArrangoDBModule } from '../arangodb/arango.module';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';

@Module({
  imports: [ArrangoDBModule],
  providers: [InvoiceService],
  controllers: [InvoiceController],
})
export class InvoiceModule {}
