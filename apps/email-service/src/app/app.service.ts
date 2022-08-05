import { Injectable } from '@nestjs/common';
import * as postmark from 'postmark';
import * as path from 'path';
import * as fs from 'fs';
import axios from 'axios';

const client = new postmark.ServerClient(process.env.POSTMARK_TOKEN);

@Injectable()
export class AppService {
  // constructor() {}

  getData(): { message: string } {
    return { message: 'Welcome to contacts!' };
  }

  async SendInvitation(data) {
    const TemplateModel = {
      user_name: data.user_name,
      name: data.name,
      action_url: data.action_url,
    };

    const email = await client.sendEmailWithTemplate({
      From: 'no-reply@invyce.com',
      To: data.to,
      TemplateAlias: 'user-is-invited',
      TemplateModel: TemplateModel,
    });
    console.log(email, 'email successfully.');
  }

  async TrialStarted(data) {
    const TemplateModel = {
      product_url: 'product_url_Value',
      sender_name: 'Zeeshan',
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
      TemplateAlias: 'trial-started',
      TemplateModel: TemplateModel,
    });
    console.log(email, 'email successfully.');
  }

  async SendForgotPassword(data) {
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

  async OrganizationCreated(data) {
    const TemplateModel = {
      product_url: '',
      product_name: 'invyce',
      user_name: data.user_name,
      org_name: data.org_name,

      // browser_name: browser.name,
      support_url: 'support@invyce.com',
      company_name: 'invyce',
      company_address: 'ZS plaza jutial giltit, Pakistan',
    };

    const email = await client.sendEmailWithTemplate({
      From: 'no-reply@invyce.com',
      To: data.to,
      TemplateAlias: 'adding-new-organization',
      TemplateModel: TemplateModel,
    });
    console.log(email, 'email successfully.');
  }

  async PasswordUpdated(data) {
    const TemplateModel = {
      user_name: data.user_name,
      link: data.link,
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

  async ChangeEmailOtp(data) {
    const TemplateModel = {
      user_name: data.user_name,
      otp_link: data.otp_link,
    };

    const email = await client.sendEmailWithTemplate({
      From: 'no-reply@invyce.com',
      To: data.to,
      TemplateAlias: 'otp-for-email-change',
      TemplateModel: TemplateModel,
    });
    console.log(email, 'email successfully.');
  }

  async ChangePasswordOtp(data) {
    const TemplateModel = {
      user_name: data.user_name,
      otp_link: data.otp_link,
    };

    const email = await client.sendEmailWithTemplate({
      From: 'no-reply@invyce.com',
      To: data.to,
      TemplateAlias: 'otp-password-change',
      TemplateModel: TemplateModel,
    });
    console.log(email, 'email successfully.');
  }

  async EmailChanged(data) {
    const TemplateModel = {
      user_name: data.user_name,
      user_new_email: data.user_new_email,
    };

    const email = await client.sendEmailWithTemplate({
      From: 'no-reply@invyce.com',
      To: data.to,
      TemplateAlias: 'email-changed-confirmation',
      TemplateModel: TemplateModel,
    });
    console.log(email, 'email successfully.');
  }

  async TrailExpiringIn5Days(data) {
    const email = await client.sendEmailWithTemplate({
      From: data.from,
      To: data.to,
      TemplateAlias: data.TemplateAlias,
      TemplateModel: data.TemplateModel,
    });
    console.log(email, 'email successfully.');
  }

  async TrailExpiringIn2Days(data) {
    const email = await client.sendEmailWithTemplate({
      From: data.from,
      To: data.to,
      TemplateAlias: data.TemplateAlias,
      TemplateModel: data.TemplateModel,
    });
    console.log(email, 'email successfully.');
  }

  async TrailExpiringIn24Hours(data) {
    const email = await client.sendEmailWithTemplate({
      From: data.from,
      To: data.to,
      TemplateAlias: data.TemplateAlias,
      TemplateModel: data.TemplateModel,
    });
    console.log(email, 'email successfully.');
  }

  async DidNotSendInvoiceInLast7Days(data) {
    const email = await client.sendEmailWithTemplate({
      From: data.from,
      To: data.to,
      TemplateAlias: data.TemplateAlias,
      TemplateModel: data.TemplateModel,
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

    const TemplateModel = {
      user_name: data.user_name,
      invoiceNumber: data.invoiceNumber,
      issueDate: data.issueDate,
      gross_total: data.gross_total,
      itemDisTotal: data.itemDisTotal,
      net_total: data.net_total,
      invoice_details: data.invoice_details,
    };

    const email = await client.sendEmailWithTemplate({
      From: 'no-reply@invyce.com',
      To: data.to,
      TemplateAlias: 'bill-created',
      TemplateModel: { ...TemplateModel, Attachments: [payload] },
    });
    console.log(email, 'email successfully.');
  }

  async BillCreated(data) {
    const dist = path.resolve(data.attachment_name);
    const content = fs.readFileSync(dist);

    const TemplateModel = { ...data };
    const payload = {
      Name: data.attachment_name,
      ContentType: 'text/pain',
      Content: Buffer.from(content).toString('base64'),
      ContentID: data.attachment_name,
    };

    setTimeout(async () => {
      const email = await client.sendEmailWithTemplate({
        From: 'no-reply@invyce.com',
        To: data.to,
        TemplateAlias: 'bill-created',
        TemplateModel: TemplateModel,
        Attachments: [payload],
      });
      console.log(email, 'email successfully.');
    }, 5000);
  }

  async BillUpdated(data) {
    const TemplateModel = {
      ...data,
    };

    const email = await client.sendEmailWithTemplate({
      From: 'no-reply@invyce.com',
      To: data.to,
      TemplateAlias: 'bill-updated',
      TemplateModel: TemplateModel,
    });
    console.log(email, 'email successfully.');
  }

  async POCreated(data) {
    const getBase64 = async (url) => {
      if (!url) {
        return url;
      } else {
        return axios
          .get(url, {
            responseType: 'arraybuffer',
          })
          .then((response) =>
            Buffer.from(response.data, 'binary').toString('base64')
          );
      }
    };

    delete data.location;

    const TemplateModel = { ...data };
    const payload = {
      Name: data.attachment_name,
      ContentType: 'text/pain',
      Content: await getBase64(data.download_link),
      ContentID: data.download_link,
    };

    setTimeout(async () => {
      const email = await client.sendEmailWithTemplate({
        From: 'no-reply@invyce.com',
        To: data.to,
        TemplateAlias: 'purchase-order-template',
        TemplateModel: TemplateModel,
        Attachments: [payload],
        Cc: data.cc,
        Bcc: data.bcc,
      });
      console.log(email, 'email successfully.');
    }, 5000);
  }

  async InvoiceCreated(data) {
    const getBase64 = async (url) => {
      if (!url) {
        return url;
      } else {
        return axios
          .get(url, {
            responseType: 'arraybuffer',
          })
          .then((response) =>
            Buffer.from(response.data, 'binary').toString('base64')
          );
      }
    };

    delete data.location;

    const TemplateModel = { ...data };
    const payload = {
      Name: data.attachment_name,
      ContentType: 'text/pain',
      Content: await getBase64(data.download_link),
      ContentID: data.download_link,
    };

    setTimeout(async () => {
      const email = await client.sendEmailWithTemplate({
        From: 'no-reply@invyce.com',
        To: data.to,
        TemplateAlias: 'invoice-has-been-created',
        TemplateModel: TemplateModel,
        Attachments: [payload],
        Cc: data.cc,
        Bcc: data.bcc,
      });
      console.log(email, 'email successfully.');
    }, 5000);
  }

  async InvoiceUpdated(data) {
    const TemplateModel = { ...data };

    const email = await client.sendEmailWithTemplate({
      From: 'no-reply@invyce.com',
      To: data.to,
      TemplateAlias: 'invoice-has-been-updated',
      TemplateModel: TemplateModel,
    });
    console.log(email, 'email successfully.');
  }
}
