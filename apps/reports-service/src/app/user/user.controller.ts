import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { INVOICE_CREATED } from '@invyce/send-email';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @MessagePattern(INVOICE_CREATED)
  async InvoiceCreated(@Payload() data) {
    Logger.log('Data is received.');
    Logger.log(data);

    return await this.userService.InvoiceCreated(data);
  }
}
