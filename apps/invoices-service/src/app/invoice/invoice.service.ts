import { Injectable } from '@nestjs/common';
import { Between, getCustomRepository, ILike, In, LessThan } from 'typeorm';
import axios from 'axios';
import * as dotenv from 'dotenv';
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
  Integrations,
  PaymentModes,
  Statuses,
  XeroTypes,
} from '@invyce/global-constants';
import { BillItemRepository } from '../repositories/billItem.repository';
import { InvoiceDto, InvoiceIdsDto } from '../dto/invoice.dto';

dotenv.config();

@Injectable()
export class InvoiceService {
  async IndexInvoice(
    req: IRequest,
    queryData: IPage
  ): Promise<IInvoiceWithResponse> {
    const { page_no, page_size, invoice_type, type, status, sort, query } =
      queryData;

    const ps: number = parseInt(page_size);
    const pn: number = parseInt(page_no);
    let invoices;

    const { sort_column, sort_order } = await Sorting(sort);

    const total = await getCustomRepository(InvoiceRepository).count({
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
          const val = data[i].value?.split('%')[1];
          // const lower = val.toLowerCase();
          invoices = await getCustomRepository(InvoiceRepository).find({
            where: {
              status: 1,
              branchId: req.user.branchId,
              organizationId: req.user.organizationId,
              [i]: ILike(val),
            },
            skip: pn * ps - ps,
            take: ps,
            relations: ['transactionItems', 'transactionItems.account'],
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
            relations: ['transactionItems', 'transactionItems.account'],
          });
        } else if (data[i].type === 'date-between') {
          const start_date = data[i].value[0];
          const end_date = data[i].value[1];
          invoices = await getCustomRepository(InvoiceRepository).find({
            where: {
              status: 1,
              organizationId: req.user.organizationId,
              branchId: req.user.branchId,
              [i]: Between(start_date, end_date),
            },
            skip: pn * ps - ps,
            take: ps,
            relations: ['transactionItems', 'transactionItems.account'],
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
      let token;
      if (process.env.NODE_ENV === 'development') {
        const header = req.headers?.authorization?.split(' ')[1];
        token = header;
      } else {
        if (!req || !req.cookies) return null;
        token = req.cookies['access_token'];
      }

      const tokenType =
        process.env.NODE_ENV === 'development' ? 'Authorization' : 'cookie';
      const value =
        process.env.NODE_ENV === 'development'
          ? `Bearer ${token}`
          : `access_token=${token}`;

      const http = axios.create({
        baseURL: 'http://localhost',
        headers: {
          [tokenType]: value,
        },
      });

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

        const { data: balances } = await http.post(`payments/payment/invoice`, {
          ids: mapInvoiceIds,
          type: 'INVOICE',
        });

        for (const i of invoices) {
          const balance = balances.find((bal) => bal.id === i.id);
          invoice_arr.push({
            ...i,
            paid_amount: balance.invoice.balance,
            due_amount: i.netTotal - balance.invoice.balance,
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

        const { data: balances } = await http.post(`payments/payment/invoice`, {
          ids: mapInvoiceIds,
          type: 'INVOICE',
        });

        for (const i of invoices) {
          const balance = balances.find((bal) => bal.id === i.id);
          if (balance.invoice.balance === 0) {
            invoice_arr.push({
              ...i,
              paid_amount: balance.invoice.balance,
              due_amount: i.netTotal - balance.invoice.balance,
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

        const { data: balances } = await http.post(`payments/payment/invoice`, {
          ids: mapInvoiceIds,
          type: 'INVOICE',
        });

        for (const i of invoices) {
          const balance = balances.find((bal) => bal.id === i.id);
          if (balance.invoice.balance !== 0) {
            invoice_arr.push({
              ...i,
              paid_amount: balance.invoice.balance,
              due_amount: i.netTotal - balance.invoice.balance,
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

    return {
      result: invoice_arr,
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
    let token;
    if (process.env.NODE_ENV === 'development') {
      const header = req.headers?.authorization?.split(' ')[1];
      token = header;
    } else {
      if (!req || !req.cookies) return null;
      token = req.cookies['access_token'];
    }

    const tokenType =
      process.env.NODE_ENV === 'development' ? 'Authorization' : 'cookie';
    const value =
      process.env.NODE_ENV === 'development'
        ? `Bearer ${token}`
        : `access_token=${token}`;

    const http = axios.create({
      baseURL: 'http://localhost',
      headers: {
        [tokenType]: value,
      },
    });

    const accountCodesArray = ['15004', '20002'];
    const { data: accounts } = await http.post(`accounts/account/codes`, {
      codes: accountCodesArray,
    });

    const mapItemIds = dto.invoice_items.map((ids) => ids.itemId);

    const { data: items } = await http.post(`items/item/ids`, {
      ids: mapItemIds,
    });

    const creditsArrray = [];
    const itemLedgerArray = [];
    if (dto?.isNewRecord === false) {
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
        await getCustomRepository(InvoiceItemRepository).save({
          itemId: item.itemId,
          invoiceId: dto.id,
          description: item.description,
          quantity: item.quantity,
          itemDiscount: item.itemDiscount,
          unitPrice: parseInt(item.unitPrice),
          costOfGoodAmount: item.costOfGoodAmount,
          sequence: item.sequence,
          tax: item.tax,
          total: item.total,
          status: 1,
        });

        const itemDetail = items.find((i) => i.id === item.itemId);
        if (itemDetail.hasInventory) {
          itemLedgerArray.push({
            itemId: item.itemId,
            value: item.quantity,
            targetId: invoice.id,
            type: 'decrease',
            action: 'create',
          });
        }

        const credit = {
          amount: item.total,
          account_id: item.accountId,
        };

        creditsArrray.push(credit);
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
        await http.post(`reports/inventory/manage`, {
          payload: itemLedgerArray,
        });

        if (dto?.discount > 0) {
          const creditDiscount = {
            amount: dto.discount,
            account_id: await accounts.find((i) => i.code === '20002').id,
          };

          creditsArrray.push(creditDiscount);
        }

        const debitsArray = [
          {
            account_id: await accounts.find((i) => i.code === '15004').id,
            amount: dto.grossTotal,
          },
        ];

        const payload = {
          dr: debitsArray,
          cr: creditsArrray,
          type: 'invoice',
          reference: dto.reference,
          amount: dto.grossTotal,
          status: updatedInvoice.status,
        };

        const { data: transaction } = await http.post(
          'accounts/transaction/api',
          {
            transactions: payload,
          }
        );

        const paymentArr = [
          {
            ...updatedInvoice,
            invoiceId: invoice.id,
            balance: invoice.netTotal,
            data: invoice.issueDate,
            paymentType: PaymentModes.INVOICES,
            transactionId: transaction.id,
            entryType: EntryType.CREDIT,
          },
        ];

        await http.post(`payments/payment/add`, {
          payments: paymentArr,
        });
        await http.get(`contacts/contact/balance`);
      }
      return invoice;
    } else {
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
        await getCustomRepository(InvoiceItemRepository).save({
          itemId: item.itemId,
          invoiceId: invoice.id,
          description: item.description,
          quantity: item.quantity,
          itemDiscount: item.itemDiscount,
          unitPrice: parseInt(item.unitPrice),
          costOfGoodAmount: item.costOfGoodAmount,
          sequence: item.sequence,
          tax: item.tax,
          total: item.total,
          status: 1,
        });

        const itemDetail = items.find((i) => i.id === item.itemId);
        if (itemDetail.hasInventory) {
          itemLedgerArray.push({
            itemId: item.itemId,
            value: item.quantity,
            targetId: invoice.id,
            type: 'decrease',
            action: 'create',
          });
        }

        const credit = {
          amount: item.total,
          account_id: item.accountId,
        };

        creditsArrray.push(credit);
      }

      if (invoice.status === Statuses.AUTHORISED) {
        await http.post(`reports/inventory/manage`, {
          payload: itemLedgerArray,
        });

        if (dto?.discount > 0) {
          const creditDiscount = {
            amount: dto.discount,
            account_id: await accounts.find((i) => i.code === '20002').id,
          };

          creditsArrray.push(creditDiscount);
        }

        const debitsArray = [
          {
            account_id: await accounts.find((i) => i.code === '15004').id,
            amount: dto.grossTotal,
          },
        ];

        const payload = {
          dr: debitsArray,
          cr: creditsArrray,
          type: 'invoice',
          reference: dto.reference,
          amount: dto.grossTotal,
          status: invoice.status,
        };

        const { data: transaction } = await http.post(
          'accounts/transaction/api',
          {
            transactions: payload,
          }
        );

        const paymentArr = [
          {
            ...invoice,
            invoiceId: invoice.id,
            balance: invoice.netTotal,
            data: invoice.issueDate,
            paymentType: PaymentModes.INVOICES,
            transactionId: transaction.id,
            entryType: EntryType.CREDIT,
          },
        ];

        await http.post(`payments/payment/add`, {
          payments: paymentArr,
        });
        await http.get(`contacts/contact/balance`);
      }
      return invoice;
    }
  }

  async FindById(invoiceId: number, req: IRequest): Promise<IInvoice> {
    const [invoice] = await getCustomRepository(InvoiceRepository).find({
      where: { id: invoiceId },
      relations: ['invoiceItems'],
    });

    let new_invoice;
    if (invoice?.contactId) {
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

      const contactId = invoice?.contactId;
      const itemIdsArray = invoice?.invoiceItems.map((ids) => ids.itemId);

      const contactRequest = {
        url: `http://localhost/contacts/contact/${contactId}`,
        method: 'GET',
        headers: {
          [type]: value,
        },
      };

      const http = axios.create({
        baseURL: 'http://localhost',
        headers: {
          [type]: value,
        },
      });

      const { data: contact } = await axios(contactRequest as unknown);
      const { data: items } = await http.post(`items/item/ids`, {
        ids: itemIdsArray,
      });

      const invoiceItemArr = [];
      for (const i of invoice.invoiceItems) {
        const item = items.find((j) => i.itemId === j.id);
        invoiceItemArr.push({ ...i, item });
      }

      if (invoiceItemArr.length > 0) {
        new_invoice = {
          ...invoice,
          contact: contact.result,
          invoiceItems: invoiceItemArr,
        };
      }
    }
    return new_invoice ? new_invoice : invoice;
  }

  async GetInvoiceNumber(type: string, user: IBaseUser): Promise<string> {
    let invoiceNo = '';
    if (type === 'SI') {
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
    } else if (type === 'BILL') {
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
    } else if (type === 'CN') {
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
    }

    return invoiceNo;
  }

  async Pdf() {
    console.log('Sending pdf please wait...');
    console.log(process.env.PDF_GENERATOR_KEY);

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

    const data = await axios(requestObj as unknown);
    console.log(data.data);
  }

  async deleteInvoice(
    invoiceIds: InvoiceIdsDto,
    req: IRequest
  ): Promise<boolean> {
    let token;
    if (process.env.NODE_ENV === 'development') {
      const header = req.headers?.authorization?.split(' ')[1];
      token = header;
    } else {
      if (!req || !req.cookies) return null;
      token = req.cookies['access_token'];
    }

    const tokenType =
      process.env.NODE_ENV === 'development' ? 'Authorization' : 'cookie';
    const value =
      process.env.NODE_ENV === 'development'
        ? `Bearer ${token}`
        : `access_token=${token}`;

    const http = axios.create({
      baseURL: 'http://localhost',
      headers: {
        [tokenType]: value,
      },
    });

    const itemLedgerArray = [];
    const itemArray = [];
    for (const i of invoiceIds.ids) {
      const invoice_items = await getCustomRepository(
        InvoiceItemRepository
      ).find({
        where: { invoiceId: i },
      });

      const mapItemIds = invoice_items.map((ids) => ids.itemId);
      const { data: items } = await http.post(`items/item/ids`, {
        ids: mapItemIds,
      });
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
          if (itemDetail.hasInventory) {
            itemLedgerArray.push({
              itemId: j.itemId,
              value: j.quantity,
              targetId: i,
              type: 'decrease',
              action: 'delete',
            });
          }
        }
      }
    }

    if (itemLedgerArray.length > 0) {
      await http.post('payments/payment/delete', {
        ids: invoiceIds.ids,
        type: PaymentModes.INVOICES,
      });

      await http.post(`reports/inventory/manage`, {
        payload: itemLedgerArray,
      });
    }

    return true;
  }

  async InvoicesAgainstContactId(
    contactId: string,
    req: IRequest,
    type: number
  ): Promise<IInvoice[]> {
    let token;
    if (process.env.NODE_ENV === 'development') {
      const header = req.headers?.authorization?.split(' ')[1];
      token = header;
    } else {
      if (!req || !req.cookies) return null;
      token = req.cookies['access_token'];
    }

    const tokenType =
      process.env.NODE_ENV === 'development' ? 'Authorization' : 'cookie';
    const value =
      process.env.NODE_ENV === 'development'
        ? `Bearer ${token}`
        : `access_token=${token}`;

    const http = axios.create({
      baseURL: 'http://localhost',
      headers: {
        [tokenType]: value,
      },
    });

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
      const inv_arr = [];
      if (invoices.length > 0) {
        const { data: payments } = await http.post(`payments/payment/invoice`, {
          ids: invoiceIds,
          type: 'INVOICE',
        });
        for (const inv of invoices) {
          const balance = payments.find((pay) => pay.id === inv.id);
          const newBalance = balance.invoice.balance.toString().split('-')[1];
          if (inv.netTotal != newBalance) {
            inv_arr.push({
              ...inv,
              balance: inv.netTotal - newBalance || inv.netTotal,
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

      const inv_arr = [];
      if (bills.length > 0) {
        const invoiceIds = bills?.map((i) => i.id);

        const { data: payments } = await http.post(`payments/payment/invoice`, {
          ids: invoiceIds,
          type: 'BILL',
        });

        for (const inv of bills) {
          const balance = payments.find((pay) => pay.id === inv.id);
          const newBalance = balance.invoice.balance;
          if (inv.netTotal != newBalance) {
            inv_arr.push({
              ...inv,
              balance: inv.netTotal - newBalance || inv.netTotal,
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

    const http = axios.create({
      baseURL: 'http://localhost',
      headers: {
        [type]: value,
      },
    });

    const mapContactIds =
      data.type === Integrations.XERO
        ? data.invoices.map((inv) => inv?.contact?.contactID)
        : data.invoices.map((inv) => inv?.CustomerRef?.value);

    const { data: contacts } = await http.post(`contacts/contact/ids`, {
      ids: mapContactIds,
    });

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
      const { data: items } = await http.post(`items/item/ids-or-codes`, {
        payload: itemCodesArray,
        type: Integrations.XERO,
      });

      const new_account_codes = account_arr.flat();
      const concatAccountCodes = new_account_codes.concat(
        mapAccountCodesFromPayments
      );

      const { data: accounts } = await http.post(`accounts/account/codes`, {
        codes: concatAccountCodes,
      });

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
      const { data: items } = await http.post('items/item/ids-or-codes', {
        payload: new_item_ids_array,
        type: Integrations.QUICK_BOOK,
      });

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
      await http.post(`payments/payment/add`, {
        payments: newPaymentPayload,
      });
    }

    console.log('sending transaction...');
    if (transactions.length > 0) {
      await http.post('accounts/transaction/api', {
        transactions,
      });
    }
  }
}
