import { Controller, Get, Logger, Param, Query, Req } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CREATE_CONTACT_LEDGER } from '@invyce/send-email';
import { PaymentService } from './payment.service';
import { IRequest } from '@invyce/interfaces';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Get('contact-ledger/:id')
  async ContactLedger(@Req() req: IRequest, @Param() params, @Query() query) {
    return await this.paymentService.ContactLedger(params.id, req, query);
  }

  @MessagePattern(CREATE_CONTACT_LEDGER)
  async CreateContactLegder(@Payload() data) {
    Logger.log('Data is received.');
    Logger.log(data);
    return await this.paymentService.CreateContactLegder(data);
  }
}
