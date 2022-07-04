import { Controller, Get, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CONTACT_CREATED, USER_CREATED } from '@invyce/send-email';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @MessagePattern(CONTACT_CREATED)
  async CreateContact(@Payload() data) {
    Logger.log('Data is received.');
    Logger.log(data);

    return await this.appService.CreateContact(data);
  }
}
