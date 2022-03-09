import { Controller, Get, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { AppService } from './app.service';
import {
  SEND_OTP,
  SEND_FORGOT_PASSWORD,
  SEND_INVITATION,
  SEND_PDF_MAIL,
  CONTACT_CREATED,
  TRAIL_STARTED,
  PASSWORD_UPDATED,
  SUSPEND_ACCOUNT,
  ORGANIZATION_CREATED,
  CHANGE_EMAIL_OTP,
  EMAIL_CHANGED,
  BILL_CREATED,
  INVOICE_CREATED,
} from '@invyce/send-email';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async GetData() {
    return await this.appService.getData();
  }

  @MessagePattern(CONTACT_CREATED)
  async CreateContact(@Payload() data) {
    Logger.log('Data is received.');
    Logger.log(data, 'from emails');
  }

  @MessagePattern(SEND_INVITATION)
  async sendInvitation(@Payload() data: any) {
    Logger.log('Data is received.');
    Logger.log(data);

    await this.appService.SendInvitation(data);
  }

  @MessagePattern(TRAIL_STARTED)
  async trialStarted(@Payload() data: any) {
    Logger.log('Data is received.');
    Logger.log(data);

    await this.appService.TrialStarted(data);
  }

  @MessagePattern(SEND_FORGOT_PASSWORD)
  async sendForgotPassword(@Payload() data: any) {
    Logger.log('Data is received.');
    Logger.log(data);

    await this.appService.SendForgotPassword(data);
  }

  @MessagePattern(PASSWORD_UPDATED)
  async passwordUpdated(@Payload() data: any) {
    Logger.log('Data is received.');
    Logger.log(data);

    await this.appService.PasswordUpdated(data);
  }

  @MessagePattern(CHANGE_EMAIL_OTP)
  async changeEmailOtp(@Payload() data: any) {
    Logger.log('Data is received.');
    Logger.log(data);

    await this.appService.ChangeEmailOtp(data);
  }

  @MessagePattern(EMAIL_CHANGED)
  async emailChanged(@Payload() data: any) {
    Logger.log('Data is received.');
    Logger.log(data);

    await this.appService.EmailChanged(data);
  }

  @MessagePattern(SUSPEND_ACCOUNT)
  async suspendAccount(@Payload() data: any) {
    Logger.log('Data is received.');
    Logger.log(data);

    await this.appService.SuspendAccount(data);
  }

  @MessagePattern(ORGANIZATION_CREATED)
  async organizationCreated(@Payload() data: any) {
    Logger.log('Data is received.');
    Logger.log(data);

    await this.appService.OrganizationCreated(data);
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

  @MessagePattern(BILL_CREATED)
  async billCreated(@Payload() data: any) {
    Logger.log('Data is received.');
    Logger.log(data);

    await this.appService.BillCreated(data);
  }

  @MessagePattern(INVOICE_CREATED)
  async invoiceCreated(@Payload() data: any) {
    Logger.log('Data is received.');
    Logger.log(data);

    await this.appService.InvoiceCreated(data);
  }
}
