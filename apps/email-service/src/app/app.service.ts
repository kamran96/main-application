import { Injectable } from '@nestjs/common';
import * as postmark from 'postmark';
const client = new postmark.ServerClient(
  'c2afabc2-c521-4a0f-9957-dbba1be9f943'
);

@Injectable()
export class AppService {
  constructor() {}

  async SendInvitation(data) {
    const email = await client.sendEmailWithTemplate({
      From: data.from,
      To: data.to,
      TemplateAlias: data.TemplateAlias,
      TemplateModel: data.TemplateModel,
    });
    console.log(email, 'email successfully.');
  }

  async SendForgotPassword(data) {
    const email = await client.sendEmailWithTemplate({
      From: data.from,
      To: data.to,
      TemplateAlias: data.TemplateAlias,
      TemplateModel: data.TemplateModel,
    });
    console.log(email, 'email successfully.');
  }
}
