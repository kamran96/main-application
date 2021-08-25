import { Injectable } from '@nestjs/common';
import * as postmark from 'postmark';
const client = new postmark.Client(process.env.POSTMARK_TOKEN);

@Injectable()
export class AppService {
  constructor() {}

  async SendEmail(data) {
    client.sendEmailWithTemplate({
      From: 'zeeshan@invyce.com',
      To: 'zeesan@invyce.com',
      TemplateAlias: data.TemplateAlias,
      TemplateModel: data.TemplateModel,
    });
  }
}
