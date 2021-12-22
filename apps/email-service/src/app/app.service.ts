import { Injectable } from '@nestjs/common';
import * as postmark from 'postmark';
const client = new postmark.ServerClient(process.env.POSTMARK_TOKEN);

@Injectable()
export class AppService {
  // constructor() {}

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
    console.log('sending...');
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

  async SendPdf(data) {
    const payload = {
      Name: 'build.pdf',
      ContentType: 'text/pain',
    };

    const email = await client.sendEmailWithTemplate({
      From: data.from,
      To: data.to,
      TemplateAlias: data.TemplateAlias,
      TemplateModel: { ...data.TemplateModel, Attachments: [payload] },
    });
    console.log(email, 'email successfully.');
  }
}
