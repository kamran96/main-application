import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import {
  Between,
  getCustomRepository,
  ILike,
  In,
  LessThan,
  Not,
  Raw,
} from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import axios from 'axios';
import * as dotenv from 'dotenv';
import * as moment from 'moment';
import { InvoiceRepository } from '../repositories/invoice.repository';
import { InvoiceItemRepository } from '../repositories/invoiceItem.repository';
import { Sorting } from '@invyce/sorting';
import { BillRepository } from '../repositories/bill.repository';
import { CreditNoteRepository } from '../repositories/creditNote.repository';
import { CreditNoteItemRepository } from '../repositories/creditNoteItem.repository';
import {
  IBaseUser,
  IPage,
  IRequest,
  IInvoice,
  IInvoiceWithResponse,
} from '@invyce/interfaces';
import {
  EntryType,
  Host,
  Integrations,
  InvTypes,
  PaymentModes,
  PdfType,
  Statuses,
  ToTitleCase,
  XeroTypes,
} from '@invyce/global-constants';
import { BillItemRepository } from '../repositories/billItem.repository';
import { InvoiceDto, InvoiceIdsDto } from '../dto/invoice.dto';
import {
  CREATE_CONTACT_LEDGER,
  INVOICE_CREATED,
  INVOICE_UPDATED,
  PO_CREATED,
  SEND_FORGOT_PASSWORD,
} from '@invyce/send-email';
import { PurchaseOrderRepository } from '../repositories/purchaseOrder.repository';
import { QuotationRepository } from '../repositories/quotation.repository';
import { PurchaseOrderItemRepository } from '../repositories/purchaseOrderItem.repository';

dotenv.config();

@Injectable()
export class InvoiceService {
  constructor(
    @Inject('EMAIL_SERVICE') private readonly emailService: ClientProxy,
    @Inject('REPORT_SERVICE') private readonly reportService: ClientProxy
  ) {}
  async IndexInvoice(
    req: IRequest,
    queryData: IPage
  ): Promise<IInvoiceWithResponse> {
    const { page_no, page_size, invoice_type, type, status, sort, query } =
      queryData;

    if (!req || !req.cookies) return null;
    const token = req?.cookies['access_token'];

    const ps: number = parseInt(page_size);
    const pn: number = parseInt(page_no);
    let invoices;
    let total;

    const { sort_column, sort_order } = await Sorting(sort);

    total = await getCustomRepository(InvoiceRepository).count({
      status,
      organizationId: req.user.organizationId,
      branchId: req.user.branchId,
      invoiceType: invoice_type,
    });

    const invoice_arr = [];
    if (query) {
      const filterData = Buffer.from(query, 'base64').toString();
      const data = JSON.parse(filterData);

      for (const i in data) {
        if (data[i].type === 'search') {
          const val = data[i].value?.split('%')[1].toLowerCase();

          invoices = await getCustomRepository(InvoiceRepository).find({
            where: {
              status: 1,
              branchId: req.user.branchId,
              organizationId: req.user.organizationId,
              [i]: Raw((alias) => `LOWER(${alias}) ILike '%${val}%'`),
            },
            skip: pn * ps - ps,
            take: ps,
            order: {
              [sort_column]: sort_order,
            },
            relations: ['invoiceItems'],
          });

          total = await getCustomRepository(InvoiceRepository).count({
            status,
            organizationId: req.user.organizationId,
            branchId: req.user.branchId,
            invoiceType: invoice_type,
            [i]: Raw((alias) => `LOWER(${alias}) ILike '%${val}%'`),
          });
        } else if (data[i].type === 'compare') {
          invoices = await getCustomRepository(InvoiceRepository).find({
            where: {
              status: 1,
              branchId: req.user.branchId,
              organizationId: req.user.organizationId,
              [i]: In(data[i].value),
            },
            skip: pn * ps - ps,
            take: ps,
            order: {
              [sort_column]: sort_order,
            },
            relations: ['invoiceItems'],
          });

          total = await getCustomRepository(InvoiceRepository).count({
            status,
            organizationId: req.user.organizationId,
            branchId: req.user.branchId,
            invoiceType: invoice_type,
            [i]: In(data[i].value),
          });
        } else if (data[i].type === 'date-between') {
          const start_date = data[i].value[0];
          const end_date = data[i].value[1];
          const add_one_day = moment(end_date, 'YYYY-MM-DD')
            .add(1, 'day')
            .format();

          invoices = await getCustomRepository(InvoiceRepository).find({
            where: {
              status: 1,
              organizationId: req.user.organizationId,
              branchId: req.user.branchId,
              [i]: Between(start_date, add_one_day),
            },
            skip: pn * ps - ps,
            take: ps,
            order: {
              [sort_column]: sort_order,
            },
            relations: ['invoiceItems'],
          });

          total = await getCustomRepository(InvoiceRepository).count({
            status,
            organizationId: req.user.organizationId,
            branchId: req.user.branchId,
            invoiceType: invoice_type,
            [i]: Between(start_date, add_one_day),
          });
        }

        return {
          result: invoices,
          pagination: {
            total,
            total_pages: Math.ceil(total / ps),
            page_size: ps || 20,
            // page_total: null,
            page_no: pn,
            sort_column: sort_column,
            sort_order: sort_order,
          },
        };
      }
    } else {
      if (type === 'ALL') {
        invoices = await getCustomRepository(InvoiceRepository).find({
          where: {
            status: status,
            invoiceType: invoice_type,
            branchId: req.user.branchId,
            organizationId: req.user.organizationId,
          },
          skip: pn * ps - ps,
          take: ps,
          order: {
            [sort_column]: sort_order,
          },
          relations: ['invoiceItems'],
        });

        const mapInvoiceIds = invoices.map((inv) => inv.id);

        const { data: balances } = await axios.post(
          Host('payments', 'payments/payment/invoice'),
          {
            ids: mapInvoiceIds,
            type: 'INVOICE',
          },
          {
            headers: {
              cookie: `access_token=${token}`,
            },
          }
        );

        for (const i of invoices) {
          const balance = balances.find((bal) => bal.id === i.id);

          const due_amount =
            balance?.invoice?.credit_notes !== 0
              ? balance?.invoice?.credits -
                balance?.invoice?.credit_notes -
                balance?.invoice?.payment
              : balance?.invoice?.balance;
          const paid_amount = balance?.invoice?.payment;

          const payment_status = () => {
            if (paid_amount < due_amount && due_amount < i?.netTotal) {
              return 'Partial Payment';
            } else if (due_amount === i?.netTotal) {
              return 'Payment Pending';
            } else if (paid_amount === i?.netTotal) {
              return 'Full Payment';
            } else {
              return null;
            }
          };

          invoice_arr.push({
            ...i,
            paid_amount: paid_amount || 0,
            due_amount: due_amount || 0,
            payment_status: payment_status(),
          });
        }
      } else if (type === 'AWAITING_PAYMENT') {
        invoices = await getCustomRepository(InvoiceRepository).find({
          where: {
            status: status,
            invoiceType: invoice_type,
            branchId: req.user.branchId,
            organizationId: req.user.organizationId,
          },
          skip: pn * ps - ps,
          take: ps,
          order: {
            [sort_column]: sort_order,
          },
          relations: ['invoiceItems'],
        });

        const mapInvoiceIds = invoices.map((inv) => inv.id);

        const { data: balances } = await axios.post(
          Host('payments', 'payments/payment/invoice'),
          {
            ids: mapInvoiceIds,
            type: 'INVOICE',
          },
          {
            headers: {
              cookie: `access_token=${token}`,
            },
          }
        );

        for (const i of invoices) {
          const balance = balances.find((bal) => bal.id === i.id);

          const due_amount =
            balance.invoice.credit_notes !== 0
              ? balance.invoice.credits -
                balance.invoice.credit_notes -
                balance.invoice.payment
              : balance.invoice.balance;
          const paid_amount = balance.invoice.payment;

          const payment_status = () => {
            if (paid_amount < due_amount && due_amount < i?.netTotal) {
              return 'Partial Payment';
            } else if (due_amount === i?.netTotal) {
              return 'Payment Pending';
            } else if (paid_amount === i?.netTotal) {
              return 'Full Payment';
            } else {
              return null;
            }
          };

          if (balance.invoice.balance !== 0) {
            invoice_arr.push({
              ...i,
              paid_amount: paid_amount || 0,
              due_amount: due_amount || 0,
              payment_status: payment_status(),
            });
          }
        }
      } else if (type === 'PAID') {
        invoices = await getCustomRepository(InvoiceRepository).find({
          where: {
            status: status,
            invoiceType: invoice_type,
            organizationId: req.user.organizationId,
            branchId: req.user.branchId,
          },
          skip: pn * ps - ps,
          take: ps,
          order: {
            [sort_column]: sort_order,
          },
          relations: ['invoiceItems'],
        });

        const mapInvoiceIds = invoices.map((inv) => inv.id);

        const { data: balances } = await axios.post(
          Host('payments', 'payments/payment/invoice'),
          {
            ids: mapInvoiceIds,
            type: 'INVOICE',
          },
          {
            headers: {
              cookie: `access_token=${token}`,
            },
          }
        );

        for (const i of invoices) {
          const balance = balances.find((bal) => bal.id === i.id);

          const due_amount =
            balance.invoice.credit_notes !== 0
              ? balance.invoice.credits -
                balance.invoice.credit_notes -
                balance.invoice.payment
              : balance.invoice.balance;
          const paid_amount = balance.invoice.payment;

          const payment_status = () => {
            if (paid_amount < due_amount && due_amount < i?.netTotal) {
              return 'Partial Payment';
            } else if (due_amount === i?.netTotal) {
              return 'Payment Pending';
            } else if (paid_amount === i?.netTotal) {
              return 'Full Payment';
            } else {
              return null;
            }
          };
          if (paid_amount) {
            invoice_arr.push({
              ...i,
              paid_amount: paid_amount || 0,
              due_amount: due_amount || 0,
              payment_status: payment_status(),
            });
          }
        }
      } else if (type === 'DUE_PAYMENTS') {
        invoices = await getCustomRepository(InvoiceRepository).find({
          where: {
            status: status,
            invoiceType: invoice_type,
            organizationId: req.user.organizationId,
            dueDate: LessThan(new Date()),
            branchId: req.user.branchId,
          },
          skip: pn * ps - ps,
          take: ps,
          order: {
            [sort_column]: sort_order,
          },
          relations: ['invoiceItems'],
        });

        for (const i of invoices) {
          invoice_arr.push({
            ...i,
          });
        }
      }
    }

    const new_invoices = [];
    const mapContactIds = invoice_arr.map((inv) => inv.contactId);

    const newContactIds = mapContactIds
      .sort()
      .filter(function (item, pos, ary) {
        return !pos || item != ary[pos - 1];
      });

    const { data: contacts } = await axios.post(
      Host('contacts', 'contacts/contact/ids'),
      {
        ids: newContactIds,
        type: 1,
      },
      {
        headers: {
          cookie: `access_token=${token}`,
        },
      }
    );

    // get distinct userids
    const key = 'createdById';
    const mapUniqueUserId = [
      ...new Map(invoice_arr.map((item) => [item[key], item])).values(),
    ].map((i) => i[key]);

    const { data: users } = await axios.post(
      Host('users', 'users/user/ids'),
      {
        ids: mapUniqueUserId,
        type: 1,
      },
      {
        headers: {
          cookie: `access_token=${token}`,
        },
      }
    );

    for (const i of invoice_arr) {
      const contact = contacts.find((c) => c.id === i.contactId);
      const user = users.find((u) => u.id === i.createdById);
      new_invoices.push({
        ...i,
        contact,
        owner: user,
      });
    }

    return {
      result: new_invoices,
      pagination: {
        total,
        total_pages: Math.ceil(total / ps),
        page_size: ps || 20,
        // page_total: null,
        page_no: pn,
        sort_column: sort_column,
        sort_order: sort_order,
      },
    };
  }

