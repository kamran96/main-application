import { Controller, Get, Logger, Req } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  INVOICE_CREATED,
  PAYMENT_CREATED_FOR_INVOICE,
  TRANSACTION_CREATED_FOR_INVOICE,
} from '@invyce/send-email';
import { InvoiceService } from './invoice.service';
import { IRequest } from '@invyce/interfaces';

@Controller('invoice')
export class InvoiceController {
  constructor(private invoiceService: InvoiceService) {}

  @MessagePattern(INVOICE_CREATED)
  async CreateInvoice(@Payload() data) {
    Logger.log('Data is received.');
    Logger.log(data);
    return await this.invoiceService.CreateInvoice(data);
  }

  @MessagePattern(PAYMENT_CREATED_FOR_INVOICE)
  async CreatePaymentForInvoice(@Payload() data) {
    Logger.log('Data is received.');
    Logger.log(data);
    return await this.invoiceService.CreatePaymentForInvoice(data);
  }

  @MessagePattern(TRANSACTION_CREATED_FOR_INVOICE)
  async CreateTransactionForInvoice(@Payload() data) {
    Logger.log('Data is received.');
    Logger.log(data);
    return await this.invoiceService.CreateTransactionForInvoice(data);
  }

  @Get('aged-receivables')
  async AgedReceivableReport(@Req() req: IRequest) {
    return await this.invoiceService.AgedReceivables(req.user);
  }
}
