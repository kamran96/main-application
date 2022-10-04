import { Controller, Get, Logger, Req } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  BILL_CREATED,
  PAYMENT_CREATED_FOR_BILL,
  TRANSACTION_CREATED_FOR_BILL,
} from '@invyce/send-email';
import { BillService } from './bill.service';
import { IRequest } from '@invyce/interfaces';

@Controller('bill')
export class BillController {
  constructor(private billService: BillService) {}

  @MessagePattern(BILL_CREATED)
  async CreateInvoice(@Payload() data) {
    Logger.log('Data is received.');
    Logger.log(data);
    return await this.billService.CreateBill(data);
  }

  @MessagePattern(PAYMENT_CREATED_FOR_BILL)
  async CreatePaymentForBill(@Payload() data) {
    Logger.log('Data is received.');
    Logger.log(data);
    return await this.billService.CreatePaymentForBill(data);
  }

  @MessagePattern(TRANSACTION_CREATED_FOR_BILL)
  async CreateTransactionForBill(@Payload() data) {
    Logger.log('Data is received.');
    Logger.log(data);
    return await this.billService.CreateTransactionForBill(data);
  }

  @Get('aged-payables')
  async AgedPayablesReport(@Req() req: IRequest) {
    return await this.billService.AgedPayables(req.user);
  }
}