  async CreateInvoice(dto: InvoiceDto, req: IRequest): Promise<IInvoice> {
    if (!req || !req.cookies) return null;
    const token = req?.cookies['access_token'];

    const accountCodesArray = ['15004', '20002', '50001'];
    const { data: accounts } = await axios.post(
      Host('accounts', 'accounts/account/codes'),
      {
        codes: accountCodesArray,
      },
      {
        headers: {
          cookie: `access_token=${token}`,
        },
      }
    );

    const mapItemIds = dto.invoice_items.map((ids) => ids.itemId);

    const { data: items } = await axios.post(
      Host('items', 'items/item/ids'),
      {
        ids: mapItemIds,
      },
      {
        headers: {
          cookie: `access_token=${token}`,
        },
      }
    );

    const creditsArrray = [];
    const itemLedgerArray = [];
    const invoiceItems = [];

    if (dto?.isNewRecord === false) {
      Logger.log('updating the current invoice');
      // we need to update invoice
      const invoice: IInvoice = await getCustomRepository(
        InvoiceRepository
      ).findOne({
        where: {
          id: dto.id,
          organizationId: req.user.organizationId,
          branchId: req.user.branchId,
        },
      });

      if (invoice) {
        await getCustomRepository(InvoiceRepository).update(
          { id: dto.id },
          {
            contactId: dto.contactId || invoice.contactId,
            reference: dto.reference || invoice.reference,
            issueDate: dto.issueDate || invoice.issueDate,
            dueDate: dto.dueDate || invoice.dueDate,
            invoiceNumber: dto.invoiceNumber || invoice.invoiceNumber,
            discount: dto.discount || invoice.discount,
            grossTotal: dto.grossTotal || invoice.grossTotal,
            netTotal: dto.netTotal || invoice.netTotal,
            date: dto.issueDate || invoice.date,
            invoiceType: dto.invoiceType || invoice.invoiceType,
            directTax: dto.directTax || invoice.directTax,
            indirectTax: dto.indirectTax || invoice.indirectTax,
            isTaxIncluded: dto.isTaxIncluded || invoice.isTaxIncluded,
            comment: dto.comment || invoice.comment,
            organizationId: invoice.organizationId,
            branchId: invoice.branchId,
            createdById: invoice.createdById,
            updatedById: req.user.id,
            status: dto.status || invoice.status,
          }
        );

        await getCustomRepository(InvoiceItemRepository).delete({
          invoiceId: dto.id,
        });

        for (const item of dto.invoice_items) {
          const iItems = await getCustomRepository(InvoiceItemRepository).save({
            itemId: item.itemId,
            invoiceId: dto.id,
            description: item.description,
            quantity: item.quantity,
            itemDiscount: item.itemDiscount,
            unitPrice: item.unitPrice,
            costOfGoodAmount: item.costOfGoodAmount,
            sequence: item.sequence,
            tax: item.tax,
            total: item.total,
            status: 1,
          });

          const itemDetail = items.find((i) => i.id === item.itemId);
          if (itemDetail?.hasInventory === true) {
            itemLedgerArray.push({
              itemId: item.itemId,
              value: item.quantity,
              targetId: invoice.id,
              type: 'decrease',
              action: 'create',
              price:
                typeof item.unitPrice === 'string'
                  ? parseFloat(item.unitPrice)
                  : item.unitPrice,
            });
          }

          const credit = {
            amount: Number(item.quantity) * Number(item.unitPrice),
            account_id: item.accountId,
          };

          creditsArrray.push(credit);
          invoiceItems.push(iItems);
        }

        const updatedInvoice: IInvoice = await getCustomRepository(
          InvoiceRepository
        ).findOne({
          where: {
            id: dto.id,
            organizationId: req.user.organizationId,
          },
        });

        if (updatedInvoice.status === Statuses.AUTHORISED) {
          Logger.log('Managing inventory for items.');
          await axios.post(
            Host('items', 'items/item/manage-inventory'),
            {
              payload: itemLedgerArray,
            },
            {
              headers: {
                cookie: `access_token=${token}`,
              },
            }
          );

          const debitsArray = [];
          const debit = {
            account_id: await accounts.find((i) => i.code === '15004').id,
            amount: dto.netTotal,
          };
          if (dto?.discount > 0) {
            const debitDiscount = {
              amount: dto.discount,
              account_id: await accounts.find((i) => i.code === '20002').id,
            };

            debitsArray.push(debit, debitDiscount);
          } else {
            debitsArray.push(debit);
          }

          const payload = {
            dr: debitsArray,
            cr: creditsArrray,
            type: 'invoice',
            reference: dto.reference,
            amount: dto.grossTotal,
            status: updatedInvoice.status,
          };

          Logger.log('Making transactions for the invoice.');
          const { data: transaction } = await axios.post(
            Host('accounts', 'accounts/transaction/api'),
            {
              transactions: payload,
            },
            {
              headers: {
                cookie: `access_token=${token}`,
              },
            }
          );

          const paymentArr = [
            {
              ...updatedInvoice,
              invoiceId: invoice.id,
              balance: dto.netTotal,
              date: dto.issueDate,
              paymentType: PaymentModes.INVOICES,
              transactionId: transaction.id,
              entryType: EntryType.CREDIT,
            },
          ];

          const invoiceLink = `${process.env.FRONTEND_HOST}/invoices/${invoice.id}`;
          await this.emailService.emit(INVOICE_UPDATED, {
            to: req?.user?.email,
            user_name: ToTitleCase(req?.user?.profile?.fullName),
            invoice_number: invoice?.invoiceNumber,
            name: invoiceLink,
          });

          Logger.log('Adding payments for the invoice.');
          await axios.post(
            Host('payments', 'payments/payment/add'),
            {
              payments: paymentArr,
            },
            {
              headers: {
                cookie: `access_token=${token}`,
              },
            }
          );

          await axios.get(Host('contacts', 'contacts/contact/balance'), {
            headers: {
              cookie: `access_token=${token}`,
            },
          });
        }
        return updatedInvoice;
      }

      Logger.error(
        'Something went wrong, Invalid parameters were given while updating invoice data.'
      );
    } else {
      Logger.log('Creating a new invoice.');

      // we need to create invoice
      const invoice = await getCustomRepository(InvoiceRepository).save({
        contactId: dto.contactId,
        reference: dto.reference,
        issueDate: dto.issueDate,
        dueDate: dto.dueDate,
        invoiceNumber: dto.invoiceNumber,
        discount: dto.discount,
        grossTotal: dto.grossTotal,
        netTotal: dto.netTotal,
        date: dto.issueDate,
        invoiceType: dto.invoiceType,
        // directTax: dto.directTax,
        // indirectTax: dto.indirectTax,
        isTaxIncluded: dto?.isTaxIncluded,
        comment: dto?.comment,
        organizationId: req.user.organizationId,
        branchId: req.user.branchId,
        createdById: req.user.id,
        updatedById: req.user.id,
        status: dto.status,
      });

      for (const item of dto.invoice_items) {
        const iItem = await getCustomRepository(InvoiceItemRepository).save({
          itemId: item.itemId,
          invoiceId: invoice.id,
          description: item.description,
          quantity: item.quantity,
          itemDiscount: item.itemDiscount,
          unitPrice: item.unitPrice,
          costOfGoodAmount: item.costOfGoodAmount,
          sequence: item.sequence,
          tax: item.tax,
          accountId: item.accountId,
          total: item.total,
          status: 1,
        });

        const itemDetail = items.find((i) => i.id === item.itemId);
        if (itemDetail?.hasInventory === true) {
          itemLedgerArray.push({
            itemId: item.itemId,
            value: item.quantity,
            targetId: invoice.id,
            type: 'decrease',
            action: 'create',
            invoiceType: 'invoice',
            price:
              typeof item.unitPrice === 'string'
                ? parseFloat(item.unitPrice)
                : item.unitPrice,
          });
        }

        const credit = {
          amount: Number(item.quantity) * Number(item.unitPrice),
          account_id: item.accountId,
        };

        creditsArrray.push(credit);
        invoiceItems.push(iItem);
      }

      if (invoice.status === Statuses.AUTHORISED) {
        Logger.log('Update jurnal report');

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

        const { data: contact } = await axios.post(
          Host('contacts', `contacts/contact/ids`),
          {
            ids: [dto.contactId],
            type: 1,
          },
          {
            headers: {
              cookie: `access_token=${token}`,
            },
          }
        );

        const invoiceReportData = {
          invoice,
          invoiceItems,
          contact: contact[0],
          organizationName: result.name,
          items,
          user: req.user,
        };
        await this.reportService.emit(INVOICE_CREATED, invoiceReportData);

        Logger.log('Managing inventory for items.');
        await axios.post(
          Host('items', 'items/item/manage-inventory'),
          {
            payload: itemLedgerArray,
          },
          {
            headers: {
              cookie: `access_token=${token}`,
            },
          }
        );

        const debitsArray = [];
        const debit = {
          account_id: await accounts.find((i) => i.code === '15004').id,
          amount: dto.netTotal,
        };
        if (dto?.discount > 0) {
          const debitDiscount = {
            amount: dto.discount,
            account_id: await accounts.find((i) => i.code === '20002').id,
          };

          debitsArray.push(debit, debitDiscount);
        } else {
          debitsArray.push(debit);
        }

        const payload = {
          dr: debitsArray,
          cr: creditsArrray,
          type: 'invoice',
          reference: dto.reference,
          amount: dto.grossTotal,
          status: invoice.status,
          report: true, // true if report has been created
          invoiceId: invoice.id,
        };

        Logger.log('Making transactions for the invoice.');
        const { data: transaction } = await axios.post(
          Host('accounts', 'accounts/transaction/api'),
          {
            transactions: payload,
          },
          {
            headers: {
              cookie: `access_token=${token}`,
            },
          }
        );

        const paymentArr = [
          {
            ...invoice,
            invoiceId: invoice.id,
            contactId: dto.contactId,
            balance: invoice.netTotal,
            date: invoice.issueDate,
            paymentType: PaymentModes.INVOICES,
            transactionId: transaction.id,
            entryType: EntryType.CREDIT,
            report: true, // true if report has been created
            type: 1,
            contact: contact[0] || {},
            invoice: {
              ...invoice,
              invoiceItems,
            },
          },
        ];

        Logger.log('Adding payments for the invoice.');
        await axios.post(
          Host('payments', `payments/payment/add`),
          {
            payments: paymentArr,
          },
          {
            headers: {
              cookie: `access_token=${token}`,
            },
          }
        );

        const invoice_details = [];
        let i = 0;
        for (const item of dto.invoice_items) {
          i++;
          if (i < 6) {
            invoice_details.push({
              itemName: await items.find((i) => i.id === item.itemId).name,
              quantity: item.quantity,
              price: item.purchasePrice,
              itemDiscount: item.itemDiscount,
              tax: item.tax,
              total: item.total,
            });
          }
        }

        const email = contact[0].email
          ? contact[0].email
          : dto.email
          ? dto.email
          : null;

        Logger.log('Making a pdf out of the invoice.');
        const { data: attachment } = await axios.post(
          Host('attachments', `attachments/attachment/generate-pdf`),
          {
            data: {
              ...dto,
              invoice: { ...invoice, invoice_items: invoiceItems },
              contact: contact[0],
              items,
              type: PdfType.INVOICE,
            },
          },
          {
            headers: {
              cookie: `access_token=${token}`,
            },
          }
        );

        Logger.log('Sending email of invoice and its pdf to customer.');
        if (email) {
          await this.emailService.emit(INVOICE_CREATED, {
            to: email,
            user_name: ToTitleCase(contact[0]?.name) || null,
            invoice_number: invoice.invoiceNumber,
            issueDate: moment(invoice.issueDate).format(
              'MMMM Do YYYY, h:mm:ss a'
            ),
            gross_total: invoice.grossTotal,
            itemDisTotal: invoice.discount,
            net_total: invoice.netTotal,
            invoice_details,
            download_link: attachment?.path || null,
            attachment_name: attachment?.name || null,
          });
        }

        await axios.get(Host('contacts', `contacts/contact/balance`), {
          headers: {
            cookie: `access_token=${token}`,
          },
        });
      }
      return invoice;
    }
  }

