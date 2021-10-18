import { Injectable } from '@nestjs/common';
import { Between, getCustomRepository, ILike, In } from 'typeorm';
import axios from 'axios';
import { BillRepository } from '../repositories/bill.repository';
import { BillItemRepository } from '../repositories/billItem.repository';
import { Sorting } from '@invyce/sorting';

@Injectable()
export class BillService {
  async IndexBill(user, queryData) {
    const { page_no, page_size, invoice_type, status, sort, query } = queryData;
    let bills;

    const { sort_column, sort_order } = await Sorting(sort);

    const total = await getCustomRepository(BillRepository).count({
      status,
      organizationId: user.organizationId,
      // invoiceType: invoice_type,
      // branchId: user.branchId,
    });

    if (query) {
      const filterData: any = Buffer.from(query, 'base64').toString();
      const data = JSON.parse(filterData);

      for (let i in data) {
        if (data[i].type === 'search') {
          const val = data[i].value?.split('%')[1];
          // const lower = val.toLowerCase();
          bills = await getCustomRepository(BillRepository).find({
            where: {
              status: 1,
              organizationId: user.organizationId,
              [i]: ILike(val),
            },
            skip: page_no * page_size - page_size,
            take: page_size,
            relations: ['purchaseItems', 'purchaseItems.account'],
          });
        } else if (data[i].type === 'compare') {
          bills = await getCustomRepository(BillRepository).find({
            where: {
              status: 1,
              organizationId: user.organizationId,
              [i]: In(data[i].value),
            },
            skip: page_no * page_size - page_size,
            take: page_size,
            relations: ['purchaseItems', 'purchaseItems.account'],
          });
        } else if (data[i].type === 'date-between') {
          const start_date = data[i].value[0];
          const end_date = data[i].value[1];
          bills = await getCustomRepository(BillRepository).find({
            where: {
              status: 1,
              organizationId: user.organizationId,
              [i]: Between(start_date, end_date),
            },
            skip: page_no * page_size - page_size,
            take: page_size,
            relations: ['purchaseItems', 'purchaseItems.account'],
          });
        }

        return {
          bills: bills,
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
      bills = await getCustomRepository(BillRepository).find({
        where: {
          status: status,
          // invoiceType: invoice_type,
          organizationId: user.organizationId,
          // branchId: user.branchId
        },
        skip: page_no * page_size - page_size,
        take: page_size,
        order: {
          [sort_column]: sort_order,
        },
        relations: ['purchaseItems'],
      });
    }

    return {
      bills,
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

  async CreateBill(dto, data) {
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
      organizationId: data.organizationId,
      branchId: data.branchId,
      createdById: data.id,
      updatedById: data.id,
      status: dto.status,
    });

    for (let item of dto.invoice_items) {
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
    }

    return bill;
  }

  async FindById(billId, req) {
    const [bill] = await getCustomRepository(BillRepository).find({
      where: { id: billId },
      relations: ['purchaseItems'],
    });

    let new_bill: any;
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

      let billItemArr = [];
      for (let i of bill.purchaseItems) {
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

  async deleteBill(billIds) {
    for (let i of billIds.ids) {
      await getCustomRepository(BillRepository).update(
        { id: i },
        { status: 0 }
      );
    }

    return true;
  }

  async FindByBillIds(billds) {
    return await getCustomRepository(BillRepository).find({
      where: { id: In(billds.ids) },
    });
  }
}
