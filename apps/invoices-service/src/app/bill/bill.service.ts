import { Injectable } from '@nestjs/common';
import { Between, getCustomRepository, ILike, In } from 'typeorm';
import axios from 'axios';
import { BillRepository } from '../repositories/bill.repository';
import { BillItemRepository } from '../repositories/billItem.repository';
import { Sorting } from '@invyce/sorting';
import {
  IBaseUser,
  IPage,
  IBillWithResponse,
  IRequest,
  IBill,
} from '@invyce/interfaces';
import { BillDto, BillIdsDto } from '../dto/bill.dto';

@Injectable()
export class BillService {
  async IndexBill(
    user: IBaseUser,
    queryData: IPage
  ): Promise<IBillWithResponse> {
    const { page_no, page_size, status, sort, query } = queryData;

    let bills;
    const ps: number = parseInt(page_size);
    const pn: number = parseInt(page_no);
    const { sort_column, sort_order } = await Sorting(sort);

    const total = await getCustomRepository(BillRepository).count({
      status,
      organizationId: user.organizationId,
      // invoiceType: invoice_type,
      branchId: user.branchId,
    });

    if (query) {
      const filterData = Buffer.from(query, 'base64').toString();
      const data = JSON.parse(filterData);

      for (const i in data) {
        if (data[i].type === 'search') {
          const val = data[i].value?.split('%')[1];
          // const lower = val.toLowerCase();
          bills = await getCustomRepository(BillRepository).find({
            where: {
              status: 1,
              branchId: user.branchId,
              organizationId: user.organizationId,
              [i]: ILike(val),
            },
            skip: pn * ps - ps,
            take: ps,
            relations: ['purchaseItems', 'purchaseItems.account'],
          });
        } else if (data[i].type === 'compare') {
          bills = await getCustomRepository(BillRepository).find({
            where: {
              status: 1,
              branchId: user.branchId,
              organizationId: user.organizationId,
              [i]: In(data[i].value),
            },
            skip: pn * ps - ps,
            take: ps,
            relations: ['purchaseItems', 'purchaseItems.account'],
          });
        } else if (data[i].type === 'date-between') {
          const start_date = data[i].value[0];
          const end_date = data[i].value[1];
          bills = await getCustomRepository(BillRepository).find({
            where: {
              status: 1,
              organizationId: user.organizationId,
              branchId: user.branchId,
              [i]: Between(start_date, end_date),
            },
            skip: pn * ps - ps,
            take: ps,
            relations: ['purchaseItems', 'purchaseItems.account'],
          });
        }

        return {
          result: bills,
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
    } else {
      bills = await getCustomRepository(BillRepository).find({
        where: {
          status: status,
          // invoiceType: invoice_type,
          organizationId: user.organizationId,
          branchId: user.branchId,
        },
        skip: pn * ps - ps,
        take: ps,
        order: {
          [sort_column]: sort_order,
        },
        relations: ['purchaseItems'],
      });
    }

    return {
      result: bills,
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

  async CreateBill(dto: BillDto, req: IRequest): Promise<IBill> {
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

    const accountCodesArray = ['15002'];
    const { data: accounts } = await http.post(`accounts/account/codes`, {
      codes: accountCodesArray,
    });

    const bill = await getCustomRepository(BillRepository).save({
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
      isReturn: dto.isReturn,
      comment: dto.comment,
      organizationId: req.user.organizationId,
      branchId: req.user.branchId,
      createdById: req.user.id,
      updatedById: req.user.id,
      status: dto.status,
    });

    const debitsArrray = [];
    for (const item of dto.invoice_items) {
      await getCustomRepository(BillItemRepository).save({
        itemId: item.itemId,
        billId: bill.id,
        description: item.description,
        quantity: item.quantity,
        itemDiscount: item.itemDiscount,
        purchasePrice: item.purchasePrice,
        costOfGoodAmount: item.costOfGoodAmount,
        sequence: item.sequence,
        tax: item.tax,
        total: item.total,
        status: 1,
      });

      const debits = {
        amount: item.purchasePrice,
        account_id: item.accountId,
      };
      debitsArrray.push(debits);
    }

    const creditsArray = [
      {
        account_id: accounts.find((i) => i.code === '15002').id,
        amount: dto.netTotal,
      },
    ];

    const payload = {
      dr: debitsArrray,
      cr: creditsArray,
      reference: dto.reference,
      amount: dto.netTotal,
    };

    const { data: transaction } = await http.post('accounts/transaction/api', {
      transactions: payload,
    });

    return bill;
  }

  async FindById(billId: number, req: IRequest): Promise<IBill> {
    const [bill] = await getCustomRepository(BillRepository).find({
      where: { id: billId },
      relations: ['purchaseItems'],
    });

    let new_bill;
    if (bill?.contactId) {
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

      const contactId = bill?.contactId;
      const itemIdsArray = bill?.purchaseItems.map((ids) => ids.itemId);

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

      const billItemArr = [];
      for (const i of bill.purchaseItems) {
        const item = items.find((j) => i.itemId === j.id);
        billItemArr.push({ ...i, item });
      }

      if (billItemArr.length > 0) {
        new_bill = {
          ...bill,
          contact: contact.result,
          purchaseItems: billItemArr,
        };
      }
    }
    return new_bill ? new_bill : bill;
  }

  async deleteBill(billIds: BillIdsDto): Promise<boolean> {
    for (const i of billIds.ids) {
      await getCustomRepository(BillRepository).update(
        { id: i },
        { status: 0 }
      );
    }

    return true;
  }

  async FindByBillIds(billds: BillIdsDto): Promise<IBill[]> {
    return await getCustomRepository(BillRepository).find({
      where: { id: In(billds.ids) },
    });
  }
}
