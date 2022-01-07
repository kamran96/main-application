import { Inject, Injectable } from '@nestjs/common';
import { Between, getCustomRepository, ILike, In } from 'typeorm';
import axios from 'axios';
import * as moment from 'moment';
import { Sorting } from '@invyce/sorting';
import { CreditNoteRepository } from '../repositories/creditNote.repository';
import { CreditNoteItemRepository } from '../repositories/creditNoteItem.repository';
import {
  IBaseUser,
  IPage,
  ICreditNoteWithResponse,
  ICreditNote,
  IRequest,
} from '@invyce/interfaces';
import {
  CreditNoteType,
  EntryType,
  PaymentModes,
  Statuses,
} from '@invyce/global-constants';

import { CreditNoteDto } from '../dto/credit-note.dto';
import { InvoiceRepository } from '../repositories/invoice.repository';
import { ClientProxy } from '@nestjs/microservices';
import { SEND_FORGOT_PASSWORD } from '@invyce/send-email';

@Injectable()
export class CreditNoteService {
  constructor(
    @Inject('EMAIL_SERVICE') private readonly emailService: ClientProxy
  ) {}

  async IndexCreditNote(
    user: IBaseUser,
    queryData: IPage
  ): Promise<ICreditNoteWithResponse> {
    const { page_no, page_size, status, sort, query } = queryData;

    let credit_note;
    const ps: number = parseInt(page_size);
    const pn: number = parseInt(page_no);
    const { sort_column, sort_order } = await Sorting(sort);

    const total = await getCustomRepository(CreditNoteRepository).count({
      status,
      organizationId: user.organizationId,
      branchId: user.branchId,
    });

    if (query) {
      const filterData = Buffer.from(query, 'base64').toString();
      const data = JSON.parse(filterData);

      for (const i in data) {
        if (data[i].type === 'search') {
          const val = data[i].value?.split('%')[1];
          // const lower = val.toLowerCase();
          credit_note = await getCustomRepository(CreditNoteRepository).find({
            where: {
              status: status,
              branchId: user.branchId,
              organizationId: user.organizationId,
              [i]: ILike(val),
            },
            skip: pn * ps - ps,
            take: ps,
            // relations: ['creditNoteItems', 'creditNoteItems.account'],
          });
        } else if (data[i].type === 'compare') {
          credit_note = await getCustomRepository(CreditNoteRepository).find({
            where: {
              status: status,
              branchId: user.branchId,
              organizationId: user.organizationId,
              [i]: In(data[i].value),
            },
            skip: pn * ps - ps,
            take: ps,
            // relations: ['creditNoteItems', 'creditNoteItems.account'],
          });
        } else if (data[i].type === 'date-between') {
          const start_date = data[i].value[0];
          const end_date = data[i].value[1];
          credit_note = await getCustomRepository(CreditNoteRepository).find({
            where: {
              status: status,
              organizationId: user.organizationId,
              branchId: user.branchId,
              [i]: Between(start_date, end_date),
            },
            skip: pn * ps - ps,
            take: ps,
            // relations: ['creditNoteItems', 'creditNoteItems.account'],
          });
        }

        return {
          result: credit_note,
          pagination: {
            total,
            total_pages: Math.ceil(total / ps),
            page_size: ps || 20,
            page_no: ps,
            sort_column: sort_column,
            sort_order: sort_order,
          },
        };
      }
    } else {
      credit_note = await getCustomRepository(CreditNoteRepository).find({
        where: {
          status: status,
          organizationId: user.organizationId,
          branchId: user.branchId,
        },
        skip: pn * ps - ps,
        take: ps,
        order: {
          [sort_column]: sort_order,
        },
        relations: ['creditNoteItems'],
      });
    }

    return {
      result: credit_note,
      pagination: {
        total,
        total_pages: Math.ceil(total / ps),
        page_size: ps || 20,
        page_no: pn,
        sort_column: sort_column,
        sort_order: sort_order,
      },
    };
  }

