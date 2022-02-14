import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { USER_CREATED, ORGANIZATION_CREATED } from '@invyce/send-email';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @MessagePattern(USER_CREATED)
  async CreateUser(@Payload() data) {
    Logger.log('Data is received.');
    Logger.log(data);

    return await this.userService.CreateUser(data);
  }

  @MessagePattern(ORGANIZATION_CREATED)
  async CreateOrganization(@Payload() data) {
    Logger.log('Data is received.');
    Logger.log(data);

    return await this.userService.CreateOrganization(data);
  }
}
