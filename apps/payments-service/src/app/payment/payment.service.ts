import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import { Between, getCustomRepository, In } from 'typeorm';
import { PaymentRepository } from '../repositories/payment.repository';
import { Sorting } from '@invyce/sorting';
import { PaymentModes, EntryType } from '@invyce/global-constants';
import {
  IPage,
  IBaseUser,
  IPaymentWithResponse,
  IRequest,
  IPayment,
} from '@invyce/interfaces';
import {
  PaymentDto,
  PaymentContactDto,
  PaymentInvoiceDto,
  PaymentIdsDto,
} from '../dto/payment.dto';

@Injectable()
export class PaymentService {
  /**
   * List All payments
   * @param data
   * @param req
   * @returns
   */

  async Index(
    queryData: IPage,
    user: IBaseUser
  ): Promise<IPaymentWithResponse> {
    const { page_size, page_no, query, sort, paymentType } = queryData;

    const ps: number = parseInt(page_size);
    const pn: number = parseInt(page_no);
    let payments;
    const { sort_column, sort_order } = await Sorting(sort);

    const total = await getCustomRepository(PaymentRepository).count({
      status: 1,
      organizationId: user.organizationId,
      paymentMode: paymentType,
      branchId: user.branchId,
    });

    if (query) {
      const filterData = Buffer.from(query, 'base64').toString();
      const data = JSON.parse(filterData);

      for (const i in data) {
        if (data[i].type === 'date-between') {
          const start_date = data[i].value[0];
          const end_date = data[i].value[1];
          payments = await getCustomRepository(PaymentRepository).find({
            where: {
              status: 1,
              branchId: user.branchId,
              organizationId: user.organizationId,
              [i]: Between(start_date, end_date),
            },
            skip: pn * ps - ps,
            take: ps,
          });
        }
      }
    } else {
      payments = await getCustomRepository(PaymentRepository).find({
        where: {
          organizationId: user.organizationId,
          branchId: user.branchId,
          status: 1,
          paymentMode: paymentType,
        },
        skip: pn * ps - ps,
        take: ps,
        order: {
          [sort_column]: sort_order,
        },
      });
    }

    return {
      result: payments,
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

  /**
   * create payment for invoices or bills
   * paymentMode 1 is for bills and 2 for invoices
   * @param data {date: string;
                  contactId: string;
                  paymentType: number;
                  paymentMode: number;
                  amount: number;
                  runningPayment: boolean;
                  reference: string;
                  accountId: number;
                  comment: string;
                  remainingAmount: number;
                  invoice_ids: Array<number>;}
   * @param req 
   * @returns 
   */
  async CreatePayment(data: PaymentDto, req: IRequest): Promise<IPayment> {
    try {
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

      const accountCodesArray = ['15001', '15004', '40003'];
      const { data: accounts } = await http.post(`accounts/account/codes`, {
        codes: accountCodesArray,
      });

      if (data?.paymentMode === PaymentModes.BILLS) {
        // for Bills
        const debits = [
          {
            amount: data.amount,
            account_id: accounts.find((i) => i.code === '40003').id,
          },
        ];
        const credits = [
          {
            amount: data.amount,
            account_id:
              data.paymentType === 1
                ? data.accountId
                : accounts.find((i) => i.code === '15001').id,
          },
        ];

        if (data?.invoice_ids?.length > 0) {
          const payload = {
            dr: debits,
            cr: credits,
            reference: data.reference,
            amount: data.amount,
            type: 'bill payment',
            status: 1,
          };

          const { data: transaction } = await http.post(
            'accounts/transaction/api',
            {
              transactions: payload,
            }
          );

          let remaining = data.amount;
          const bills = await getCustomRepository(PaymentRepository)
            .query(`select p."billId", sum(p.amount) as balance, count(id) as total_payments 
        from payments p
        where p."billId" in (${data.invoice_ids})
        and p.status = 1
        and p."entryType" is not null
        and p."organizationId" = '${req.user.organizationId}'
        group by p."billId"
        `);

          for (const i of bills) {
            const purchase_total = Math.abs(parseFloat(i.balance));
            if (purchase_total > remaining && remaining > 0) {
              await getCustomRepository(PaymentRepository).save({
                date: data.date,
                contactId: data.contactId,
                paymentType: data.paymentType,
                paymentMode: data.paymentMode,
                amount: remaining,
                transactionId: transaction.id,
                runningPayment: data.runningPayment,
                entryType: EntryType.COLLECTION,
                billId: i.billId,
                reference: data.reference,
                comment: data.comment,
                status: 1,
                branchId: req.user.branchId,
                organizationId: req.user.organizationId,
                createdById: req.user.id,
                updatedById: req.user.id,
              });

              remaining -= purchase_total;
            } else if (purchase_total < remaining && remaining > 0) {
              await getCustomRepository(PaymentRepository).save({
                date: data.date,
                contactId: data.contactId,
                paymentType: data.paymentType,
                paymentMode: data.paymentMode,
                amount: purchase_total,
                runningPayment: data.runningPayment,
                billId: i.billId,
                transactionId: transaction.id,
                reference: data.reference,
                entryType: EntryType.COLLECTION,
                comment: data.comment,
                status: 1,
                branchId: req.user.branchId,
                organizationId: req.user.organizationId,
                createdById: req.user.id,
                updatedById: req.user.id,
              });

              remaining -= purchase_total;
            } else if (purchase_total === remaining && remaining > 0) {
              await getCustomRepository(PaymentRepository).save({
                date: data.date,
                contactId: data.contactId,
                paymentType: data.paymentType,
                paymentMode: data.paymentMode,
                transactionId: transaction.id,
                amount: remaining,
                runningPayment: data.runningPayment,
                billId: i.billId,
                entryType: EntryType.COLLECTION,
                reference: data.reference,
                branchId: req.user.branchId,
                comment: data.comment,
                status: 1,
                organizationId: req.user.organizationId,
                createdById: req.user.id,
                updatedById: req.user.id,
              });

              remaining -= purchase_total;
            }
          }
        } else {
          await getCustomRepository(PaymentRepository).save({
            date: data.date,
            contactId: data.contactId,
            paymentType: data.paymentType,
            paymentMode: data.paymentMode,
            amount: data.amount,
            runningPayment: data.runningPayment,
            reference: data.reference,
            entryType: EntryType.COLLECTION,
            comment: data.comment,
            status: 1,
            branchId: req.user.branchId,
            organizationId: req.user.organizationId,
            createdById: req.user.id,
            updatedById: req.user.id,
          });
        }
      } else if (data?.paymentMode === PaymentModes.INVOICES) {
        // for Invoices
        const credits = [
          {
            amount: data.amount,
            account_id: accounts.find((i) => i.code === '15004').id,
          },
        ];
        const debits = [
          {
            amount: data.amount,
            account_id:
              data.paymentType === 1
                ? data.accountId
                : accounts.find((i) => i.code === '15001').id,
          },
        ];

        if (data?.invoice_ids?.length > 0) {
          const payload = {
            dr: debits,
            cr: credits,
            type: 'invoice payment',
            reference: data.reference,
            amount: data.amount,
            status: 1,
          };

          let remaining = data.amount;
          const invoices = await getCustomRepository(PaymentRepository).query(`
          select p."invoiceId", sum(p.amount) as balance, count(p.id) as total_payments
          from payments p
          where p."invoiceId" in (${data.invoice_ids})
          and p.status = 1
          and p."entryType" is not null
          and p."organizationId" = '${req.user.organizationId}'
          group by p."invoiceId"
      `);

          const { data: transaction } = await http.post(
            'accounts/transaction/api',
            {
              transactions: payload,
            }
          );

          for (const i of invoices) {
            const purchase_total = Math.abs(parseFloat(i.balance));
            if (purchase_total > remaining && remaining > 0) {
              await getCustomRepository(PaymentRepository).save({
                date: data.date,
                contactId: data.contactId,
                paymentType: data.paymentType,
                paymentMode: data.paymentMode,
                amount: parseInt(`-${remaining}`),
                runningPayment: data.runningPayment,
                invoiceId: i.invoiceId,
                reference: data.reference,
                transactionId: transaction.id,
                entryType: EntryType.COLLECTION,
                comment: data.comment,
                status: 1,
                branchId: req.user.branchId,
                organizationId: req.user.organizationId,
                createdById: req.user.id,
                updatedById: req.user.id,
              });

              remaining -= purchase_total;
            } else if (purchase_total < remaining && remaining > 0) {
              await getCustomRepository(PaymentRepository).save({
                date: data.date,
                contactId: data.contactId,
                paymentType: data.paymentType,
                paymentMode: data.paymentMode,
                amount: parseInt(`-${purchase_total}`),
                runningPayment: data.runningPayment,
                reference: data.reference,
                invoiceId: i.invoiceId,
                transactionId: transaction.id,
                entryType: EntryType.COLLECTION,
                comment: data.comment,
                status: 1,
                branchId: req.user.branchId,
                organizationId: req.user.organizationId,
                createdById: req.user.id,
                updatedById: req.user.id,
              });

              remaining -= purchase_total;
            } else if (purchase_total === remaining && remaining > 0) {
              await getCustomRepository(PaymentRepository).save({
                date: data.date,
                contactId: data.contactId,
                paymentType: data.paymentType,
                paymentMode: data.paymentMode,
                amount: parseInt(`-${remaining}`),
                runningPayment: data.runningPayment,
                transactionId: transaction.id,
                reference: data.reference,
                entryType: EntryType.COLLECTION,
                invoiceId: i.invoiceId,
                comment: data.comment,
                status: 1,
                branchId: req.user.branchId,
                organizationId: req.user.organizationId,
                createdById: req.user.id,
                updatedById: req.user.id,
              });

              remaining -= purchase_total;
            }
          }
        } else {
          await getCustomRepository(PaymentRepository).save({
            date: data.date,
            contactId: data.contactId,
            paymentType: data.paymentType,
            paymentMode: data.paymentMode,
            amount: parseInt(`-${data.amount}`),
            runningPayment: data.runningPayment,
            reference: data.reference,
            entryType: EntryType.COLLECTION,
            comment: data.comment,
            status: 1,
            branchId: req.user.branchId,
            organizationId: req.user.organizationId,
            createdById: req.user.id,
            updatedById: req.user.id,
          });
        }
      }
      await http.get(`contacts/contact/balance`);
    } catch (error) {
      throw new HttpException(error.status, HttpStatus.BAD_REQUEST);
    }
  }

  async GetPaymentAgainstInvoiceId(
    invoiceIds: PaymentInvoiceDto,
    user: IBaseUser
  ): Promise<IPayment[]> {
    const id = invoiceIds.type === 'INVOICE' ? '"invoiceId"' : '"billId"';

    const inv_arr = [];
    for (const i of invoiceIds.ids) {
      const [invoice] = await getCustomRepository(PaymentRepository).query(`
        select COALESCE(SUM(amount), 0) as balance from payments p
        where p.${id} = ${i}
        and p."entryType" = 2
        and p."organizationId" = '${user.organizationId}'
        and p."branchId" = '${user.branchId}'
        and p.status = 1
     `);
      inv_arr.push({ id: i, invoice });
    }

    return inv_arr;
  }

  async GetPaymentAgainstContactId(
    contactIds: PaymentContactDto,
    user: IBaseUser
  ): Promise<IPayment[]> {
    const payment_arr = [];
    for (const i of contactIds.ids) {
      const [payment] = await getCustomRepository(PaymentRepository).query(`
      SELECT COALESCE(SUM(amount), 0) as balance
      FROM payments p
      WHERE p."contactId" = '${i.id}'
      and p."entryType" is not null
      and p."organizationId" = '${user.organizationId}'
      and p."branchId" = '${user.branchId}'
      and p.status = 1
    `);

      payment_arr.push({ id: i.id, payment });
    }
    return payment_arr;
  }

  async DeletePaymentAgainstInvoiceOrBillId(data, req) {
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

    const id = data.type === PaymentModes.INVOICES ? 'invoiceId' : 'billId';

    const payments = await getCustomRepository(PaymentRepository).find({
      where: {
        [id]: In(data.ids),
      },
    });

    const mapTransactionIds = payments.map((p) => p.transactionId);
    for (const i of payments) {
      await getCustomRepository(PaymentRepository).update(
        {
          id: i.id,
        },
        {
          status: 0,
        }
      );
    }

    await http.get(`contacts/contact/balance`);
    await http.post(`accounts/transaction/delete`, {
      ids: mapTransactionIds,
    });
  }

  async AddPayment(data, user: IBaseUser): Promise<void> {
    for (const i of data.payments) {
      await getCustomRepository(PaymentRepository).save({
        amount: i?.balance,
        dueDate: i?.createdAt,
        date: i?.date,
        reference: i.reference || 'Xero opeing balance',
        transactionId: i?.transactionId,
        paymentType: i?.paymentType,
        contactId: i?.contactId,
        invoiceId: i?.invoiceId,
        billId: i?.billId,
        entryType: i?.entryType,

        importedPaymentId: i?.paymentId,
        importedFrom: i.importedFrom,
        organizationId: user.organizationId,
        branchId: user.branchId,
        createdById: user.id,
        updatedById: user.id,
        status: i.status || 1,
      });
    }
  }

  async DeletePayment(paymentIds: PaymentIdsDto, req): Promise<boolean> {
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

    const transactionArray = [];
    for (const i of paymentIds.ids) {
      const payment = await getCustomRepository(PaymentRepository).findOne({
        id: i,
        organizationId: req.user.organizationId,
      });

      if (payment?.id !== null) {
        transactionArray.push(payment);
      }

      await getCustomRepository(PaymentRepository).update(
        { id: i, organizationId: req.user.organizationId },
        { status: 0 }
      );
    }

    await http.get(`contacts/contact/balance`);
    const mapTransactionIds = transactionArray.map((ids) => ids.transactionId);
    if (mapTransactionIds.length > 0) {
      await http.post(`accounts/transaction/delete`, {
        ids: mapTransactionIds,
      });
    }

    return true;
  }
}