  async GeneratePdfAndSendEamil(data, req) {
    if (!req || !req.cookies) return null;
    const token = req?.cookies['access_token'];

    if (data.type === InvTypes.INVOICE) {
      const invoice = await getCustomRepository(InvoiceRepository).findOne({
        id: data.id,
        status: 1,
      });

      const invoiceItems = await getCustomRepository(
        InvoiceItemRepository
      ).find({
        where: {
          invoiceId: invoice.id,
        },
      });

      const mapItemIds = invoiceItems.map((ids) => ids.itemId);
      const { data: items } = await axios.post(
        Host('items', `items/item/ids`),
        {
          ids: mapItemIds,
        },
        {
          headers: {
            cookie: `access_token=${token}`,
          },
        }
      );

      const { data: contact } = await axios.post(
        Host('contacts', `contacts/contact/ids`),
        {
          ids: [invoice.contactId],
          type: 1,
        },
        {
          headers: {
            cookie: `access_token=${token}`,
          },
        }
      );

      const invoice_details = [];
      let i = 0;
      for (const item of invoiceItems) {
        i++;
        if (i < 6) {
          invoice_details.push({
            itemName: await items.find((i) => i.id === item.itemId).name,
            quantity: item.quantity,
            price: item.purchasePrice,
            itemDiscount: item.itemDiscount,
            tax: item.tax,
            total: item.total,
          });
        }
      }

      const { data: attachment } = await axios.post(
        Host('attachments', `attachments/attachment/generate-pdf`),
        {
          data: {
            invoice: { ...invoice, invoice_items: invoiceItems },
            invoice_items: invoiceItems,
            contact: contact[0],
            items,
            type: PdfType.INVOICE,
          },
        },
        {
          headers: {
            cookie: `access_token=${token}`,
          },
        }
      );

      await this.emailService.emit(INVOICE_CREATED, {
        to: data.email,
        user_name: ToTitleCase(contact[0]?.name) || null,
        invoice_number: invoice.invoiceNumber,
        issueDate: moment(invoice.issueDate).format('MMMM Do YYYY, h:mm:ss a'),
        gross_total: invoice.grossTotal,
        itemDisTotal: invoice.discount,
        net_total: invoice.netTotal,
        invoice_details,
        download_link: attachment?.path || null,
        attachment_name: attachment?.name || null,

        cc: data.cc,
        bcc: data.bcc,
      });

      return {
        message: 'Invoice sent successfully.',
        status: true,
      };
    } else if (data.type === InvTypes.BILL || data.type === 'POE') {
      const bill = await getCustomRepository(BillRepository).findOne({
        id: data.id,
        status: 1,
      });

      const billItems = await getCustomRepository(InvoiceItemRepository).find({
        where: {
          invoiceId: bill.id,
        },
      });

      const mapItemIds = billItems.map((ids) => ids.itemId);
      const { data: items } = await axios.post(
        Host('items', `items/item/ids`),
        {
          ids: mapItemIds,
        },
        {
          headers: {
            cookie: `access_token=${token}`,
          },
        }
      );

      const { data: contact } = await axios.post(
        Host('contacts', `contacts/contact/ids`),
        {
          ids: [bill.contactId],
          type: 1,
        },
        {
          headers: {
            cookie: `access_token=${token}`,
          },
        }
      );

      const invoice_details = [];
      let i = 0;
      for (const item of billItems) {
        i++;
        if (i < 6) {
          invoice_details.push({
            itemName: await items.find((i) => i.id === item.itemId).name,
            quantity: item.quantity,
            price: item.purchasePrice,
            itemDiscount: item.itemDiscount,
            tax: item.tax,
            total: item.total,
          });
        }
      }

      const { data: attachment } = await axios.post(
        Host('attachments', `attachments/attachment/generate-pdf`),
        {
          data: {
            invoice: { ...bill, invoice_items: billItems },
            invoice_items: billItems,
            contact: contact[0],
            items,
            type: PdfType.BILL,
          },
        },
        {
          headers: {
            cookie: `access_token=${token}`,
          },
        }
      );

      await this.emailService.emit(INVOICE_CREATED, {
        to: data.email,
        user_name: contact[0]?.name || null,
        invoice_number: bill.invoiceNumber,
        issueDate: bill.issueDate,
        gross_total: bill.grossTotal,
        itemDisTotal: 0,
        net_total: bill.netTotal,
        invoice_details,
        download_link: attachment?.path || null,
        attachment_name: attachment?.name || null,
        cc: data.cc,
        bcc: data.bcc,
      });

      return {
        message: 'Bill sent successfully.',
        status: true,
      };
    } else if (data.type === PdfType.PO) {
      const po = await getCustomRepository(PurchaseOrderRepository).findOne({
        id: data.id,
        status: 1,
      });

      const poItems = await getCustomRepository(
        PurchaseOrderItemRepository
      ).find({
        where: {
          purchaseOrderId: po.id,
        },
      });

      const mapItemIds = poItems.map((ids) => ids.itemId);

      const { data: items } = await axios.post(
        Host('items', `items/item/ids`),
        {
          ids: mapItemIds,
        },
        {
          headers: {
            cookie: `access_token=${token}`,
          },
        }
      );

      const { data: contact } = await axios.post(
        Host('contacts', `contacts/contact/ids`),
        {
          ids: [po.contactId],
          type: 1,
        },
        {
          headers: {
            cookie: `access_token=${token}`,
          },
        }
      );

      const invoice_details = [];
      let i = 0;
      for (const item of poItems) {
        i++;
        if (i < 6) {
          invoice_details.push({
            itemName: await items.find((i) => i.id === item.itemId).name,
            quantity: item.quantity,
            description: item.description,
          });
        }
      }

      const { data: attachment } = await axios.post(
        Host('attachments', `attachments/attachment/generate-pdf`),
        {
          data: {
            invoice: { ...po, invoice_items: poItems },
            invoice_items: poItems,
            contact: contact[0],
            items,
            type: PdfType.PO,
          },
        },
        {
          headers: {
            cookie: `access_token=${token}`,
          },
        }
      );

      await this.emailService.emit(PO_CREATED, {
        to: contact[0].email || null,
        user_name: ToTitleCase(contact[0]?.name) || null,
        contact: ToTitleCase(req.user.profile.fullName),
        created_time: moment(po.createdAt).format('MMM Do YY'),
        purchaseOrder: po.invoiceNumber,
        comment: po.comment,
        issueDate: moment(po.issueDate).format('MMMM Do YYYY, h:mm:ss a'),
        dueDate: po.dueDate,
        reference: po.reference,
        gross_total: po.grossTotal,
        net_total: po.netTotal,
        invoice_details,
        download_link: attachment?.path || null,
        attachment_name: attachment?.name || null,
        cc: data.cc,
        bcc: data.bcc,
      });

      return {
        message: 'Purchase order sent successfully.',
        status: true,
      };
    }
  }

