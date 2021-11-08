import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import { Between, getCustomRepository } from 'typeorm';
import { PaymentRepository } from '../repositories/payment.repository';
import { Sorting } from '@invyce/sorting';
import { PaymentModes } from '@invyce/global-constants';
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
      // branchId: user.branchId,
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
          // organizationId: user.organizationId,
          // branchId: user.branchId,
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

      let debits = [];
      let credits = [];
      if (data?.paymentMode === PaymentModes.BILLS) {
        // for Bills
        debits = [
          {
            amount: data.amount,
            account_id: accounts.find((i) => i.code === '40003').id,
          },
        ];
        credits = [
          {
            amount: data.amount,
            account_id:
              data.paymentType === 1
                ? data.accountId
                : accounts.find((i) => i.code === '15001').id,
          },
        ];

        const payload = {
          dr: debits,
          cr: credits,
          reference: data.reference,
          amount: data.amount,
        };

        const { data: transaction } = await http.post(
          'accounts/transaction/api',
          payload
        );

        if (data?.invoice_ids?.length > 0) {
          const bills = await getCustomRepository(PaymentRepository)
            .query(`select p."billId", sum(p.amount) as balance, count(id) as total_payments 
        from payments p
        where p."billId" in (${data.invoice_ids})
        and p.status = 1
        and p."organizationId" = '${req.user.organizationId}'
        group by p."billId"
        `);

          const remainig = data.amount;
          if (bills.length > 0) {
            for (const i of bills) {
              const purchase_total = Math.abs(parseFloat(i.balance));
              if (purchase_total > remainig && remainig > 0) {
                await getCustomRepository(PaymentRepository).save({
                  date: data.date,
                  contactId: data.contactId,
                  paymentType: data.paymentType,
                  paymentMode: data.paymentMode,
                  amount: parseInt(`-${remainig}`),
                  runningPayment: data.runningPayment,
                  billId: i.id,
                  reference: data.reference,
                  comment: data.comment,
                  status: 1,
                  organizationId: req.user.organizationId,
                  createdById: req.user.id,
                  updatedById: req.user.id,
                });
              } else if (purchase_total < remainig && remainig > 0) {
                await getCustomRepository(PaymentRepository).save({
                  date: data.date,
                  contactId: data.contactId,
                  paymentType: data.paymentType,
                  paymentMode: data.paymentMode,
                  amount: parseInt(`-${purchase_total}`),
                  runningPayment: data.runningPayment,
                  reference: data.reference,
                  billId: i.id,
                  comment: data.comment,
                  status: 1,
                  organizationId: req.user.organizationId,
                  createdById: req.user.id,
                  updatedById: req.user.id,
                });
              } else if (purchase_total === remainig && remainig > 0) {
                await getCustomRepository(PaymentRepository).save({
                  date: data.date,
                  contactId: data.contactId,
                  paymentType: data.paymentType,
                  paymentMode: data.paymentMode,
                  amount: parseInt(`-${remainig}`),
                  runningPayment: data.runningPayment,
                  reference: data.reference,
                  comment: data.comment,
                  billId: i.id,
                  status: 1,
                  organizationId: req.user.organizationId,
                  createdById: req.user.id,
                  updatedById: req.user.id,
                });
              }
            }
          } else {
            if (data.invoice_ids.length === 1) {
              await getCustomRepository(PaymentRepository).save({
                date: data.date,
                contactId: data.contactId,
                paymentType: data.paymentType,
                paymentMode: data.paymentMode,
                billId: data.invoice_ids[0],
                amount: parseInt(`-${data.amount}`),
                runningPayment: data.runningPayment,
                reference: data.reference,
                comment: data.comment,
                status: 1,
                organizationId: req.user.organizationId,
                createdById: req.user.id,
                updatedById: req.user.id,
              });
            } else {
              const http = axios.create({
                baseURL: 'http://localhost',
                headers: {
                  [type]: value,
                },
              });

              const { data: inv } = await http.post(`invoices/bill/ids`, {
                ids: data.invoice_ids,
              });

              for (const i of inv) {
                const purchase_total = Math.abs(parseFloat(i.netTotal));
                if (purchase_total > remainig && remainig > 0) {
                  await getCustomRepository(PaymentRepository).save({
                    date: data.date,
                    contactId: data.contactId,
                    paymentType: data.paymentType,
                    paymentMode: data.paymentMode,
                    amount: parseInt(`-${remainig}`),
                    runningPayment: data.runningPayment,
                    billId: i.id,
                    reference: data.reference,
                    comment: data.comment,
                    status: 1,
                    organizationId: req.user.organizationId,
                    createdById: req.user.id,
                    updatedById: req.user.id,
                  });
                } else if (purchase_total < remainig && remainig > 0) {
                  await getCustomRepository(PaymentRepository).save({
                    date: data.date,
                    contactId: data.contactId,
                    paymentType: data.paymentType,
                    paymentMode: data.paymentMode,
                    amount: parseInt(`-${purchase_total}`),
                    runningPayment: data.runningPayment,
                    billId: i.id,
                    reference: data.reference,
                    comment: data.comment,
                    status: 1,
                    organizationId: req.user.organizationId,
                    createdById: req.user.id,
                    updatedById: req.user.id,
                  });
                } else if (purchase_total === remainig && remainig > 0) {
                  await getCustomRepository(PaymentRepository).save({
                    date: data.date,
                    contactId: data.contactId,
                    paymentType: data.paymentType,
                    paymentMode: data.paymentMode,
                    amount: parseInt(`-${remainig}`),
                    runningPayment: data.runningPayment,
                    billId: i.id,
                    reference: data.reference,
                    comment: data.comment,
                    status: 1,
                    organizationId: req.user.organizationId,
                    createdById: req.user.id,
                    updatedById: req.user.id,
                  });
                }
              }
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
            comment: data.comment,
            status: 1,
            organizationId: req.user.organizationId,
            createdById: req.user.id,
            updatedById: req.user.id,
          });
        }
      } else if (data?.paymentMode === PaymentModes.INVOICES) {
        // for Invoices
        credits = [
          {
            amount: data.amount,
            account_id: accounts.find((i) => i.code === '15004').id,
          },
        ];
        debits = [
          {
            amount: data.amount,
            account_id:
              data.paymentType === 1
                ? data.accountId
                : accounts.find((i) => i.code === '15001').id,
          },
        ];

        const payload = {
          dr: debits,
          cr: credits,
          reference: data.reference,
          amount: data.amount,
        };

        if (data?.invoice_ids?.length > 0) {
          const invoices = await getCustomRepository(PaymentRepository).query(`
          select p."invoiceId", sum(p.amount) as balance, count(p.id) as total_payments
          from payments p
          where p."invoiceId" in (${data.invoice_ids})
          and p.status = 1
          and p."organizationId" = '${req.user.organizationId}'
          group by p."invoiceId"
      `);

          const remainig = data.amount;
          if (invoices.length > 0) {
            for (const i of invoices) {
              const purchase_total = Math.abs(parseFloat(i.balance));
              if (purchase_total > remainig && remainig > 0) {
                await getCustomRepository(PaymentRepository).save({
                  date: data.date,
                  contactId: data.contactId,
                  paymentType: data.paymentType,
                  paymentMode: data.paymentMode,
                  amount: parseInt(`-${remainig}`),
                  runningPayment: data.runningPayment,
                  reference: data.reference,
                  invoiceId: i.id,
                  comment: data.comment,
                  status: 1,
                  organizationId: req.user.organizationId,
                  createdById: req.user.id,
                  updatedById: req.user.id,
                });
              } else if (purchase_total < remainig && remainig > 0) {
                await getCustomRepository(PaymentRepository).save({
                  date: data.date,
                  contactId: data.contactId,
                  paymentType: data.paymentType,
                  paymentMode: data.paymentMode,
                  amount: parseInt(`-${purchase_total}`),
                  runningPayment: data.runningPayment,
                  reference: data.reference,
                  invoiceId: i.id,
                  comment: data.comment,
                  status: 1,
                  organizationId: req.user.organizationId,
                  createdById: req.user.id,
                  updatedById: req.user.id,
                });
              } else if (purchase_total === remainig && remainig > 0) {
                await getCustomRepository(PaymentRepository).save({
                  date: data.date,
                  contactId: data.contactId,
                  paymentType: data.paymentType,
                  paymentMode: data.paymentMode,
                  amount: parseInt(`-${remainig}`),
                  runningPayment: data.runningPayment,
                  invoiceId: i.id,
                  reference: data.reference,
                  comment: data.comment,
                  status: 1,
                  organizationId: req.user.organizationId,
                  createdById: req.user.id,
                  updatedById: req.user.id,
                });
              }
            }
          } else {
            if (data.invoice_ids.length === 1) {
              await getCustomRepository(PaymentRepository).save({
                date: data.date,
                contactId: data.contactId,
                paymentType: data.paymentType,
                paymentMode: data.paymentMode,
                invoiceId: data.invoice_ids[0],
                amount: parseInt(`-${data.amount}`),
                runningPayment: data.runningPayment,
                reference: data.reference,
                comment: data.comment,
                status: 1,
                organizationId: req.user.organizationId,
                createdById: req.user.id,
                updatedById: req.user.id,
              });
            } else {
              const http = axios.create({
                baseURL: 'http://localhost',
                headers: {
                  [type]: value,
                },
              });

              const { data: inv } = await http.post(`invoices/invoice/ids`, {
                ids: data.invoice_ids,
              });

              for (const i of inv) {
                const purchase_total = Math.abs(parseFloat(i.netTotal));
                if (purchase_total > remainig && remainig > 0) {
                  await getCustomRepository(PaymentRepository).save({
                    date: data.date,
                    contactId: data.contactId,
                    paymentType: data.paymentType,
                    paymentMode: data.paymentMode,
                    amount: parseInt(`-${remainig}`),
                    runningPayment: data.runningPayment,
                    invoiceId: i.id,
                    reference: data.reference,
                    comment: data.comment,
                    status: 1,
                    organizationId: req.user.organizationId,
                    createdById: req.user.id,
                    updatedById: req.user.id,
                  });
                } else if (purchase_total < remainig && remainig > 0) {
                  await getCustomRepository(PaymentRepository).save({
                    date: data.date,
                    contactId: data.contactId,
                    paymentType: data.paymentType,
                    paymentMode: data.paymentMode,
                    amount: parseInt(`-${purchase_total}`),
                    runningPayment: data.runningPayment,
                    reference: data.reference,
                    invoiceId: i.id,
                    comment: data.comment,
                    status: 1,
                    organizationId: req.user.organizationId,
                    createdById: req.user.id,
                    updatedById: req.user.id,
                  });
                } else if (purchase_total === remainig && remainig > 0) {
                  await getCustomRepository(PaymentRepository).save({
                    date: data.date,
                    contactId: data.contactId,
                    paymentType: data.paymentType,
                    paymentMode: data.paymentMode,
                    amount: parseInt(`-${remainig}`),
                    runningPayment: data.runningPayment,
                    reference: data.reference,
                    invoiceId: i.id,
                    comment: data.comment,
                    status: 1,
                    organizationId: req.user.organizationId,
                    createdById: req.user.id,
                    updatedById: req.user.id,
                  });
                }
              }
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
            comment: data.comment,
            status: 1,
            organizationId: req.user.organizationId,
            createdById: req.user.id,
            updatedById: req.user.id,
          });
        }
      }
    } catch (error) {
      throw new HttpException(error.status, HttpStatus.BAD_REQUEST);
    }
  }

  async GetPaymentAgainstInvoiceId(
    invoiceIds: PaymentInvoiceDto
  ): Promise<IPayment[]> {
    const id = invoiceIds.type === 'INVOICE' ? '"invoiceId"' : '"billId"';

    const inv_arr = [];
    for (const i of invoiceIds.ids) {
      const [invoice] = await getCustomRepository(PaymentRepository).query(`
        select COALESCE(SUM(amount), 0) as balance from payments p
        where p.${id} = ${i}
        and p.status = 1
     `);
      inv_arr.push({ id: i, invoice });
    }

    return inv_arr;
  }

  async GetPaymentAgainstContactId(
    contactIds: PaymentContactDto
  ): Promise<IPayment[]> {
    const payment_arr = [];
    for (const i of contactIds.ids) {
      const type = i.type === 1 ? `p.amount` : `ABS(p.amount)`;
      const [payment] = await getCustomRepository(PaymentRepository).query(`
      SELECT COALESCE(SUM(${type}), 0) as balance
      FROM payments p
      WHERE p."contactId" = '${i.id}'
      and p."entryType" is not null
      and status = 1
    `);

      payment_arr.push({ id: i.id, payment });
    }
    return payment_arr;
  }

  async AddPayment(data, user: IBaseUser): Promise<void> {
    for (const i of data.payments) {
      await getCustomRepository(PaymentRepository).save({
        amount: i?.balance,
        dueDate: i?.createdAt,
        date: i?.date,
        reference: i.reference || 'Xero opeing balance',
        transactionId: i?.transactionId,
        contactId: i?.contactId,
        invoiceId: i?.invoiceId,
        entryType: i?.entryType,

        importedPaymentId: i?.paymentId,
        importedFrom: i.importedFrom,
        organizationId: user.organizationId,
        createdById: user.id,
        updatedById: user.id,
        status: i.status || 1,
      });
    }
  }
}
