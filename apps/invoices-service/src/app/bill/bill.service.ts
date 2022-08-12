import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  Between,
  getCustomRepository,
  ILike,
  In,
  LessThan,
  Raw,
} from 'typeorm';
import axios from 'axios';
import { BillRepository } from '../repositories/bill.repository';
import { BillItemRepository } from '../repositories/billItem.repository';
import { Sorting } from '@invyce/sorting';
import { IPage, IBillWithResponse, IRequest, IBill } from '@invyce/interfaces';
import { BillDto, BillIdsDto } from '../dto/bill.dto';
import {
  EntryType,
  Host,
  PaymentModes,
  Statuses,
} from '@invyce/global-constants';

import { ClientProxy } from '@nestjs/microservices';
import { BILL_UPDATED } from '@invyce/send-email';
import { CreditNoteRepository } from '../repositories/creditNote.repository';
import { PurchaseOrderRepository } from '../repositories/purchaseOrder.repository';

@Injectable()
export class BillService {
  constructor(
    @Inject('EMAIL_SERVICE') private readonly emailService: ClientProxy
  ) {}

  async IndexBill(req: IRequest, queryData: IPage): Promise<IBillWithResponse> {
    const { page_no, page_size, status, type, query } = queryData;
    let sort = queryData.sort;
    sort = sort ? sort : '-id';

    if (!req || !req.cookies) return null;
    const token = req?.cookies['access_token'];

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
          const val = data[i].value?.split('%')[1].toLowerCase();

          bills = await getCustomRepository(BillRepository).find({
            where: {
              status: 1,
              branchId: req.user.branchId,
              organizationId: req.user.organizationId,
              [i]: Raw((alias) => `LOWER(${alias}) ILike '%${val}%'`),
            },
            skip: pn * ps - ps,
            take: ps,
            relations: ['purchaseItems'],
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
            relations: ['purchaseItems'],
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
    } else {
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

        const { data: balances } = await axios.post(
          Host('payments', `payments/payment/invoice`),
          {
            ids: mapBillIds,
            type: 'BILL',
          },
          {
            headers: {
              cookie: `access_token=${token}`,
            },
          }
        );

        for (const i of bills) {
          const balance = balances.find((bal) => bal.id === i.id);

          const due_amount = balance?.invoice?.billbalance;
          const paid_amount = balance?.invoice?.payment;

          const payment_status = () => {
            if (paid_amount < due_amount && due_amount < i?.netTotal) {
              return 'Partial Payment';
            } else if (due_amount === i?.netTotal) {
              return 'Payment Pending';
            } else if (paid_amount === i?.netTotal) {
              return 'Full Payment';
            } else if (paid_amount === 0 && due_amount === 0) {
              return 'Cleared';
            } else {
              return null;
            }
          };

          bill_arr.push({
            ...i,
            paid_amount: paid_amount || 0,
            due_amount: due_amount || 0,
            payment_status: payment_status(),
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

        const { data: balances } = await axios.post(
          Host('payments', `payments/payment/invoice`),
          {
            ids: mapBillIds,
            type: 'BILL',
          },
          {
            headers: {
              cookie: `access_token=${token}`,
            },
          }
        );

        for (const i of bills) {
          const balance = balances.find((bal) => bal.id === i.id);

          const due_amount = balance?.invoice?.billbalance;
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

          if (balance?.invoice?.balance !== 0) {
            bill_arr.push({
              ...i,
              paid_amount: paid_amount || 0,
              due_amount: due_amount || 0,
              payment_status: payment_status(),
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

        const { data: balances } = await axios.post(
          Host('payments', `payments/payment/invoice`),
          {
            ids: mapBillIds,
            type: 'BILL',
          },
          {
            headers: {
              cookie: `access_token=${token}`,
            },
          }
        );

        for (const i of bills) {
          const balance = balances.find((bal) => bal.id === i.id);

          const due_amount = balance?.invoice?.billbalance;
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

          if (paid_amount) {
            bill_arr.push({
              ...i,
              paid_amount: paid_amount || 0,
              due_amount: due_amount || 0,
              payment_status: payment_status(),
            });
          }
        }
      } else if (type === 'DUE_PAYMENTS') {
        bills = await getCustomRepository(BillRepository).find({
          where: {
            status: status,
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

    const new_bills = [];
    const mapContactIds = bill_arr.map((inv) => inv.contactId);

    const newContactIds = mapContactIds
      .sort()
      .filter(function (item, pos, ary) {
        return !pos || item != ary[pos - 1];
      });

    const { data: contacts } = await axios.post(
      Host('contacts', `contacts/contact/ids`),
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
      ...new Map(bill_arr.map((item) => [item[key], item])).values(),
    ].map((i) => i[key]);

    const { data: users } = await axios.post(
      Host('users', `users/user/ids`),
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

    for (const i of bill_arr) {
      const contact = contacts.find((c) => c.id === i.contactId);
      const user = users.find((u) => u.id === i.createdById);
      new_bills.push({
        ...i,
        contact,
        owner: user,
      });
    }

    return {
      result: new_bills,
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
    if (!req || !req.cookies) return null;
    const token = req?.cookies['access_token'];

    const accountCodesArray = ['40001', '55002'];
    const { data: accounts } = await axios.post(
      Host('accounts', `accounts/account/codes`),
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

    const itemLedgerArray = [];
    const debitsArrray = [];
    const billItems = [];

    if (dto?.isNewRecord === false) {
      const bill: IBill = await getCustomRepository(BillRepository).findOne({
        where: {
          id: dto.id,
          organizationId: req.user.organizationId,
        },
      });

      if (bill) {
        await getCustomRepository(BillRepository).update(
          { id: dto.id },
          {
            contactId: dto.contactId || bill.contactId,
            reference: dto.reference || bill.reference,
            issueDate: dto.issueDate || bill.issueDate,
            dueDate: dto.dueDate || bill.dueDate,
            invoiceNumber: dto.invoiceNumber || bill.invoiceNumber,
            adjustment: dto.adjustment || bill.adjustment,
            grossTotal: dto.grossTotal || bill.grossTotal,
            netTotal: dto.netTotal || bill.netTotal,
            date: dto.issueDate || bill.issueDate,
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
          const bItem = await getCustomRepository(BillItemRepository).save({
            itemId: item.itemId,
            billId: dto.id,
            accountId: item.accountId,
            description: item.description,
            quantity: item.quantity,
            purchasePrice: item.purchasePrice,
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
              targetId: bill.id,
              type: 'increase',
              action: 'create',
              invoiceType: 'bill',
              price:
                typeof item?.purchasePrice === 'string'
                  ? parseFloat(item.purchasePrice)
                  : item.purchasePrice,
            });
          }

          const debit = {
            amount: Number(item.quantity) * Number(item.purchasePrice),
            account_id: item.accountId,
          };

          debitsArrray.push(debit);
          billItems.push(bItem);
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

          const creditsArray = [
            {
              account_id: await accounts.find((i) => i.code === '40001').id,
              amount: dto.netTotal,
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
              ...updatedBill,
              billId: bill.id,
              balance: `-${bill.netTotal}`,
              data: bill.issueDate,
              dueDate: bill.dueDate,
              paymentType: PaymentModes.BILLS,
              transactionId: transaction.id,
              entryType: EntryType.CREDIT,
            },
          ];

          const billLink = `${process.env.FRONTEND_HOST}/bills/view/${updatedBill.id}`;

          await this.emailService.emit(BILL_UPDATED, {
            to: req.user.email,
            user_name: req.user.profile.fullName,
            invoice_number: bill.invoiceNumber,
            invoice_name: bill.reference,
            link: billLink,
          });

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
          await axios.get(Host('contacts', `contacts/contact/balance`), {
            headers: {
              cookie: `access_token=${token}`,
            },
          });
        }

        return bill;
      }
      throw new HttpException('Bill not found', HttpStatus.BAD_REQUEST);
    } else {
      if (dto.id) {
        await getCustomRepository(PurchaseOrderRepository).update(
          {
            id: dto.id,
          },
          {
            status: 1,
          }
        );
      }
      const bill = await getCustomRepository(BillRepository).save({
        contactId: dto.contactId,
        reference: dto.reference,
        issueDate: dto.issueDate,
        dueDate: dto.dueDate,
        invoiceNumber: dto.invoiceNumber,
        adjustment: dto.adjustment,
        grossTotal: dto.grossTotal,
        netTotal: dto.netTotal,
        date: dto.issueDate,
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
        const bItem = await getCustomRepository(BillItemRepository).save({
          itemId: item.itemId,
          billId: bill.id,
          accountId: item.accountId,
          description: item.description,
          quantity: item.quantity,
          purchasePrice: item.purchasePrice,
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
            targetId: bill.id,
            type: 'increase',
            action: 'create',
            invoiceType: 'bill',
            price:
              typeof item?.purchasePrice === 'string'
                ? parseFloat(item.purchasePrice)
                : item.purchasePrice,
          });
        }

        const debit = {
          amount: Number(item.quantity) * Number(item.purchasePrice),
          account_id: item.accountId,
        };

        debitsArrray.push(debit);
        billItems.push(bItem);
      }

      if (bill.status === Statuses.AUTHORISED) {
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

        const creditsArray = [
          {
            account_id: await accounts.find((i) => i.code === '40001').id,
            amount: dto.netTotal,
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
            ...bill,
            billId: bill.id,
            balance: `-${bill.netTotal}`,
            data: bill.issueDate,
            dueDate: bill.dueDate,
            paymentType: PaymentModes.BILLS,
            transactionId: transaction.id,
            entryType: EntryType.CREDIT,
          },
        ];

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
        await axios.get(Host('contacts', `contacts/contact/balance`), {
          headers: {
            cookie: `access_token=${token}`,
          },
        });
      }

      console.log(mapItemIds, 'items');
      await axios.post(
        Host('items', 'items/price/bill'),
        {
          itemIds: mapItemIds,
        },
        {
          headers: {
            cookie: `access_token=${token}`,
          },
        }
      );

      return bill;
    }
  }

  async FindById(billId: number, req: IRequest): Promise<IBill> {
    const [bill] = await getCustomRepository(BillRepository).find({
      where: { id: billId },
      relations: ['purchaseItems'],
    });

    const creditNote = await getCustomRepository(CreditNoteRepository)
      .createQueryBuilder()
      .where('"billId" = :id', { id: billId })
      .andWhere({
        status: 1,
      })
      .select('id, "invoiceNumber", "netTotal" as balance')
      .getRawMany();

    let new_bill;
    if (bill?.contactId) {
      const contactId = bill?.contactId;
      const itemIdsArray = bill?.purchaseItems.map((ids) => ids.itemId);

      if (!req || !req.cookies) return null;
      const token = req?.cookies['access_token'];
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
          ids: [billId],
          type: 'BILL',
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

      const balance = payments.find((bal) => parseInt(bal.id) === bill.id);

      const paid_amount = balance?.invoice?.payment || 0;
      const due_amount = balance?.invoice?.billbalance || 0;

      const payment_status = () => {
        if (paid_amount < due_amount && due_amount < bill?.netTotal) {
          return 'Partial Payment';
        } else if (due_amount === bill?.netTotal) {
          return 'Payment Pending';
        } else if (paid_amount === bill?.netTotal) {
          return 'Full Payment';
        } else {
          return null;
        }
      };

      const newBill = {
        ...bill,
        paid_amount,
        due_amount,
        payment_status: payment_status(),
      };

      const billItemArr = [];
      for (const i of bill.purchaseItems) {
        const item = items.find((j) => i.itemId === j.id);

        billItemArr.push({
          ...i,
          item,
        });
      }

      if (billItemArr.length > 0) {
        new_bill = {
          ...newBill,
          relation: {
            links: creditNote,
            type: 'CN',
          },
          contact: contact.result,
          purchaseItems: billItemArr,
        };
      }
    }
    return new_bill ? new_bill : bill;
  }

  async deleteBill(billIds: BillIdsDto, req: IRequest): Promise<boolean> {
    if (!req || !req.cookies) return null;
    const token = req.cookies['access_token'];

    const itemLedgerArray = [];
    const itemArray = [];
    for (const i of billIds.ids) {
      const bill_items = await getCustomRepository(BillItemRepository).find({
        where: { billId: i },
      });

      const mapItemIds = bill_items.map((ids) => ids.itemId);
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
          if (itemDetail?.hasInventory === true) {
            itemLedgerArray.push({
              itemId: j.itemId,
              value: j.quantity,
              targetId: i,
              type: 'increase',
              action: 'delete',
              invoiceType: 'bill',
              price:
                typeof j?.purchasePrice === 'string'
                  ? parseFloat(j?.purchasePrice)
                  : j?.purchasePrice,
            });
          }
        }
      }
    }

    if (itemLedgerArray.length > 0) {
      await axios.post(
        Host('payments', 'payments/payment/delete'),
        {
          ids: billIds.ids,
          type: PaymentModes.BILLS,
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
   * Aged payable report
   */

  async AgedPayables(req: IRequest, query) {
    if (!req || !req.cookies) return null;
    const token = req.cookies['access_token'];

    const bills = await getCustomRepository(BillRepository).find({
      status: 1,
      organizationId: req.user.organizationId,
      branchId: req.user.branchId,
      invoiceType: 'POE',
    });

    const mapBillIds = bills.map((b) => b.id);

    const { data: balances } = await axios.post(
      Host('payments', `payments/payment/invoice`),
      {
        ids: mapBillIds,
        type: 'BILL',
      },
      {
        headers: {
          cookie: `access_token=${token}`,
        },
      }
    );

    const bill_arr = [];
    for (const i of bills) {
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
        bill_arr.push({
          ...i,
          paid_amount,
          due_amount: i.netTotal - balance.invoice.balance || 0,
          payment_status: payment_status(),
        });
      }
    }

    return bill_arr.flat();
  }

  async FindByBillIds(billds: BillIdsDto): Promise<IBill[]> {
    return await getCustomRepository(BillRepository).find({
      where: { id: In(billds.ids) },
    });
  }

  async FindBillsByContactId(contactId: string): Promise<IBill[]> {
    return await getCustomRepository(BillRepository).find({
      where: { contactId },
      relations: ['purchaseItems'],
    });
  }
}