  async ChangeDueDate(invoiceId, data) {
    const { type, date } = data;

    const isNumeric = (invoiceId) =>
      /^-?[0-9]+(?:\.[0-9]+)?$/.test(invoiceId + '');

    if (isNumeric(invoiceId) && type === InvTypes.INVOICE) {
      const invoice = await getCustomRepository(InvoiceRepository).findOne({
        id: invoiceId,
      });

      if (invoice) {
        await getCustomRepository(InvoiceRepository).update(
          {
            id: invoiceId,
          },
          {
            dueDate: date,
          }
        );

        return {
          message: 'Invoice updated successfully.',
          status: true,
        };
      }
    } else if (isNumeric(invoiceId) && type === InvTypes.BILL) {
      const bill = await getCustomRepository(BillRepository).findOne({
        id: invoiceId,
      });

      if (bill) {
        await getCustomRepository(BillRepository).update(
          {
            id: invoiceId,
          },
          {
            dueDate: date,
          }
        );

        return {
          message: 'Invoice updated successfully.',
          status: true,
        };
      }
    } else if (isNumeric(invoiceId) && type === InvTypes.CREDIT_NOTE) {
      const creditnote = await getCustomRepository(
        CreditNoteRepository
      ).findOne({ id: invoiceId });

      if (creditnote) {
        await getCustomRepository(CreditNoteRepository).update(
          {
            id: invoiceId,
          },
          {
            dueDate: date,
          }
        );
        return {
          message: 'Invoice updated successfully.',
          status: true,
        };
      }
    }
    throw new HttpException(
      'Invalid input, please check again',
      HttpStatus.BAD_REQUEST
    );
  }