  async CreateCreditNote(
    dto: CreditNoteDto,
    req: IRequest
  ): Promise<ICreditNote> {
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

    const accountCodesArray = ['15004', '40001'];
    const { data: accounts } = await http.post(`accounts/account/codes`, {
      codes: accountCodesArray,
    });

    const mapItemIds = dto.invoice_items.map((ids) => ids.itemId);

    const { data: items } = await http.post(`items/item/ids`, {
      ids: mapItemIds,
    });

    const creditsArray = [];
    const debitsArray = [];
    const itemLedgerArray = [];
    const credit_note = await getCustomRepository(CreditNoteRepository).save({
      contactId: dto.contactId,
      reference: dto.reference,
      issueDate: dto.issueDate,
      dueDate: dto.dueDate,
      invoiceId: dto.invoiceId,
      billId: dto.billId,
      invoiceType: dto.invoiceType,
      invoiceNumber: dto.invoiceNumber,
      discount: dto.discount,
      grossTotal: dto.grossTotal,
      netTotal: dto.netTotal,
      date: dto.date,
      type: dto.type,
      comment: dto.comment,
      organizationId: req.user.organizationId,
      branchId: req.user.branchId,
      createdById: req.user.id,
      updatedById: req.user.id,
      status: dto.status,
    });

    const credit_note_item_array = [];
    for (const item of dto.invoice_items) {
      const credit_note_item = await getCustomRepository(
        CreditNoteItemRepository
      ).save({
        itemId: item.itemId,
        creditNoteId: credit_note.id,
        description: item.description,
        quantity: item.quantity,
        itemDiscount: item.itemDiscount,
        unitPrice: item.unitPrice,
        costOfGoodAmount: item.costOfGoodAmount,
        sequence: item.sequence,
        tax: item.tax,
        total: item.total,
        accountId: item.accountId,
        status: credit_note.status,
      });

      credit_note_item_array.push(credit_note_item);

      const itemDetail = items.find((i) => i.id === item.itemId);
      if (itemDetail.hasInventory) {
        itemLedgerArray.push({
          itemId: item.itemId,
          value: item.quantity,
          targetId: credit_note.id,
          type:
            credit_note.invoiceType === CreditNoteType.ACCRECCREDIT
              ? 'increase'
              : 'decrease',
          action: 'create',
        });
      }

      if (dto.invoiceId) {
        const invoice = await getCustomRepository(InvoiceRepository).findOne({
          where: {
            id: dto.invoiceId,
          },
        });

        let i = 0;
        const invoice_details = [];
        for (const cn of credit_note_item_array) {
          i++;
          if (i <= 5) {
            invoice_details.push({
              itemName: items.find((j) => cn.itemId === j.id).name,
              quantity: cn.quantity,
              price: cn.unitPrice,
              itemDiscount: cn.itemDiscount,
              tax: cn.tax,
              total: cn.total,
            });
          }
        }

        const payload = {
          to: req.user.email,
          from: 'no-reply@invyce.com',
          TemplateAlias: 'credit-note-applied',
          TemplateModel: {
            user_name: req.user.profile.fullName,
            invoice_name: invoice.invoiceNumber,
            issueDate: moment(credit_note.issueDate).format('llll'),
            invoice_details,
            gross_total: credit_note.grossTotal,
            itemDisTotal: credit_note.discount,
            net_total: credit_note.netTotal,
          },
        };

        await this.emailService.emit(SEND_FORGOT_PASSWORD, payload);
      }

      if (credit_note.invoiceType === CreditNoteType.ACCRECCREDIT) {
        const debit = {
          amount: Number(item.quantity) * Number(item.unitPrice),
          account_id: item.accountId,
        };

        debitsArray.push(debit);
      } else if (credit_note.invoiceType === CreditNoteType.ACCPAYCREDIT) {
        const credit = {
          amount: Number(item.quantity) * Number(item.unitPrice),
          account_id: item.accountId,
        };

        creditsArray.push(credit);
      }

      if (credit_note.status === Statuses.AUTHORISED) {
        await http.post(`reports/inventory/manage`, {
          payload: itemLedgerArray,
        });

        if (credit_note.invoiceType === CreditNoteType.ACCRECCREDIT) {
          const credit = {
            account_id: await accounts.find((i) => i.code === '15004').id,
            amount: dto.netTotal,
          };

          creditsArray.push(credit);
        } else if (credit_note.invoiceType === CreditNoteType.ACCPAYCREDIT) {
          const debit = {
            account_id: await accounts.find((i) => i.code === '40001').id,
            amount: dto.netTotal,
          };

          debitsArray.push(debit);
        }

        const payload = {
          dr: debitsArray,
          cr: creditsArray,
          type:
            credit_note.invoiceType === CreditNoteType.ACCRECCREDIT
              ? 'invoice'
              : 'bill',
          referense: dto.reference,
          amount: dto.grossTotal,
          status: credit_note.status,
        };

        const { data: transaction } = await http.post(
          'accounts/transaction/api',
          {
            transactions: payload,
          }
        );

        const id =
          credit_note.invoiceType === CreditNoteType.ACCRECCREDIT
            ? 'invoiceId'
            : 'billId';

        const paymentArr = [
          {
            ...credit_note,
            [id]: credit_note.id,
            balance: credit_note.netTotal,
            data: credit_note.issueDate,
            paymentType:
              credit_note.invoiceType === CreditNoteType.ACCRECCREDIT
                ? PaymentModes.INVOICES
                : PaymentModes.BILLS,
            transactionId: transaction.id,
            entryType: EntryType.CREDIT,
          },
        ];

        await http.post(`payments/payment/add`, {
          payments: paymentArr,
        });
        await http.get(`contacts/contact/balance`);
      }
    }

    return credit_note;
  }

