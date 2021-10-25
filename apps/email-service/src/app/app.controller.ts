import { Controller, Get, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { AppService } from './app.service';
import {
  SEND_OTP,
  SEND_FORGOT_PASSWORD,
  SEND_INVITATION,
  SEND_PDF_MAIL,
} from '@invyce/send-email';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async GetData() {
    return await this.appService.getData();
  }

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

  @MessagePattern(SEND_OTP)
  async sendOtp(@Payload() data: any) {
    Logger.log('Data is received.');
    Logger.log(data);

    await this.appService.SendOtp(data);
  }

  @MessagePattern(SEND_PDF_MAIL)
  async sendPdf(@Payload() data: any) {
    Logger.log('Data is received.');
    Logger.log(data);

    await this.appService.SendPdf(data);
  }
}
