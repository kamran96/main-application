import { HttpException, HttpStatus } from '@nestjs/common';
import * as fs from 'fs';
import * as moment from 'moment';
import { EmailService } from './email.service';
const PdfPrinter = require('pdfmake/src/printer');

export class PdfService {
  constructor() {}

  async GeneratePdf(contents) {
    try {
      const [header] = contents;
      contents.splice(0, 1);
      const newRows = [
        header.map(item => ({ text: item, bold: true, fontSize: 8 })),
        ...contents.map(c => {
          return Array.prototype.map.call(c, function(i) {
            return {
              text: i,
              fontSize: 9,
              fillColor: contents[0] % 2 === 0 ? '#eee' : '#fff',
            };
          });
        }),
      ];

      const rows = newRows.filter(item => item.length !== 0);

      let docDefinition = {
        header: {
          text: 'Yaraan Co-operation Ltd.',
          alignment: 'center',
          marginTop: 20,
          bold: true,
        },
        content: [
          {
            text: `Sale Invoice Summary Report.
                     ${moment(contents.created_at).format('MMMM Do YYYY')}`,
            alignment: 'center',
            fontSize: 9,
            marginBottom: 10,
          },
          {
            layout: 'lightHorizontalLines', // optional
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 1,
              // widths: [100, "auto", 100, "auto"],

              body: rows,
            },
          },
        ],
        defaultStyle: {
          font: 'Helvetica',
        },
      };

      const fonts = {
        Courier: {
          normal: 'Courier',
          bold: 'Courier-Bold',
          italics: 'Courier-Oblique',
          bolditalics: 'Courier-BoldOblique',
        },
        Helvetica: {
          normal: 'Helvetica',
          bold: 'Helvetica-Bold',
          italics: 'Helvetica-Oblique',
          bolditalics: 'Helvetica-BoldOblique',
        },
        Times: {
          normal: 'Times-Roman',
          bold: 'Times-Bold',
          italics: 'Times-Italic',
          bolditalics: 'Times-BoldItalic',
        },
        Symbol: {
          normal: 'Symbol',
        },
        ZapfDingbats: {
          normal: 'ZapfDingbats',
        },
      };

      const printer = new PdfPrinter(fonts);
      const doc = printer.createPdfKitDocument(docDefinition);

      doc.pipe(fs.createWriteStream('download.pdf'));

      doc.end();
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
