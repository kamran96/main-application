import { Injectable } from '@nestjs/common';
import { Between, getCustomRepository, ILike, In, LessThan } from 'typeorm';
import axios from 'axios';
import { BillRepository } from '../repositories/bill.repository';
import { BillItemRepository } from '../repositories/billItem.repository';
import { Sorting } from '@invyce/sorting';
import { IPage, IBillWithResponse, IRequest, IBill } from '@invyce/interfaces';
import { BillDto, BillIdsDto } from '../dto/bill.dto';
import { EntryType, PaymentModes, Statuses } from '@invyce/global-constants';

@Injectable()
export class BillService {
  async IndexBill(req: IRequest, queryData: IPage): Promise<IBillWithResponse> {
    const { page_no, page_size, status, type, sort, query } = queryData;

    let bills;
    const ps: number = parseInt(page_size);
    const pn: number = parseInt(page_no);
    const { sort_column, sort_order } = await Sorting(sort);

    const total = await getCustomRepository(BillRepository).count({
      status,
      organizationId: req.user.organizationId,
      // invoiceType: invoice_type,
      branchId: req.user.branchId,
    });

    const bill_arr = [];
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
              branchId: req.user.branchId,
              organizationId: req.user.organizationId,
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
              branchId: req.user.branchId,
              organizationId: req.user.organizationId,
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
              organizationId: req.user.organizationId,
              branchId: req.user.branchId,
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
        bills = await getCustomRepository(BillRepository).find({
          where: {
            status: status,
            // invoiceType: invoice_type,
            organizationId: req.user.organizationId,
            branchId: req.user.branchId,
          },
          skip: pn * ps - ps,
          take: ps,
          order: {
            [sort_column]: sort_order,
          },
          relations: ['purchaseItems'],
        });

        const mapBillIds = bills
          .filter((b) => b.status === Statuses.AUTHORISED)
          .map((bill) => bill.id);

        const { data: balances } = await http.post(`payments/payment/invoice`, {
          ids: mapBillIds,
          type: 'BILL',
        });

        for (const i of bills) {
          const balance = balances.find((bal) => bal.id === i.id);
          bill_arr.push({
            ...i,
            paid_amount: balance?.invoice?.balance,
            due_amount: i?.netTotal - balance?.invoice?.balance,
          });
        }
      } else if (type === 'AWATING_PAYMENT') {
        bills = await getCustomRepository(BillRepository).find({
          where: {
            status: status,
            // invoiceType: invoice_type,
            organizationId: req.user.organizationId,
            branchId: req.user.branchId,
          },
          skip: pn * ps - ps,
          take: ps,
          order: {
            [sort_column]: sort_order,
          },
          relations: ['purchaseItems'],
        });

        const mapBillIds = bills.map((bill) => bill.id);

        const { data: balances } = await http.post(`payments/payment/invoice`, {
          ids: mapBillIds,
          type: 'BILL',
        });

        for (const i of bills) {
          const balance = balances.find((bal) => bal.id === i.id);
          if (balance.invoice.balance === 0) {
            bill_arr.push({
              ...i,
              paid_amount: balance.invoice.balance,
              due_amount: i.netTotal - balance.invoice.balance,
            });
          }
        }
      } else if (type === 'PAID') {
        bills = await getCustomRepository(BillRepository).find({
          where: {
            status: status,
            // invoiceType: invoice_type,
            organizationId: req.user.organizationId,
            branchId: req.user.branchId,
          },
          skip: pn * ps - ps,
          take: ps,
          order: {
            [sort_column]: sort_order,
          },
          relations: ['purchaseItems'],
        });

        const mapBillIds = bills.map((bill) => bill.id);

        const { data: balances } = await http.post(`payments/payment/invoice`, {
          ids: mapBillIds,
          type: 'BILL',
        });

        for (const i of bills) {
          const balance = balances.find((bal) => bal.id === i.id);
          if (balance.invoice.balance !== 0) {
            bill_arr.push({
              ...i,
              paid_amount: balance.invoice.balance,
              due_amount: i.netTotal - balance.invoice.balance,
            });
          }
        }
      } else if (type === 'DUE_PAYMENTS') {
        bills = await getCustomRepository(BillRepository).find({
          where: {
            status: status,
            // invoiceType: invoice_type,
            organizationId: req.user.organizationId,
            dueDate: LessThan(new Date()),
            branchId: req.user.branchId,
          },
          skip: pn * ps - ps,
          take: ps,
          order: {
            [sort_column]: sort_order,
          },
          relations: ['purchaseItems'],
        });

        for (const i of bills) {
          bill_arr.push({
            ...i,
          });
        }
      }
    }

    return {
      result: bill_arr,
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

    const accountCodesArray = ['40001', '55002'];
    const { data: accounts } = await http.post(`accounts/account/codes`, {
      codes: accountCodesArray,
    });

    const mapItemIds = dto.invoice_items.map((ids) => ids.itemId);
    const { data: items } = await http.post(`items/item/ids`, {
      ids: mapItemIds,
    });

    const itemLedgerArray = [];
    const debitsArrray = [];
    if (dto?.isNewRecord === false) {
      const bill: IBill = await getCustomRepository(BillRepository).findOne({
        where: {
          id: dto.id,
          organizationId: req.user.organizationId,
        },
      });

      await getCustomRepository(BillRepository).update(
        { id: dto.id },
        {
          contactId: dto.contactId || bill.contactId,
          reference: dto.reference || bill.reference,
          issueDate: dto.issueDate || bill.issueDate,
          dueDate: dto.dueDate || bill.dueDate,
          invoiceNumber: dto.invoiceNumber || bill.invoiceNumber,
          discount: dto.discount || bill.discount,
          grossTotal: dto.grossTotal || bill.grossTotal,
          netTotal: dto.netTotal || bill.netTotal,
          date: dto.date || bill.date,
          invoiceType: dto.invoiceType || bill.invoiceType,
          directTax: dto.directTax || bill.directTax,
          indirectTax: dto.indirectTax || bill.indirectTax,
          isTaxIncluded: dto.isTaxIncluded || bill.isTaxIncluded,
          comment: dto.comment || bill.comment,
          organizationId: bill.organizationId,
          branchId: bill.branchId,
          createdById: bill.createdById,
          updatedById: req.user.id,
          status: dto.status || bill.status,
        }
      );

      await getCustomRepository(BillItemRepository).delete({
        billId: dto.id,
      });

      for (const item of dto.invoice_items) {
        await getCustomRepository(BillItemRepository).save({
          itemId: item.itemId,
          billId: dto.id,
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

        const itemDetail = items.find((i) => i.id === item.itemId);
        if (itemDetail.hasInventory) {
          itemLedgerArray.push({
            itemId: item.itemId,
            value: item.quantity,
            targetId: bill.id,
            type: 'increase',
            action: 'create',
          });
        }

        const debit = {
          amount: item.total,
          account_id: item.accountId,
        };

        debitsArrray.push(debit);
      }

      const updatedBill: IBill = await getCustomRepository(
        BillRepository
      ).findOne({
        where: {
          id: dto.id,
          organizationId: req.user.organizationId,
        },
      });

      if (updatedBill.status === Statuses.AUTHORISED) {
        await http.post(`reports/inventory/manage`, {
          payload: itemLedgerArray,
        });

        if (dto?.discount > 0) {
          const debitDiscount = {
            amount: dto.discount,
            account_id: await accounts.find((i) => i.code === '50003').id,
          };
          debitsArrray.push(debitDiscount);
        }

        const creditsArray = [
          {
            account_id: await accounts.find((i) => i.code === '40001').id,
            amount: dto.grossTotal,
          },
        ];

        const payload = {
          dr: debitsArrray,
          cr: creditsArray,
          type: 'bill',
          reference: dto.reference,
          amount: dto.grossTotal,
          status: updatedBill.status,
        };

        const { data: transaction } = await http.post(
          'accounts/transaction/api',
          {
            transactions: payload,
          }
        );

        const paymentArr = [
          {
            ...updatedBill,
            billId: bill.id,
            balance: `-${bill.netTotal}`,
            data: bill.issueDate,
            paymentType: PaymentModes.BILLS,
            transactionId: transaction.id,
            entryType: EntryType.CREDIT,
          },
        ];

        await http.post(`payments/payment/add`, {
          payments: paymentArr,
        });
        await http.get(`contacts/contact/balance`);
      }

      return bill;
    } else {
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

        const itemDetail = items.find((i) => i.id === item.itemId);
        if (itemDetail.hasInventory) {
          itemLedgerArray.push({
            itemId: item.itemId,
            value: item.quantity,
            targetId: bill.id,
            type: 'increase',
            action: 'create',
          });
        }

        const debit = {
          amount: item.total,
          account_id: item.accountId,
        };

        debitsArrray.push(debit);
      }

      if (bill.status === Statuses.AUTHORISED) {
        await http.post(`reports/inventory/manage`, {
          payload: itemLedgerArray,
        });

        const creditsArray = [
          {
            account_id: await accounts.find((i) => i.code === '40001').id,
            amount: dto.netTotal,
          },
          {
            amount: dto.discount,
            account_id: await accounts.find((i) => i.code === '55002').id,
          },
        ];

        const payload = {
          dr: debitsArrray,
          cr: creditsArray,
          type: 'bill',
          reference: dto.reference,
          amount: dto.grossTotal,
          status: bill.status,
        };

        const { data: transaction } = await http.post(
          'accounts/transaction/api',
          {
            transactions: payload,
          }
        );

        const paymentArr = [
          {
            ...bill,
            billId: bill.id,
            balance: `-${bill.netTotal}`,
            data: bill.issueDate,
            paymentType: PaymentModes.BILLS,
            transactionId: transaction.id,
            entryType: EntryType.CREDIT,
          },
        ];

        await http.post(`payments/payment/add`, {
          payments: paymentArr,
        });
        await http.get(`contacts/contact/balance`);
      }
      return bill;
    }
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

  async deleteBill(billIds: BillIdsDto, req: IRequest): Promise<boolean> {
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
    for (const i of billIds.ids) {
      const bill_items = await getCustomRepository(BillItemRepository).find({
        where: { billId: i },
      });

      const mapItemIds = bill_items.map((ids) => ids.itemId);
      const { data: items } = await http.post(`items/item/ids`, {
        ids: mapItemIds,
      });
      itemArray.push(items);
    }

    const newItemArray = itemArray.flat();
    for (const i of billIds.ids) {
      const bill = await getCustomRepository(BillRepository).findOne({
        where: {
          id: i,
        },
      });

      await getCustomRepository(BillRepository).update(
        { id: i },
        { status: 0 }
      );

      const bill_items = await getCustomRepository(BillItemRepository).find({
        where: { billId: i },
      });

      for (const j of bill_items) {
        await getCustomRepository(BillItemRepository).update(
          { billId: i },
          { status: 0 }
        );

        if (bill.status === Statuses.AUTHORISED) {
          const itemDetail = newItemArray.find((i) => i.id === j.itemId);
          if (itemDetail.hasInventory) {
            itemLedgerArray.push({
              itemId: j.itemId,
              value: j.quantity,
              targetId: i,
              type: 'increase',
              action: 'delete',
            });
          }
        }
      }
    }

    if (itemLedgerArray.length > 0) {
      await http.post('payments/payment/delete', {
        ids: billIds.ids,
        type: PaymentModes.BILLS,
      });

      await http.post(`reports/inventory/manage`, {
        payload: itemLedgerArray,
      });
    }

    return true;
  }

  async FindByBillIds(billds: BillIdsDto): Promise<IBill[]> {
    return await getCustomRepository(BillRepository).find({
      where: { id: In(billds.ids) },
    });
  }
}
