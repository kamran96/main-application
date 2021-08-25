import { Controller, Get, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { AppService } from './app.service';
import { SEND_CUSTOMER_EMAIL } from '@invyce/send-email';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern(SEND_CUSTOMER_EMAIL)
  async sendCustomerEmail(@Payload() data: any) {
    Logger.log('Data is received.');
    Logger.log(data);

    await this.appService.SendEmail(data);
  }
}
