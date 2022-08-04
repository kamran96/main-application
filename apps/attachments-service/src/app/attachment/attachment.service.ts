import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as multer from 'multer';
import * as multerS3 from 'multer-s3';
import * as aws from 'aws-sdk';
import * as moment from 'moment';
import axios from 'axios';
import * as PdfPrinter from 'pdfmake/src/printer';
import * as fs from 'fs';
import * as path from 'path';
import { formatMoney } from 'accounting-js';
import * as puppeteer from 'puppeteer';
import { Attachment } from '../../schemas/attachment.schema';
import { IRequest } from '@invyce/interfaces';
import { Host } from '@invyce/global-constants';

const moneyFormatJs = (
  amount: number | string,
  currency = {
    name: 'United States dollar',
    code: 'USD',
    symbol: '$',
    id: null,
    symbolNative: '$',
  }
) => {
  return formatMoney(amount, {
    symbol: currency?.symbol,
    format: '%s %v ',
  });
};

const Capitalize = (sentance) => {
  return sentance
    ?.split(' ')
    .map((word, index) => {
      return word
        .toLowerCase()
        .replace(/\w/, (firstLetter) => firstLetter.toUpperCase());
    })
    .join(' ');
};

export const checkisPercentage = (val: string | number) => {
  const value = typeof val === 'string' ? val : val.toString();
  const splitedData = value?.split('%');
  if (splitedData.length === 2) {
    return {
      value: splitedData[0],
      isPercentage: true,
    };
  } else {
    return {
      value: value ? value : '0',
      isPercentage: false,
    };
  }
};

const CalculateDiscountPerItem = (value: number, percentage: number) => {
  return (percentage / 100) * value;
};

const totalDiscountInInvoice = (array, key, type) => {
  const discountArray = [];
  Array.isArray(array) &&
    array.length &&
    array.forEach((item) => {
      const keyItem = (item && item[key]) || '0';
      const v = checkisPercentage(keyItem);
      const priceAccessor =
        type === 'POE' ? item.purchasePrice : item.unitPrice;
      if (v.isPercentage) {
        const val = CalculateDiscountPerItem(
          priceAccessor,
          parseFloat(v.value)
        );
        discountArray.push(val * item.quantity);
      } else {
        const val = priceAccessor - priceAccessor + parseFloat(v.value);
        discountArray.push(val * item.quantity);
      }
    });

  return discountArray.length ? discountArray.reduce((a, b) => a + b) : 0;
};

const promises = fs.promises;

const spacesEndpoint: any = new aws.Endpoint('sgp1.digitaloceanspaces.com');
const s3 = new aws.S3({
  endpoint: spacesEndpoint,
  accessKeyId: '7HZDHJARFO3DENGQY6XP',
  secretAccessKey: 'lOoHek25WXG2V4x1iDINSzPkPMPG+oC3lCLOARWUt5o',
});

@Injectable()
export class AttachmentService {
  constructor(@InjectModel(Attachment.name) private attachmentModel) {}

  async FindAttachmentById(attachmentId) {
    return await this.attachmentModel.findById(attachmentId);
  }

