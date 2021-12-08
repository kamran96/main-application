import { Injectable } from '@nestjs/common';
import { Between, getCustomRepository, ILike, In } from 'typeorm';
import axios from 'axios';
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

@Injectable()
export class CreditNoteService {
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
          // status: status,
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
      status: 1,
    });

    for (const item of dto.invoice_items) {
      await getCustomRepository(CreditNoteItemRepository).save({
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
        status: 1,
      });

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

    return await this.FindById(credit_note.id);
  }

  async FindById(creditNoteId: number): Promise<ICreditNote> {
    return await getCustomRepository(CreditNoteRepository).findOne({
      where: { id: creditNoteId },
      relations: ['creditNoteItems'],
    });
  }
}
