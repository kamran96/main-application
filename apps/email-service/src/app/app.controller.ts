import { Controller, Get, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { AppService } from './app.service';
import { SEND_FORGOT_PASSWORD, SEND_INVITATION } from '@invyce/send-email';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern(SEND_INVITATION)
  async sendInvitation(@Payload() data: any) {
    Logger.log('Data is received.');
    Logger.log(data);

    await this.appService.SendInvitation(data);
  }

  @MessagePattern(SEND_FORGOT_PASSWORD)
  async sendForgotPassword(@Payload() data: any) {
    Logger.log('Data is received.');
    Logger.log(data);

    await this.appService.SendForgotPassword(data);
  }
}
