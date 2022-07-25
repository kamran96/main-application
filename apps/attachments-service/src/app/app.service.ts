import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  async getData() {
    return { message: 'Welcome to attachments-service!' };
  }
}
