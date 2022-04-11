import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import * as Nodemailer from 'nodemailer';
import { TransportOptions } from 'nodemailer';

@Injectable()
export class EmailService {
  server: any;
  state: any;
  constructor() {
    // setup email client isntances.
    AWS.config.update({
      accessKeyId: 'AKIA6IHPK7IT4IMICL47',
      secretAccessKey: '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',
      region: 'ap-northeast-1',
    });

    this.server = Nodemailer.createTransport(<TransportOptions>{
      SES: new AWS.SES(),
    });

    this.state = {
      to: '',
      from: 'no-reply@invyce.com',
      subject: '',
      attachments: [],
      template: '',
      html: '',
    };
  }
  to(email: string) {
    this.state.to = email;
  }
  compose(
    to: string,
    subject: string,
    html: string,
    from: string = '',
    template: string = null,
    attachments: any[] = [],
    cc: any[] = [],
    bcc: any[] = []
  ) {
    this.state.to = to;
    this.state.subject = subject;
    this.state.html = html;
    this.state.template = template;
    this.state.attachments = attachments;
    this.state.cc = cc;
    this.state.bcc = bcc;

    if (from !== '') {
      this.state.from = from;
    }
    return this;
  }

  setTemplate(template: string) {
    this.state.template = template;
  }

  attachments(attachments: any[]) {
    this.state.attachments = attachments;
  }

  cc(cc: any[]) {
    this.state.cc = cc;
  }
  bcc(bcc: any[]) {
    this.state.bcc = bcc;
  }

  async send() {
    const response = await this.server.sendMail({
      to: this.state.to,
      from: this.state.from,
      subject: this.state.subject,
      html: this.state.html,
      attachments: this.state.attachments,
      cc: this.state.cc,
      bcc: this.state.bcc,
    });
  }
}
