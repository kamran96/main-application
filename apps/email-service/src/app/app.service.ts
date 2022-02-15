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

  async TrailStarted(data) {
    const TemplateModel = {
      product_url: 'product_url_Value',
      sender_name: 'sender_name_Value',
      product_name: 'product_name_Value',
      user_name: data.user_name,
      congrates_illustration_image: 'congrates_illustration_image_Value',
      action_url: 'action_url_Value',
      trial_extension_url: 'trial_extension_url_Value',
      feedback_url: 'feedback_url_Value',
      export_url: 'export_url_Value',
      close_account_url: 'close_account_url_Value',
      company_name: 'company_name_Value',
      company_address: 'company_address_Value',
    };

    const email = await client.sendEmailWithTemplate({
      From: 'no-reply@invyce.com',
      To: data.to,
      TemplateAlias: 'trail-started',
      TemplateModel: TemplateModel,
    });
    console.log(email, 'email successfully.');
  }

  async SendForgotPassword(data) {
    console.log('sending...');

    const TemplateModel = {
      product_url: '',
      product_name: 'invyce',
      user_name: data.user_name,
      user_email: data.user_email,
      link: data.link,
      operating_system: data.operating_system,
      // browser_name: browser.name,
      support_url: 'support@invyce.com',
      company_name: 'invyce',
      company_address: 'ZS plaza jutial giltit, Pakistan',
    };

    const email = await client.sendEmailWithTemplate({
      From: 'no-reply@invyce.com',
      To: data.to,
      TemplateAlias: 'password-reset',
      TemplateModel: TemplateModel,
    });
    console.log(email, 'email successfully.');
  }

  async PasswordUpdated(data) {
    console.log('sending...');

    const TemplateModel = {
      user_name: data.user_name,
    };

    const email = await client.sendEmailWithTemplate({
      From: 'no-reply@invyce.com',
      To: data.to,
      TemplateAlias: 'password-update',
      TemplateModel: TemplateModel,
    });
    console.log(email, 'email successfully.');
  }

  async SendOtp(data) {
    const TemplateModel = {
      user_name: data.user_name,
      otp_link: data.otp_link,
    };

    const email = await client.sendEmailWithTemplate({
      From: 'no-reply@invyce.com',
      To: data.to,
      TemplateAlias: 'register-otp',
      TemplateModel: TemplateModel,
    });
    console.log(email, 'email successfully.');
  }

  async SuspendAccount(data) {
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
