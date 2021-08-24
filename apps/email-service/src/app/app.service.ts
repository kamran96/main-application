import { Injectable } from '@nestjs/common';
import * as postmark from 'postmark';
const client = new postmark.Client(process.env.POSTMARK_TOKEN);

@Injectable()
export class AppService {
  async SendEmail(data) {
    client.sendEmail({
      From: 'zeeshan@invyce.com',
      To: 'zeeshan@invyce.com',
      Subject: 'Test',
      TextBody: 'Test message',
    });
  }
}
