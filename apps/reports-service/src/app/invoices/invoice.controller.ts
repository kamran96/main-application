import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  INVOICE_CREATED,
  PAYMENT_CREATED,
  TRANSACTION_CREATED,
} from '@invyce/send-email';
import { InvoiceService } from './invoice.service';

@Controller()
export class InvoiceController {
  constructor(private invoiceService: InvoiceService) {}

  @MessagePattern(INVOICE_CREATED)
  async CreateInvoice(@Payload() data) {
    Logger.log('Data is received.');
    Logger.log(data);
    return await this.invoiceService.CreateInvoice(data);
  }

  @MessagePattern(PAYMENT_CREATED)
  async CreatePaymentForInvoice(@Payload() data) {
    Logger.log('Data is received.');
    Logger.log(data);
    return await this.invoiceService.CreatePaymentForInvoice(data);
  }

  @MessagePattern(TRANSACTION_CREATED)
  async CreateTransactionForInvoice(@Payload() data) {
    Logger.log('Data is received.');
    Logger.log(data);
    return await this.invoiceService.CreateTransactionForInvoice(data);
  }
}