  async CreateYourFirstInvoice(user) {
    const threeDays = moment(Date.now()).subtract(3, 'days').format();
    const today = moment(new Date()).format();

    const invoices = await getCustomRepository(InvoiceRepository).find({
      where: {
        createdAt: Between(threeDays, today),
        organizationId: user.organizationId,
      },
    });

    if (invoices.length === 0) {
      const payload = {
        to: user.email,
        from: 'no-reply@invyce.com',
        TemplateAlias: 'create-your-first-invoice',
        TemplateModel: {
          user_name: user.username,
        },
      };

      await this.emailService.emit(SEND_FORGOT_PASSWORD, payload);
    }

    return true;
  }

  async FindById(invoiceId: number, req: IRequest): Promise<IInvoice> {
    const [invoice] = await getCustomRepository(InvoiceRepository).find({
      where: { id: invoiceId },
      relations: ['invoiceItems'],
    });

    const allInvoices = await getCustomRepository(InvoiceRepository).find({
      where: {
        invoiceType: invoice.invoiceType,
        status: invoice.status,
        organizationId: req?.user?.organizationId,
        branchId: req?.user?.branchId,
      },
    });

    const currentIndex = allInvoices.findIndex(
      (item) => item.id === invoice?.id
    );

    const nextItem = allInvoices[currentIndex + 1]?.id || null;
    const prevItem = allInvoices[currentIndex - 1]?.id || null;

    const creditNote = await getCustomRepository(CreditNoteRepository)
      .createQueryBuilder()
      .where('"invoiceId" = :id', { id: invoiceId })
      .select('id, "invoiceNumber", "netTotal" as balance')
      .getRawMany();

    let new_invoice;
    if (invoice?.contactId) {
      const contactId = invoice?.contactId;
      const itemIdsArray = invoice?.invoiceItems.map((ids) => ids.itemId);

      if (!req || !req.cookies) return null;
      const token = req.cookies['access_token'];

      const contactRequest = {
        url: Host('contacts', `contacts/contact/${contactId}`),
        method: 'GET',
        headers: {
          cookie: `access_token=${token}`,
        },
      };

      const { data: payments } = await axios.post(
        Host('payments', `payments/payment/invoice`),
        {
          ids: [invoiceId],
          type: 'INVOICE',
        },
        {
          headers: {
            cookie: `access_token=${token}`,
          },
        }
      );

      const { data: contact } = await axios(contactRequest as unknown);
      const { data: items } = await axios.post(
        Host('items', `items/item/ids`),
        {
          ids: itemIdsArray,
        },
        {
          headers: {
            cookie: `access_token=${token}`,
          },
        }
      );

      const balance = payments.find((bal) => parseInt(bal.id) === invoice.id);

      const due_amount =
        balance?.invoice?.credit_notes !== 0
          ? balance?.invoice?.credits -
            balance?.invoice?.credit_notes -
            balance?.invoice?.payment
          : balance?.invoice?.balance;
      const paid_amount = balance?.invoice?.payment;

      const payment_status = () => {
        if (paid_amount < due_amount && due_amount < invoice?.netTotal) {
          return 'Partial Payment';
        } else if (due_amount === invoice?.netTotal) {
          return 'Payment Pending';
        } else if (paid_amount === invoice?.netTotal) {
          return 'Full Payment';
        } else {
          return null;
        }
      };

      const newInvoice = {
        ...invoice,
        paid_amount,
        due_amount,
        payment_status: payment_status(),
      };

      const invoiceItemArr = [];
      for (const i of invoice.invoiceItems) {
        const item = items.find((j) => i.itemId === j.id);
        invoiceItemArr.push({ ...i, item });
      }

      if (invoiceItemArr.length > 0) {
        new_invoice = {
          ...newInvoice,
          relation: {
            links: creditNote,
            type: 'CN',
          },
          contact: contact.result,
          invoiceItems: invoiceItemArr,
        };
      }
    }
    return new_invoice
      ? { ...new_invoice, nextItem, prevItem }
      : { ...invoice, nextItem, prevItem };
  }

  async GetInvoiceNumber(type: string, user: IBaseUser): Promise<string> {
    let invoiceNo = '';
    if (type === InvTypes.INVOICE) {
      const [invoice] = await getCustomRepository(InvoiceRepository).find({
        where: {
          organizationId: user.organizationId,
          branchId: user.branchId,
          invoiceNumber: ILike(`%INV-${new Date().getFullYear()}%`),
        },
        order: {
          id: 'DESC',
        },
        take: 1,
      });

      if (invoice) {
        const year = new Date().getFullYear();
        const n = invoice.invoiceNumber.split('-');
        let m = parseInt(n[2]);
        const o = (m += 1);
        invoiceNo = `INV-${year}-${o}`;
      } else {
        invoiceNo = `INV-${new Date().getFullYear()}-1`;
      }
    } else if (type === InvTypes.BILL) {
      const [bill] = await getCustomRepository(BillRepository).find({
        where: {
          organizationId: user.organizationId,
          branchId: user.branchId,
          invoiceNumber: ILike(`%BILL-${new Date().getFullYear()}%`),
        },
        order: {
          id: 'DESC',
        },
        take: 1,
      });

      if (bill) {
        const year = new Date().getFullYear();
        const n = bill.invoiceNumber.split('-');
        let m = parseInt(n[2]);
        const o = (m += 1);
        invoiceNo = `BILL-${year}-${o}`;
      } else {
        invoiceNo = `BILL-${new Date().getFullYear()}-1`;
      }
    } else if (type === InvTypes.CREDIT_NOTE) {
      const [credit_note] = await getCustomRepository(
        CreditNoteRepository
      ).find({
        where: {
          organizationId: user.organizationId,
          branchId: user.branchId,
          invoiceNumber: ILike(`%CN-${new Date().getFullYear()}%`),
        },
        order: {
          id: 'DESC',
        },
        take: 1,
      });

      if (credit_note) {
        const year = new Date().getFullYear();
        const n = credit_note.invoiceNumber.split('-');
        let m = parseInt(n[2]);
        const o = (m += 1);
        invoiceNo = `CN-${year}-${o}`;
      } else {
        invoiceNo = `CN-${new Date().getFullYear()}-1`;
      }
    } else if (type === InvTypes.PURCHASE_ORDER) {
      const [purchase_order] = await getCustomRepository(
        PurchaseOrderRepository
      ).find({
        where: {
          organizationId: user.organizationId,
          branchId: user.branchId,
          invoiceNumber: ILike(`%PO-${new Date().getFullYear()}%`),
        },
        order: {
          id: 'DESC',
        },
        take: 1,
      });

      if (purchase_order) {
        const year = new Date().getFullYear();
        const n = purchase_order.invoiceNumber.split('-');
        let m = parseInt(n[2]);
        const o = (m += 1);
        invoiceNo = `PO-${year}-${o}`;
      } else {
        invoiceNo = `PO-${new Date().getFullYear()}-1`;
      }
    } else if (type === InvTypes.QUOTATION) {
      const [quotation] = await getCustomRepository(QuotationRepository).find({
        where: {
          organizationId: user.organizationId,
          branchId: user.branchId,
          invoiceNumber: ILike(`%QO-${new Date().getFullYear()}%`),
        },
        order: {
          id: 'DESC',
        },
        take: 1,
      });

      if (quotation) {
        const year = new Date().getFullYear();
        const n = quotation.invoiceNumber.split('-');
        let m = parseInt(n[2]);
        const o = (m += 1);
        invoiceNo = `PO-${year}-${o}`;
      } else {
        invoiceNo = `PO-${new Date().getFullYear()}-1`;
      }
    }

    return invoiceNo;
  }

