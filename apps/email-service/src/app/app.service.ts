import { Injectable } from '@nestjs/common';
import * as postmark from 'postmark';
const client = new postmark.Client(process.env.POSTMARK_TOKEN);

@Injectable()
export class AppService {
  constructor() {}

  async SendEmail(data) {
    await client.sendEmailWithTemplate({
      From: 'zeeshan@invyce.com',
      To: 'zeeshan@invyce.com',
      TemplateAlias: data.TemplateAlias,
      TemplateModel: data.TemplateModel,
    });
  }
}