  async fileUpload(req, res): Promise<any> {
    try {
      this.upload(req, res, async (error) => {
        if (error) {
          return res.status(404).json(`Failed to upload image file: ${error}`);
        }

        const { key, mimetype, size, location } = req.files[0];
        const attachment = new this.attachmentModel({
          name: key,
          mimeType: mimetype,
          fileSize: size,
          path: location,
          createdById: req.user.id,
          updatedById: req.user.id,
          status: 1,
        });

        await attachment.save();

        return res.status(201).json({
          message: 'Successfully uploaded attachment',
          attachment,
        });
      });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
  upload = multer({
    storage: multerS3({
      s3,
      bucket: 'invyce/attachments',
      acl: 'public-read',
      key: function (request, file, cb) {
        cb(null, `${Date.now().toString()} - ${file.originalname}`);
      },
    }),
  }).array('file', 1);

  async createPdf(body, req): Promise<any> {
    try {
      console.log('Starting: Generating PDF Process, Kindly wait ..');
      const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      const page = await browser.newPage();

      await page.setContent(body.html, { waitUntil: 'networkidle0' });
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

      console.log('Ending: Generating PDF Process');
      return pdf;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async attachmentByIds(attachmentIds) {
    return await this.attachmentModel.find({
      _id: { $in: attachmentIds.ids },
    });
  }

  async uploadPdf(location, pdf, req) {
    try {
      const data = await fs.createReadStream(location + '/' + pdf);

      const params = {
        Bucket: 'invyce/attachments',
        Key: pdf,
        Body: data,
        ACL: 'public-read',
      };

      const upload = await s3.upload(params).promise();

      const attachment = new this.attachmentModel({
        name: pdf,
        path: upload.Location,
        createdById: req.user.id,
        updatedById: req.user.id,
        status: 1,
      });

      await attachment.save();

      setTimeout(() => {
        promises.unlink(location + '/' + pdf).then(() => {
          console.log('File deleted successfully');
        });
      }, 10000);

      return attachment;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async pdfData(data, currency) {
    try {
      const newArr = [];
      const heading = [
        ['#', 'item', 'quantity', 'unit price', 'discount', 'tax', 'total'].map(
          (i) => i.toUpperCase()
        ),
      ];

      data.invoice_items.forEach((tr, index) => {
        const item = data.items.find((i) => i.id === tr.itemId);

        heading.push([
          index + 1,
          item?.name ? item?.name : '',
          tr.quantity,
          tr.unitPrice,
          tr.itemDiscount,
          tr.tax,
          tr.total,
        ]);
        newArr.push({
          sno: index + 1,
          item: item?.name ? item?.name : '',
          quantity: tr.quantity,
          unitPrice: moneyFormatJs(tr.unitPrice, currency || 'USD'),
          discount: tr.itemDiscount,
          saleTax: tr.tax,
          total: moneyFormatJs(tr.total, currency || 'USD'),
        });
      });

      const pdfArr = [...heading, ...newArr];

      return pdfArr;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async GeneratePdf(body, req: IRequest) {
    try {
      if (!req || !req.cookies) return null;
      const token = req?.cookies['access_token'];

      const { data } = body;

      const contact = {
        name: data?.contact?.name || '',
        country: data?.contact?.addresses[0]?.country || '',
        city: data?.contact?.addresses[0]?.city || '',
        postalCode: data?.contact?.addresses[0]?.postalCode || '',
      };

      let organizationDetails = {
        currency: {
          name: 'United States dollar',
          code: 'USD',
          symbol: '$',
          id: null,
          symbolNative: '$',
        },
        attachment: {
          path: '',
        },
        name: '',
        phoneNumber: '',
        email: '',
        website: '',
        address: {
          city: '',
          postalCode: '',
          country: '',
        },
      };

      const {
        data: { result },
      } = await axios.get(
        Host('users', `users/organization/${req.user.organizationId}`),
        {
          headers: {
            cookie: `access_token=${token}`,
          },
        }
      );

      if (result && result.name) {
        organizationDetails = { ...organizationDetails, ...result };
      }

      const defaultCurrency =
        organizationDetails.currency || organizationDetails?.currency !== null
          ? organizationDetails?.currency
          : {
              name: 'United States dollar',
              code: 'USD',
              symbol: '$',
              id: null,
              symbolNative: '$',
            };

      const contents = await this.pdfData(data, defaultCurrency);

      const tableStylesConfig = {
        th: {
          borderColor: ['#d3d3d3', '#d3d3d3', '#d3d3d3'],
          border: [0.1, true, true, false],
          bold: true,
          fontSize: 8,
          fillColor: '#efefef',
          margin: [3, 3],
        },
        td: {
          borderColor: ['#d3d3d3', '#d3d3d3', '#d3d3d3', '#d3d3d3'],
          border: [true, true, true, true],
        },
      };

      const [header] = contents;
      contents.splice(0, 1);
      const newRows = [
        header.map((item) => ({
          text: item,
          bold: true,
          ...tableStylesConfig.th,
        })),
        ...contents.map((c) => {
          return Array.prototype.map.call(c, function (i) {
            return {
              text: i,
              ...tableStylesConfig.td,
            };
          });
        }),
      ];

      const getBase64 = (url) => {
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

      const resp = await getBase64(organizationDetails.attachment.path);

      const rows = newRows.filter((item) => item.length !== 0);

      const calculatedDiscount = data?.invoice?.discount || 0;
      const itemsDiscount =
        (data &&
          totalDiscountInInvoice(
            data?.invoice.invoice_items,
            'itemDiscount',
            data?.invoice?.invoiceType
          )) ||
        0;

      const invoiceDiscount = calculatedDiscount - itemsDiscount;
      const totalTax =
        (data &&
          totalDiscountInInvoice(
            data?.invoice.invoice_items,
            'tax',
            data?.invoice?.invoiceType
          )) ||
        0;

      const calculations = [
        [
          { text: 'Subtotal', bold: true, fontSize: 10 },
          {
            text: moneyFormatJs(data?.invoice?.grossTotal, defaultCurrency),
            fontSize: 10,
            alignment: 'right',
          },
        ],
        [
          { text: 'Items Discount', bold: true, fontSize: 10 },
          {
            text: moneyFormatJs(itemsDiscount),
            fontSize: 10,
            alignment: 'right',
          },
        ],
        [
          { text: 'Invoice Discount', bold: true, fontSize: 10 },
          {
            text: moneyFormatJs(invoiceDiscount, defaultCurrency),
            fontSize: 10,
            alignment: 'right',
          },
        ],
        [
          { text: 'Tax Rates ', bold: true, fontSize: 10 },
          {
            text: moneyFormatJs(totalTax, defaultCurrency),
            fontSize: 10,
            alignment: 'right',
          },
        ],
        [
          {
            canvas: [
              {
                type: 'rect',
                x: 0,
                y: 0,
                w: 148,
                h: 0,
                lineWidth: 1,
                lineColor: 'black',
              },
            ],
          },
          {},
        ],
        [
          { text: 'Total', bold: true, fontSize: 12.4, margin: [0, 3] },
          {
            text: moneyFormatJs(data?.invoice?.netTotal, defaultCurrency),
            fontSize: 12.4,
            alignment: 'right',
            margin: [0, 3],
            bold: true,
          },
        ],
      ];

      let logoRender: any = {
        width: 50,
        margin: [0, 10, 0, 0],
      };

      if (resp) {
        logoRender = { ...logoRender, image: `data:image/png;base64,${resp}` };
      } else {
        logoRender = { ...logoRender, text: 'Logo Here' };
      }

      const docDefinition = {
        pageMargins: [0, 0, 0, 20],
        footer: function (currentPage, pageCount) {
          return {
            columns: [
              {
                text: `Reported generated on: ${moment(new Date()).format()}`,
                fontSize: 9,
                margin: [5, 0],
              },
              {
                text: `${currentPage.toString()} / ${pageCount}`,
                fontSize: 9,
                alignment: 'center',
              },
              {
                text: `Report generated by: ${req?.user?.profile?.fullName}`,
                alignment: 'right',
                fontSize: 9,
                margin: [5, 0],
              },
            ],
          };
        },
        content: [
          {
            style: 'section',
            table: {
              widths: ['50%', '50%'],

              body: [
                [
                  {
                    margin: [20, 30],
                    fillColor: '#F7FBFF',
                    columns: [
                      {
                        ...logoRender,
                      },
                      {
                        margin: [10, 0],
                        stack: [
                          {
                            text: Capitalize(
                              organizationDetails?.name
                                ? organizationDetails?.name
                                : ''
                            ),
                            style: 'c_name',
                          },
                          {
                            text:
                              organizationDetails?.phoneNumber !== null
                                ? organizationDetails.phoneNumber
                                : 'no phone number available',
                            style: 'address_style',
                          },
                          {
                            text:
                              organizationDetails?.email !== null
                                ? organizationDetails.email
                                : '',
                            style: 'address_style',
                          },
                          {
                            text:
                              organizationDetails?.website !== null
                                ? organizationDetails.website
                                : '',
                            style: 'address_style',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    margin: [20, 30],
                    fillColor: '#F7FBFF',
                    columns: [
                      {},
                      {
                        alignment: 'right',
                        stack: [
                          {
                            text: Capitalize(
                              organizationDetails?.address?.city !== null
                                ? organizationDetails.address.city
                                : ''
                            ),
                            style: 'address_style',
                          },
                          {
                            text:
                              organizationDetails?.address?.postalCode !== null
                                ? organizationDetails.address.postalCode
                                : '',
                            style: 'address_style',
                          },
                          {
                            text: Capitalize(
                              organizationDetails?.address?.country !== null
                                ? organizationDetails.address.country
                                : ''
                            ),
                            style: 'address_style',
                          },
                        ],
                      },
                    ],
                  },
                ],
              ],
            },
            layout: 'noBorders',
          },
          {
            //   text: "Example",
            fontSize: 15,
            margin: [15, 15],
            //   color: "#143c69",
            //   bold: true,
            columns: [
              {
                stack: [
                  { text: 'To', style: 'label' },
                  {
                    text: Capitalize(contact?.name),
                    style: 'data',
                  },
                  { text: 'Address', style: 'label' },
                  {
                    text: `${Capitalize(contact?.country)}, ${Capitalize(
                      contact?.city
                    )}, ${contact.postalCode}`,
                    style: 'data',
                  },
                ],
              },
              {
                stack: [
                  { text: 'Invoice Number', style: 'label' },
                  { text: data?.invoice?.invoiceNumber || '', style: 'data' },
                  { text: 'Reference', style: 'label' },
                  { text: data?.invoice?.reference || '', style: 'data' },
                  { text: 'Invoice Date', style: 'label' },
                  {
                    text: moment(data?.invoice?.issueDate || '').format(
                      'MM/DD/YYYY'
                    ),
                    style: 'data',
                  },
                ],
              },
              {
                stack: [
                  {
                    text: `Invoice of ${defaultCurrency?.code || ''}`,
                    alignment: 'right',
                    style: 'label',
                  },
                  {
                    text: moneyFormatJs(
                      data?.invoice?.netTotal || '',
                      defaultCurrency
                    ),
                    color: '#143c69',
                    bold: true,
                    fontSize: 20,
                    alignment: 'right',
                  },
                  { text: 'Due Date', alignment: 'right', style: 'label' },
                  {
                    text: moment(data?.invoice?.dueDate || '').format(
                      'MM/DD/YYYY'
                    ),
                    alignment: 'right',
                    style: 'data',
                  },
                ],
              },
            ],
          },
          {
            margin: [15, 0],

            //   layout: 'lightHorizontalLines', // optional
            table: {
              widths: ['5%', '*', '14%', '14%', '14%', '14%', '14%'],

              //  widths: ['10%', '*' , '100%'],
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers

              body: rows,
            },
          },

          {
            columns: [
              {},
              {
                // alignment: 'right',
                width: '40%',
                margin: [15, 15],
                layout: 'noBorders',

                table: {
                  widths: ['60%', '*'],
                  body: calculations,
                },
              },
            ],
          },
        ],

        styles: {
          label: {
            fontSize: 10,
            color: '#6f6f84',
            margin: [0, 5, 0, 0],
          },
          data: {
            fontSize: 10.5,
            bold: true,
            color: '#272727',
            margin: [0, 2.4, 0, 0],
          },
          c_name: {
            fontSize: 24,
            color: '#143c69',
            bold: true,
          },
          address_style: {
            fontSize: 12,
            margin: [0, 2],
            color: '#6f6f84',
          },
        },
        defaultStyle: {
          font: 'RobotoSlab',
        },
      };

      let fonts;
      if (
        process.env['NODE' + '_ENV'] === 'production' ||
        process.env['NODE' + '_ENV'] === 'staging'
      ) {
        fonts = {
          RobotoSlab: {
            normal: path.resolve('./assets/fonts/RobotoSlab-Regular.ttf'),
            bold: path.resolve('./assets/fonts/RobotoSlab-Bold.ttf'),
          },
        };
      } else {
        fonts = {
          RobotoSlab: {
            normal: path.resolve(
              './apps/attachments-service/src/assets/fonts/RobotoSlab-Regular.ttf'
            ),
            bold: path.resolve(
              './apps/attachments-service/src/assets/fonts/RobotoSlab-Bold.ttf'
            ),
          },
        };
      }

      const printer = new PdfPrinter(fonts);
      const doc = printer.createPdfKitDocument(docDefinition);

      const pdf = `${data?.type}-${Date.now()}.pdf`;
      const pdfPath = path.resolve('generated');

      doc.pipe(await fs.createWriteStream(pdfPath + '/' + pdf));
      doc.end();

      return pdf;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