  async Pdf() {
    console.log('Sending pdf please wait...');

    const requestObj = {
      url: 'https://api.pdfmonkey.io/api/v1/documents',
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + process.env.PDF_GENERATOR_KEY,
        Accept: 'application/json',
      },
      data: {
        document: {
          document_template_id: 'D4319ECC-9529-4498-BCFD-EE15DA865B52',
          // "payload": "{ \"name\": \"Jane Doe\" }",
          // "status": "pending"
        },
      },
    };

    await axios(requestObj as unknown);
  }

  /**
   *
   */

  async FindInvoicesByContactId(contactId: string): Promise<IInvoice[]> {
    return await getCustomRepository(InvoiceRepository).find({
      where: { contactId },
      relations: ['invoiceItems', 'creditNote'],
    });
  }

  async deleteInvoice(
    invoiceIds: InvoiceIdsDto,
    req: IRequest
  ): Promise<boolean> {
    if (!req || !req.cookies) return null;
    const token = req?.cookies['access_token'];

    const itemLedgerArray = [];
    const itemArray = [];
    for (const i of invoiceIds.ids) {
      const invoice_items = await getCustomRepository(
        InvoiceItemRepository
      ).find({
        where: { invoiceId: i },
      });

      const mapItemIds = invoice_items.map((ids) => ids.itemId);
      const { data: items } = await axios.post(
        Host('items', `items/item/ids`),
        {
          ids: mapItemIds,
        },
        {
          headers: {
            cookie: `access_token=${token}`,
          },
        }
      );
      itemArray.push(items);
    }

    const newItemArray = itemArray.flat();
    for (const i of invoiceIds.ids) {
      const invoice = await getCustomRepository(InvoiceRepository).findOne({
        where: {
          id: i,
        },
      });

      await getCustomRepository(InvoiceRepository).update(
        { id: i },
        { status: 0 }
      );

      const invoice_items = await getCustomRepository(
        InvoiceItemRepository
      ).find({
        where: { invoiceId: i },
      });

      for (const j of invoice_items) {
        await getCustomRepository(InvoiceItemRepository).update(
          { invoiceId: i },
          { status: 0 }
        );

        if (invoice.status === Statuses.AUTHORISED) {
          const itemDetail = newItemArray.find((i) => i.id === j.itemId);
          if (itemDetail?.hasInventory === true) {
            itemLedgerArray.push({
              itemId: j.itemId,
              value: j.quantity,
              targetId: i,
              type: 'decrease',
              action: 'delete',
              invoiceType: 'invoice',
              price:
                typeof j.unitPrice === 'string'
                  ? parseFloat(j.unitPrice)
                  : j.unitPrice,
            });
          }
        }
      }
    }

    if (itemLedgerArray.length > 0) {
      await axios.post(
        Host('payments', 'payments/payment/delete'),
        {
          ids: invoiceIds.ids,
          type: PaymentModes.INVOICES,
        },
        {
          headers: {
            cookie: `access_token=${token}`,
          },
        }
      );

      await axios.post(
        Host('items', `items/item/manage-inventory`),
        {
          payload: itemLedgerArray,
        },
        {
          headers: {
            cookie: `access_token=${token}`,
          },
        }
      );
    }

    return true;
  }

  /**
   * today invoice detail REPORT
   */

  async TodayInvoiceDetails(user) {
    const invoice = await getCustomRepository(InvoiceRepository).find({
      where: {
        organizationId: user.organizationId,
        status: Not(0),
      },
    });

    const links = invoice.map((i) => {
      return {
        title: i.invoiceNumber,
        link: `http://localhost:4200/app/invoice/${i?.id}`,
      };
    });

    const payload = {
      to: user.email,
      from: 'no-reply@invyce.com',
      TemplateAlias: 'today-invoice-detail',
      TemplateModel: {
        product_url: 'product_url_Value',
        user_name: user.profile.fullName,
        action_url: 'action_url_Value',
        product_name: 'product_name_Value',
        name: 'name_Value',
        operating_system: 'operating_system_Value',
        browser_name: 'browser_name_Value',
        support_url: 'support_url_Value',
        company_name: 'company_name_Value',
        company_address: 'company_address_Value',
        links,
      },
    };

    await this.emailService.emit(SEND_FORGOT_PASSWORD, payload);
  }

  /**
   * pending invoices REMINDER
   */

  async PendingInvoiceToApprove(user) {
    const invoice = await getCustomRepository(InvoiceRepository).find({
      where: {
        organizationId: user.organizationId,
        status: 2,
      },
    });

    const links = invoice.map((i) => {
      return {
        title: i.invoiceNumber,
        link: `http://localhost:4200/app/invoice/${i?.id}`,
      };
    });

    const payload = {
      to: user.email,
      from: 'no-reply@invyce.com',
      TemplateAlias: 'pending-invoice-today',
      TemplateModel: {
        product_url: 'product_url_Value',
        user_name: user.profile.fullName,
        action_url: 'action_url_Value',
        product_name: 'product_name_Value',
        name: 'name_Value',
        operating_system: 'operating_system_Value',
        browser_name: 'browser_name_Value',
        support_url: 'support_url_Value',
        company_name: 'company_name_Value',
        company_address: 'company_address_Value',
        links,
      },
    };

    await this.emailService.emit(SEND_FORGOT_PASSWORD, payload);
  }

  /**
   * awating payment detail REMINDER
   */

  async PendingPaymentInvoices(req) {
    if (!req || !req.cookies) return null;
    const token = req?.cookies['access_token'];

    const invoices = await getCustomRepository(InvoiceRepository).find({
      where: {
        status: 1,
        invoiceType: 'SI',
        branchId: req.user.branchId,
        organizationId: req.user.organizationId,
      },
    });

    const mapInvoiceIds = invoices.map((inv) => inv.id);

    const { data: balances } = await axios.post(
      Host('payments', `payments/payment/invoice`),
      {
        ids: mapInvoiceIds,
        type: 'INVOICE',
      },
      {
        headers: {
          cookie: `access_token=${token}`,
        },
      }
    );

    const invoice_arr = [];
    for (const i of invoices) {
      const balance = balances.find((bal) => bal.id === i.id);

      const paid_amount = balance?.invoice?.balance || 0;
      const due_amount = balance?.invoice?.balance
        ? i.netTotal - balance?.invoice?.balance
        : i.netTotal;

      const payment_status = () => {
        if (paid_amount < due_amount && due_amount < i?.netTotal) {
          return 'Partial Payment';
        } else if (due_amount === i?.netTotal) {
          return 'Payment Pending';
        } else if (paid_amount === i?.netTotal) {
          return 'Full Payment';
        } else {
          return null;
        }
      };
      if (balance.invoice.balance === 0) {
        invoice_arr.push({
          ...i,
          paid_amount,
          due_amount: i.netTotal - balance.invoice.balance || 0,
          payment_status: payment_status(),
        });
      }
    }

    const links = invoice_arr.map((i) => {
      return {
        title: i.invoiceNumber,
        link: `http://localhost:4200/app/invoice/${i?.id}`,
      };
    });

    const payload = {
      to: req.user.email,
      from: 'no-reply@invyce.com',
      TemplateAlias: 'pending-payment-invoice',
      TemplateModel: {
        product_url: 'product_url_Value',
        user_name: req.user.profile.fullName,
        action_url: 'action_url_Value',
        product_name: 'product_name_Value',
        name: 'name_Value',
        operating_system: 'operating_system_Value',
        browser_name: 'browser_name_Value',
        support_url: 'support_url_Value',
        company_name: 'company_name_Value',
        company_address: 'company_address_Value',
        links,
      },
    };

    await this.emailService.emit(SEND_FORGOT_PASSWORD, payload);
  }

  /**
   * Aged payable report
   */

  async AgedReceivables(req: IRequest, query) {
    if (!req || !req.cookies) return null;
    const token = req?.cookies['access_token'];

    const invoices = await getCustomRepository(InvoiceRepository).find({
      where: {
        status: 1,
        invoiceType: 'SI',
        branchId: req.user.branchId,
        organizationId: req.user.organizationId,
      },
    });

    const mapInvoiceIds = invoices.map((inv) => inv.id);

    const { data: balances } = await axios.post(
      Host('payments', `payments/payment/invoice`),
      {
        ids: mapInvoiceIds,
        type: 'INVOICE',
      },
      {
        headers: {
          cookie: `access_token=${token}`,
        },
      }
    );

    const invoice_arr = [];
    for (const i of invoices) {
      const balance = balances.find((bal) => bal.id === i.id);

      const paid_amount = balance?.invoice?.balance || 0;
      const due_amount = balance?.invoice?.balance
        ? i.netTotal - balance?.invoice?.balance
        : i.netTotal;

      const payment_status = () => {
        if (paid_amount < due_amount && due_amount < i?.netTotal) {
          return 'Partial Payment';
        } else if (due_amount === i?.netTotal) {
          return 'Payment Pending';
        } else if (paid_amount === i?.netTotal) {
          return 'Full Payment';
        } else {
          return null;
        }
      };
      if (balance.invoice.balance === 0) {
        invoice_arr.push({
          ...i,
          paid_amount,
          due_amount: i.netTotal - balance.invoice.balance || 0,
          payment_status: payment_status(),
        });
      }
    }

    return invoice_arr.flat();
  }

  async InvoicesAgainstContactId(
    contactId: string,
    req: IRequest,
    type: number
  ): Promise<IInvoice[]> {
    if (!req || !req.cookies) return null;
    const token = req?.cookies['access_token'];

    const inv_arr = [];
    if (type == PaymentModes.INVOICES) {
      const invoices = await getCustomRepository(InvoiceRepository).find({
        where: {
          contactId: contactId,
          organizationId: req.user.organizationId,
          branchId: req.user.branchId,
          status: 1,
        },
      });

      const invoiceIds = invoices?.map((i) => i.id);
      if (invoices.length > 0) {
        const { data: payments } = await axios.post(
          Host('payments', `payments/payment/invoice`),
          {
            ids: invoiceIds,
            type: 'INVOICE',
          },
          {
            headers: {
              cookie: `access_token=${token}`,
            },
          }
        );

        for (const inv of invoices) {
          const balance = payments.find((pay) => pay.id === inv.id);

          if (balance.invoice.balance !== 0) {
            inv_arr.push({
              ...inv,
              balance: balance.invoice.balance,
            });
          }
        }
      }

      return inv_arr;
    } else if (type == PaymentModes.BILLS) {
      const bills = await getCustomRepository(BillRepository).find({
        where: {
          contactId: contactId,
          organizationId: req.user.organizationId,
          branchId: req.user.branchId,
          status: 1,
        },
      });

      if (bills.length > 0) {
        const invoiceIds = bills?.map((i) => i.id);

        const { data: payments } = await axios.post(
          Host('payments', `payments/payment/invoice`),
          {
            ids: invoiceIds,
            type: 'BILL',
          },
          {
            headers: {
              cookie: `access_token=${token}`,
            },
          }
        );

        for (const inv of bills) {
          const balance = payments.find((pay) => pay.id === inv.id);
          if (balance.invoice.billbalance !== 0) {
            inv_arr.push({
              ...inv,
              balance: balance.invoice.billbalance,
            });
          }
        }
      }
      return inv_arr;
    }
  }

  async FindByInvoiceIds(invoiceIds: InvoiceIdsDto): Promise<IInvoice[]> {
    return await getCustomRepository(InvoiceRepository).find({
      where: { id: In(invoiceIds.ids) },
    });
  }

  async SyncInvoices(data, req: IRequest): Promise<void> {
    if (!req || !req.cookies) return null;
    const token = req?.cookies['access_token'];

    const mapContactIds =
      data.type === Integrations.XERO
        ? data.invoices.map((inv) => inv?.contact?.contactID)
        : data.invoices.map((inv) => inv?.CustomerRef?.value);

    const { data: contacts } = await axios.post(
      Host('contacts', `contacts/contact/ids`),
      {
        ids: mapContactIds,
        type: 2,
      },
      {
        headers: {
          cookie: `access_token=${token}`,
        },
      }
    );

    const newPaymentPayload = [];
    const transactions = [];

    if (data.type === Integrations.XERO) {
      const item_arr = [];
      const account_arr = [];
      for (const i of data.invoices) {
        const mapItemCodes = i.lineItems.map((items) => items.itemCode);
        const mapAccountCodes = i.lineItems.map(
          (accounts) => accounts.accountCode
        );

        if (!mapItemCodes.includes(undefined)) {
          item_arr.push(mapItemCodes);
        }

        account_arr.push(mapAccountCodes);
      }

      const mapAccountCodesFromPayments = data.payments.map(
        (i) => i.account.code
      );

      const itemCodesArray = item_arr.flat();
      const { data: items } = await axios.post(
        Host('items', `items/item/ids-or-codes`),
        {
          payload: itemCodesArray,
          type: Integrations.XERO,
        },
        {
          headers: {
            cookie: `access_token=${token}`,
          },
        }
      );

      const new_account_codes = account_arr.flat();
      const concatAccountCodes = new_account_codes.concat(
        mapAccountCodesFromPayments
      );

      const { data: accounts } = await axios.post(
        Host('accounts', `accounts/account/codes`),
        {
          codes: concatAccountCodes,
        },
        {
          headers: {
            cookie: `access_token=${token}`,
          },
        }
      );

      const payment_arr = [];
      for (const pay of data.payments) {
        payment_arr.push({
          balance: pay.amount,
          date: pay.date,
          reference: pay.reference,
          contactId: contacts.find(
            (ids) => ids.importedContactId === pay?.invoice?.contact?.contactID
          )._id,
          invoiceId: pay?.invoice?.invoiceID,
          paymentId: pay.paymentID,
          status: Statuses[`${pay.status}`],
        });
      }

      for (const i of data.credit_notes) {
        const credit_note = await getCustomRepository(
          CreditNoteRepository
        ).save({
          issueDate: i.date,
          contactId: await contacts.find(
            (con) => con.importedContactId === i.contact.contactID
          )._id,
          reference: i.reference,
          invoiceNumber: i.creditNoteNumber,
          currency: i.currencyCode,
          netTotal: i.subTotal,
          grossTotal: i.total,
          status: Statuses[`${i.status}`],
          importedCreditNoteId: i.creditNoteID,
          importedFrom: Integrations.XERO,
          organizationId: req.user.organizationId,
          createdById: req.user.id,
          updatedById: req.user.id,
        });

        for (const j of i.lineItems) {
          await getCustomRepository(CreditNoteItemRepository).save({
            creditNoteId: credit_note.id,
            description: j.description,
            quantity: j.quantity,
            amount: j.amount,
            itemId: j?.itemCode
              ? await items.find((ids) => ids.code === j.itemCode)._id
              : null,
            accountId: await accounts.find((ids) => ids.code === j.accountCode)
              .id,
            tax: i.taxAmount,
          });
        }
      }

      const invoiceIds = [];
      for (const inv of data.invoices) {
        const invoices = await getCustomRepository(InvoiceRepository).find({
          importedInvoiceId: inv.invoiceID,
          organizationId: req.user.organizationId,
        });

        if (invoices.length === 0 && inv.type === XeroTypes.INVOICE) {
          const invoice = await getCustomRepository(InvoiceRepository).save({
            reference: inv.reference,
            contactId: await contacts.find(
              (con) => con.importedContactId === inv.contact.contactID
            )._id,
            issueDate: inv.date,
            date: inv.date,
            dueDate: inv.dueDate,
            invoiceType: 'SI',
            invoiceNumber: inv.invoiceNumber,
            netTotal: inv.subTotal,
            grossTotal: inv.total,
            discount: inv.totalDiscount,
            currency: inv.currencyCode,
            importedInvoiceId: inv.invoiceID,
            importedFrom: Integrations.XERO,
            organizationId: req.user.organizationId,
            createdById: req.user.id,
            updatedById: req.user.id,
            status: Statuses[`${inv.status}`],
          });

          for (const j of inv.lineItems) {
            await getCustomRepository(InvoiceItemRepository).save({
              invoiceId: invoice.id,
              itemId: j?.itemCode
                ? await items.find((ids) => ids.code === j.itemCode)._id
                : null,
              description: j?.description,
              total: j?.lineAmount,
              tax: j?.taxAmount?.toString() || null,
              unitPrice: j.unitAmount,
              quantity: j?.quantity?.toString() || null,
              itemDiscount: j?.discountAmount?.toString() || null,
              accountId: await accounts.find(
                (ids) => ids.code === j.accountCode
              ).id,
              organizationId: req.user.organizationId,
              createdById: req.user.id,
              status: invoice.status,
            });
          }

          if (inv?.creditNotes?.length > 0) {
            for (const cn of inv.creditNotes) {
              await getCustomRepository(CreditNoteRepository).update(
                { importedCreditNoteId: cn.creditNoteID },
                {
                  invoiceId: invoice.id,
                }
              );
            }
          }

          invoiceIds.push({
            id: invoice.id,
            importedInvoiceId: invoice.importedInvoiceId,
          });
        } else if (inv.type === XeroTypes.BILL) {
          const bill = await getCustomRepository(BillRepository).save({
            reference: inv.reference,
            contactId: await contacts.find(
              (con) => con.importedContactId === inv.contact.contactID
            )._id,
            issueDate: inv.date,
            date: inv.date,
            dueDate: inv.dueDate,
            invoiceType: 'SI',
            invoiceNumber: inv.invoiceNumber,
            netTotal: inv.subTotal,
            grossTotal: inv.total,
            discount: inv.totalDiscount,
            currency: inv.currencyCode,
            importedBillId: inv.invoiceID,
            importedFrom: Integrations.XERO,
            organizationId: req.user.organizationId,
            createdById: req.user.id,
            updatedById: req.user.id,
            status: Statuses[`${inv.status}`],
          });

          for (const j of inv.lineItems) {
            await getCustomRepository(BillItemRepository).save({
              billId: bill.id,
              itemId: j?.itemCode
                ? await items.find((ids) => ids.code === j.itemCode)._id
                : null,
              description: j?.description,
              total: j?.lineAmount,
              tax: j?.taxAmount?.toString() || null,
              unitPrice: j.unitAmount,
              quantity: j?.quantity?.toString() || null,
              itemDiscount: j?.discountAmount?.toString() || null,
              accountId: await accounts.find(
                (ids) => ids.code === j.accountCode
              ).id,
              organizationId: req.user.organizationId,
              createdById: req.user.id,
              status: bill.status,
            });
          }

          if (inv?.creditNotes?.length > 0) {
            for (const cn of inv.creditNotes) {
              await getCustomRepository(CreditNoteRepository).update(
                { importedCreditNoteId: cn.creditNoteID },
                {
                  billId: bill.id,
                }
              );
            }
          }
        }
      }

      for (const i of payment_arr) {
        newPaymentPayload.push({
          ...i,
          invoiceId: invoiceIds.find(
            (ids) => ids.invoiceId === i.importedInvoiceId
          ).id,
        });
      }
    } else if (data.type === Integrations.QUICK_BOOK) {
      const item_ids_array = [];
      // fetch items
      for (const i of data.invoices) {
        if (i.Id) {
          const filterLineItems = i.Line.filter(
            (item) => item.Id !== undefined
          );
          const mapItemIds = filterLineItems.map((ids) => ids.Id);
          item_ids_array.push(mapItemIds);
        }
      }

      const new_item_ids_array = item_ids_array.flat();
      const { data: items } = await axios.post(
        Host('items', 'items/item/ids-or-codes'),
        {
          payload: new_item_ids_array,
          type: Integrations.QUICK_BOOK,
        },
        {
          headers: {
            cookie: `access_token=${token}`,
          },
        }
      );

      for (const inv of data.invoices) {
        const invoice = await getCustomRepository(InvoiceRepository).find({
          where: {
            importedInvoiceId: inv.Id,
            organizationId: req.user.organizationId,
          },
        });
        if (invoice.length === 0) {
          if (inv?.Id) {
            const QBInvoice = await getCustomRepository(InvoiceRepository).save(
              {
                reference: inv.domain,
                contactId: await contacts.find(
                  (con) => con.importedContactId === inv?.CustomerRef?.value
                ).id,
                issueDate: inv.TxnDate,
                dueDate: inv.DueDate,
                grossTotal: inv.TotalAmt,
                invoiceType: 'SI',
                invoiceNumber: 'INV-' + inv.DocNumber,
                netTotal:
                  inv.TxnTaxDetail.TotalTax > 0
                    ? inv.TotalAmt - inv.TxnTaxDetail.TotalTax
                    : inv.TotalAmt,
                date: new Date().toString(),
                currency: inv.CurrencyRef.value,
                importedInvoiceId: inv.Id,
                importedFrom: Integrations.QUICK_BOOK,
                organizationId: req.user.organizationId,
                createdById: req.user.id,
                updatedById: req.user.id,
                status: 1,
              }
            );

            const lineItems = inv.Line.filter((item) => item.Id !== undefined);

            for (const item of lineItems) {
              await getCustomRepository(InvoiceItemRepository).save({
                invoiceId: QBInvoice.id,
                itemId: await items.find(
                  (ids) => ids.importedItemId === item.Id
                ).id,
                description: item.Description,
                total:
                  item.SalesItemLineDetail.UnitPrice *
                  item.SalesItemLineDetail.Qty,
                unitPrice: item.SalesItemLineDetail.UnitPrice,
                quantity: item.SalesItemLineDetail.Qty,
                organizationId: req.user.organizationId,
                branchId: req.user.branchId,
                createdById: req.user.id,
                updatedById: req.user.id,
                status: 1,
              });
            }
          }
        }
      }
    }

    if (newPaymentPayload.length > 0) {
      await axios.post(
        Host('payments', `payments/payment/add`),
        {
          payments: newPaymentPayload,
        },
        {
          headers: {
            cookie: `access_token=${token}`,
          },
        }
      );
    }

    if (transactions.length > 0) {
      await axios.post(
        Host('accounts', 'accounts/transaction/api'),
        {
          transactions,
        },
        {
          headers: {
            cookie: `access_token=${token}`,
          },
        }
      );
    }
  }
}
