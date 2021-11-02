import { Injectable } from '@nestjs/common';
import { Between, getCustomRepository, ILike, In, LessThan } from 'typeorm';
import axios from 'axios';
require('dotenv').config();
import { InvoiceRepository } from '../repositories/invoice.repository';
import { InvoiceItemRepository } from '../repositories/invoiceItem.repository';
import { Sorting } from '@invyce/sorting';
import { BillRepository } from '../repositories/bill.repository';
import { CreditNoteRepository } from '../repositories/creditNote.repository';
import { CreditNoteItemRepository } from '../repositories/creditNoteItem.repository';
import {
  Integrations,
  XeroStatuses,
  XeroTypes,
} from '@invyce/global-constants';
import { CreditNoteItems } from '../entities/creditNoteItem.entity';

@Injectable()
export class InvoiceService {
  async IndexInvoice(req, queryData) {
    const { page_no, page_size, invoice_type, type, status, sort, query } =
      queryData;
    let invoices;

    const { sort_column, sort_order } = await Sorting(sort);

    const total = await getCustomRepository(InvoiceRepository).count({
      status,
      organizationId: req.user.organizationId,
      invoiceType: invoice_type,
      // branchId: user.branchId,
    });

    let invoice_arr = [];
    if (query) {
      const filterData: any = Buffer.from(query, 'base64').toString();
      const data = JSON.parse(filterData);

      for (let i in data) {
        if (data[i].type === 'search') {
          const val = data[i].value?.split('%')[1];
          // const lower = val.toLowerCase();
          invoices = await getCustomRepository(InvoiceRepository).find({
            where: {
              status: 1,
              organizationId: req.user.organizationId,
              [i]: ILike(val),
            },
            skip: page_no * page_size - page_size,
            take: page_size,
            relations: ['transactionItems', 'transactionItems.account'],
          });
        } else if (data[i].type === 'compare') {
          invoices = await getCustomRepository(InvoiceRepository).find({
            where: {
              status: 1,
              organizationId: req.user.organizationId,
              [i]: In(data[i].value),
            },
            skip: page_no * page_size - page_size,
            take: page_size,
            relations: ['transactionItems', 'transactionItems.account'],
          });
        } else if (data[i].type === 'date-between') {
          const start_date = data[i].value[0];
          const end_date = data[i].value[1];
          invoices = await getCustomRepository(InvoiceRepository).find({
            where: {
              status: 1,
              organizationId: req.user.organizationId,
              [i]: Between(start_date, end_date),
            },
            skip: page_no * page_size - page_size,
            take: page_size,
            relations: ['transactionItems', 'transactionItems.account'],
          });
        }

        return {
          invoices: invoices,
          pagination: {
            total,
            total_pages: Math.ceil(total / page_size),
            page_size: parseInt(page_size) || 20,
            // page_total: null,
            page_no: parseInt(page_no),
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
            organizationId: req.user.organizationId,
            // branchId: user.branchId
          },
          skip: page_no * page_size - page_size,
          take: page_size,
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

        for (let i of invoices) {
          let balance = balances.find((bal) => bal.id === i.id);
          invoice_arr.push({
            ...i,
            paid_amount: balance.invoice.balance,
            due_amount: i.netTotal - balance.invoice.balance,
          });
        }
      } else if (type === 'AWAITING_PAYMENT') {
        invoices = await getCustomRepository(InvoiceRepository).find({
          where: {
            // status: status,
            invoiceType: invoice_type,
            organizationId: req.user.organizationId,
            // branchId: user.branchId
          },
          skip: page_no * page_size - page_size,
          take: page_size,
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

        for (let i of invoices) {
          let balance = balances.find((bal) => bal.id === i.id);
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
            // status: status,
            invoiceType: invoice_type,
            organizationId: req.user.organizationId,
            // branchId: user.branchId
          },
          skip: page_no * page_size - page_size,
          take: page_size,
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

        for (let i of invoices) {
          let balance = balances.find((bal) => bal.id === i.id);
          if (balance.invoice.balance > 0) {
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
            // status: status,
            invoiceType: invoice_type,
            organizationId: req.user.organizationId,
            dueDate: LessThan(new Date()),
            // branchId: user.branchId
          },
          skip: page_no * page_size - page_size,
          take: page_size,
          order: {
            [sort_column]: sort_order,
          },
          relations: ['invoiceItems'],
        });
      }
    }

    return {
      invoices: invoice_arr.length > 0 ? invoice_arr : invoices,
      pagination: {
        total,
        total_pages: Math.ceil(total / page_size),
        page_size: parseInt(page_size) || 20,
        // page_total: null,
        page_no: parseInt(page_no),
        sort_column: sort_column,
        sort_order: sort_order,
      },
    };
  }

  async CreateInvoice(dto, data) {
    if (dto && dto.isNewRecord === false) {
      // we need to update invoice
      const invoice: any = await getCustomRepository(InvoiceRepository).find({
        where: {
          id: dto.id,
          organizationId: data.organizationId,
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
          date: dto.date || invoice.date,
          invoiceType: dto.invoiceType || invoice.invoiceType,
          directTax: dto.directTax || invoice.directTax,
          indirectTax: dto.indirectTax || invoice.indirectTax,
          isTaxIncluded: dto.isTaxIncluded || invoice.isTaxIncluded,
          comment: dto.comment || invoice.comment,
          organizationId: invoice.organizationId,
          branchId: invoice.branchId,
          createdById: invoice.createdById,
          updatedById: data.id,
          status: dto.status || invoice.status,
        }
      );

      await getCustomRepository(InvoiceItemRepository).delete({
        invoiceId: dto.id,
      });

      for (let item of dto.invoice_items) {
        await getCustomRepository(InvoiceItemRepository).save({
          itemId: item.itemId,
          invoiceId: invoice.id,
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
        date: dto.date,
        invoiceType: dto.invoiceType,
        directTax: dto.directTax,
        indirectTax: dto.indirectTax,
        isTaxIncluded: dto.isTaxIncluded,
        comment: dto.comment,
        organizationId: data.organizationId,
        branchId: data.branchId,
        createdById: data.id,
        updatedById: data.id,
        status: dto.status,
      });

      for (let item of dto.invoice_items) {
        await getCustomRepository(InvoiceItemRepository).save({
          itemId: item.itemId,
          invoiceId: invoice.id,
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
      }

      return invoice;
    }
  }

  async FindById(invoiceId, req) {
    const [invoice] = await getCustomRepository(InvoiceRepository).find({
      where: { id: invoiceId },
      relations: ['invoiceItems'],
    });

    let new_invoice: any;
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

      const contactRequest: any = {
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

      const { data: contact } = await axios(contactRequest);
      const { data: items } = await http.post(`items/item/ids`, {
        ids: itemIdsArray,
      });

      let invoiceItemArr = [];
      for (let i of invoice.invoiceItems) {
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

  async GetInvoiceNumber(type, user) {
    let invoiceNo = '';
    if (type === 'SI') {
      const [invoice] = await getCustomRepository(InvoiceRepository).find({
        where: {
          organizationId: user.organizationId,
          status: 1,
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
        let o = (m += 1);
        invoiceNo = `INV-${year}-${o}`;
      } else {
        invoiceNo = `INV-${new Date().getFullYear()}-1`;
      }
    } else if (type === 'BILL') {
      const [bill] = await getCustomRepository(BillRepository).find({
        where: {
          organizationId: user.organizationId,
          status: 1,
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
        let o = (m += 1);
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
          status: 1,
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
        let o = (m += 1);
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

    const requestObj: any = {
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

    const data = await axios(requestObj);
    console.log(data.data);
  }

  async deleteInvoice(invoiceIds) {
    for (let i of invoiceIds.ids) {
      await getCustomRepository(InvoiceRepository).update(
        { id: i },
        { status: 0 }
      );
    }

    return true;
  }

  async InvoicesAgainstContactId(contactId, req, type) {
    if (type == 2) {
      const invoices = await getCustomRepository(InvoiceRepository).find({
        where: {
          contactId: contactId,
          organizationId: req.user.organizationId,
        },
      });

      let inv_arr = [];
      if (invoices.length > 0) {
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

        const invoiceIds = invoices?.map((i) => i.id);

        const http = axios.create({
          baseURL: 'http://localhost',
          headers: {
            [type]: value,
          },
        });

        const { data: payments } = await http.post(`payments/payment/invoice`, {
          ids: invoiceIds,
          type: 'INVOICE',
        });

        for (let inv of invoices) {
          let balance = payments.find((pay) => pay.id === inv.id);

          inv_arr.push({
            ...inv,
            balance:
              inv.netTotal + (balance.invoice.balance || 0) || inv.netTotal,
          });
        }
      }

      return inv_arr;
    } else if (type == 1) {
      const bills = await getCustomRepository(BillRepository).find({
        where: {
          contactId: contactId,
          organizationId: req.user.organizationId,
        },
      });

      let inv_arr = [];
      if (bills.length > 0) {
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

        const invoiceIds = bills?.map((i) => i.id);

        const http = axios.create({
          baseURL: 'http://localhost',
          headers: {
            [type]: value,
          },
        });

        const { data: payments } = await http.post(`payments/payment/invoice`, {
          ids: invoiceIds,
          type: 'BILL',
        });

        for (let inv of bills) {
          let balance = payments.find((pay) => pay.id === inv.id);

          inv_arr.push({
            ...inv,
            balance:
              inv.netTotal + (balance.invoice.balance || 0) || inv.netTotal,
          });
        }
      }
      return inv_arr;
    }
  }

  async FindByInvoiceIds(invoiceIds) {
    return await getCustomRepository(InvoiceRepository).find({
      where: { id: In(invoiceIds.ids) },
    });
  }

  async SyncInvoices(data, req) {
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

    let item_arr: any = [];
    let account_arr: any = [];
    for (let i of data.invoices) {
      const mapItemCodes = i.lineItems.map((items) => items.itemCode);
      const mapAccountCodes = i.lineItems.map(
        (accounts) => accounts.accountCode
      );

      if (!mapItemCodes.includes(undefined)) {
        item_arr.push(mapItemCodes);
      }

      account_arr.push(mapAccountCodes);
    }

    const newest_arr = item_arr.flat();
    const { data: items } = await http.post(`items/item/codes`, {
      codes: newest_arr,
    });

    const new_account_codes = account_arr.flat();
    const { data: accounts } = await http.post(`accounts/account/codes`, {
      codes: new_account_codes,
    });

    const mapContactIds = data.invoices.map((inv) => inv?.contact?.contactID);
    const { data: contacts } = await http.post(`contacts/contact/ids`, {
      ids: mapContactIds,
    });

    for (let i of data.credit_notes) {
      if (i.type === 'ACCRECCREDIT') {
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
          status: XeroStatuses[`${i.status}`],
          importedCreditNoteId: i.creditNoteID,
          importedFrom: Integrations.XERO,
          organizationId: req.user.organizationId,
          createdById: req.user.id,
          updatedById: req.user.id,
        });

        for (let j of i.lineItems) {
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
    }

    let payment_arr = [];
    for (let inv of data.invoices) {
      const invoices = await getCustomRepository(InvoiceRepository).find({
        importedInvoiceId: inv.invoiceID,
        organizationId: req.user.organizationId,
      });

      if (invoices.length === 0 && XeroTypes.INVOICE) {
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
          status: XeroStatuses[`${inv.status}`],
        });

        for (let j of inv.lineItems) {
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
            accountId: await accounts.find((ids) => ids.code === j.accountCode)
              .id,
            organizationId: req.user.organizationId,
            createdById: req.user.userId,
            status: invoice.status,
          });
        }

        if (inv?.creditNotes?.length > 0) {
          for (let cn of inv.creditNotes) {
            await getCustomRepository(CreditNoteRepository).update(
              { importedCreditNoteId: cn.creditNoteID },
              {
                invoiceId: invoice.id,
              }
            );
          }
        }

        if (inv?.payments?.length > 0) {
          for (let pay of inv.payments) {
            payment_arr.push({
              balance: pay.amount,
              date: pay.date,
              reference: pay.reference,
              contactId: invoice.contactId,
              invoiceId: invoice.id,

              paymentId: pay.paymentID,
              organizationId: req.user.organizationId,
              status: invoice.status,
            });
          }
        }
      } else if (XeroTypes.BILL) {
        const bill = await getCustomRepository(BillRepository).save({});
      }
    }

    await http.post(`payments/payment/add`, {
      payments: payment_arr,
    });
  }
}
