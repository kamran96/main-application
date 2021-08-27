import { Controller, Get, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { AppService } from './app.service';
import { SEND_CUSTOMER_EMAIL, SEND_FORGOT_PASSWORD } from '@invyce/send-email';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern(SEND_FORGOT_PASSWORD)
  async sendCustomerEmail(@Payload() data: any) {
    Logger.log('Data is received.');
    Logger.log(data);

    await this.appService.SendEmail(data);
  }
}