  async FindById(creditNoteId: number, req: IRequest): Promise<ICreditNote> {
    const creditNote = await getCustomRepository(CreditNoteRepository).findOne({
      where: { id: creditNoteId },
      relations: ['creditNoteItems'],
    });

    const invoice = getCustomRepository(InvoiceRepository).findOne({
      select: ['id', 'invoiceNumber'],
      where: { id: creditNote.invoiceId },
    });

    let new_credit_note;
    if (creditNote?.contactId) {
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

      const contactId = creditNote?.contactId;
      const itemIdsArray = creditNote?.creditNoteItems.map((ids) => ids.itemId);

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

      const { data: payments } = await http.post(`payments/payment/invoice`, {
        ids: [creditNoteId],
        type: 'BILL',
      });

      const { data: contact } = await axios(contactRequest as unknown);
      const { data: items } = await http.post(`items/item/ids`, {
        ids: itemIdsArray,
      });

      const balance = payments.find(
        (bal) => parseInt(bal.id) === creditNote.id
      );
      const paid_amount = balance?.invoice?.balance || 0;
      const due_amount = balance?.invoice?.balance
        ? creditNote.netTotal - balance?.invoice?.balance
        : creditNote.netTotal;

      const payment_status = () => {
        if (paid_amount < due_amount && due_amount < creditNote?.netTotal) {
          return 'Partial Payment';
        } else if (due_amount === creditNote?.netTotal) {
          return 'Payment Pending';
        } else if (paid_amount === creditNote?.netTotal) {
          return 'Full Payment';
        } else {
          return null;
        }
      };

      const newCreditNote = {
        ...creditNote,
        paid_amount,
        due_amount,
        payment_status: payment_status(),
      };

      const creditNoteItemArr = [];

      for (const i of creditNote.creditNoteItems) {
        const item = items.find((j) => i.itemId === j.id);
        creditNoteItemArr.push({ ...i, item });
      }

      if (creditNoteItemArr.length > 0) {
        new_credit_note = {
          ...newCreditNote,
          relation: {
            links: invoice,
            type: 'SI',
          },
          contact: contact.result,
          creditNoteItems: creditNoteItemArr,
        };
      }
    }
    return new_credit_note ? new_credit_note : creditNote;
  }
}
