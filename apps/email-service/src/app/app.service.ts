import { Injectable } from '@nestjs/common';
import * as postmark from 'postmark';
const client = new postmark.ServerClient(process.env.POSTMARK_TOKEN);

@Injectable()
export class AppService {
  constructor() {}

  getData(): { message: string } {
    return { message: 'Welcome to contacts!' };
  }

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
  async SendOtp(data) {
    const email = await client.sendEmailWithTemplate({
      From: data.from,
      To: data.to,
      TemplateAlias: data.TemplateAlias,
      TemplateModel: data.TemplateModel,
    });
    console.log(email, 'email successfully.');
  }
}
