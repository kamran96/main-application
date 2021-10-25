import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import axios from 'axios';
import { ClientProxy } from '@nestjs/microservices';
import { SEND_PDF_MAIL } from '@invyce/send-email';

@Injectable()
export class AppService {
  constructor(
    @Inject('EMAIL_SERVICE') private readonly emailService: ClientProxy
  ) {}

  getData(): { message: string } {
    return { message: 'Welcome to exports-service!' };
  }

  async generatePdf(data, req) {
    try {
      console.log('Starting: Generating PDF Process, Kindly wait ..');
      const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      const page = await browser.newPage();

      await page.setContent(data.html, { waitUntil: 'networkidle0' });
      // const html = `<div style="font-size: 9px; text-align: right; width: 100%; position: fixed; bottom: 8px; right: 8px; color: gray;"><span class="pageNumber"></span>/<span class="totalPages"></span></div>`;
      const pdf = await page.pdf({
        format: 'A4',
        displayHeaderFooter: false,
        printBackground: true,
        // footerTemplate: html,
        margin: {
          bottom: '8px',
        },
      });

      await browser.close();

      fs.writeFileSync('./build.pdf', pdf);

      let invoice_arr = [];
      if (data?.id) {
        let token;
        if (process.env.NODE_ENV === 'development') {
          const header = req.headers?.authorization?.split(' ')[1];
          token = header;
        } else {
          if (!req || !req.cookies) return null;
          token = req.cookies['access_token'];
        }

        const type =
          process.env.NODE_ENV === 'development' ? 'Authorization' : 'cookie';
        const value =
          process.env.NODE_ENV === 'development'
            ? `Bearer ${token}`
            : `access_token=${token}`;

        if (data?.type === 'SI') {
          const invoiceId = data?.id;

          const request: any = {
            url: `http://localhost/invoices/invoice/${invoiceId}`,
            method: 'GET',
            headers: {
              [type]: value,
            },
          };

          const { data: invoice } = await axios(request);
          invoice_arr.push(invoice);
        }
      }

      let invoice = { ...invoice_arr[0].result };
      delete invoice.invoiceItems;
      delete invoice.contact;

      const payload = {
        to: data.email,
        from: 'no-reply@invyce.com',
        message: data.email,
        subject: data.email,
        cc: data.email,
        bcc: data.email,
        TemplateAlias: 'invoice',
        TemplateModel: {
          ...invoice,
          contactName: invoice_arr[0].result.contact.name,
          invoice_details: invoice_arr[0].result.invoiceItems?.map(
            (item, index) => {
              return {
                ...item,
                itemName: item?.item?.name,
                price: item?.unitPrice,
              };
            }
          ),
        },
      };

      await this.emailService.emit(SEND_PDF_MAIL, payload);

      console.log('Ending: Generating PDF Process');
      return true;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
