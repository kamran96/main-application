import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import {
  Between,
  getCustomRepository,
  In,
  IsNull,
  LessThan,
  Not,
} from 'typeorm';
import * as moment from 'moment';
import { PaymentRepository } from '../repositories/payment.repository';
import { Sorting } from '@invyce/sorting';
import { PaymentModes, EntryType, Host } from '@invyce/global-constants';
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

import { ClientProxy } from '@nestjs/microservices';
import { SEND_FORGOT_PASSWORD } from '@invyce/send-email';

@Injectable()
export class PaymentService {
  constructor(
    @Inject('EMAIL_SERVICE') private readonly emailService: ClientProxy
  ) {}

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
    let total;

    const { sort_column, sort_order } = await Sorting(sort);

    total = await getCustomRepository(PaymentRepository).count({
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
          const add_one_day = moment(end_date, 'YYYY-MM-DD')
            .add(1, 'day')
            .format();

          payments = await getCustomRepository(PaymentRepository).find({
            where: {
              status: 1,
              branchId: user.branchId,
              organizationId: user.organizationId,
              [i]: Between(start_date, add_one_day),
            },
            skip: pn * ps - ps,
            take: ps,
          });

          total = await getCustomRepository(PaymentRepository).count({
            status: 1,
            organizationId: user.organizationId,
            paymentMode: paymentType,
            branchId: user.branchId,
            [i]: Between(start_date, add_one_day),
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
      if (!req || !req.cookies) return null;
      const token = req?.cookies['access_token'];

      const accountCodesArray = ['15001', '15004', '40001'];
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

      if (data?.paymentMode === PaymentModes.BILLS) {
        // for Bills
        const debits = [
          {
            amount: data.amount,
            account_id: accounts.find((i) => i.code === '40001').id,
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

          let remaining = data.amount;
          const bills = await getCustomRepository(PaymentRepository)
            .createQueryBuilder()
            .select(
              '"billId", COALESCE(SUM(amount), 0) as balance, COUNT(id) as total_payments'
            )
            .where({
              billId: In(data.invoice_ids),
              status: 1,
              entryType: Not(IsNull()),
              organizationId: req.user.organizationId,
            })
            .groupBy('"billId"')
            .getRawMany();

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

          const invoices = await getCustomRepository(PaymentRepository)
            .createQueryBuilder()
            .select(
              '"invoiceId", COALESCE(SUM(amount), 0) as balance, COUNT(id) as total_payments'
            )
            .where({
              invoiceId: In(data.invoice_ids),
              status: 1,
              entryType: Not(IsNull()),
              organizationId: req.user.organizationId,
            })
            .groupBy('"invoiceId"')
            .getRawMany();

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

          const { data: invoiceData } = await axios.post(
            Host('invoices', 'invoices/invoice/ids'),
            {
              ids: data.invoice_ids,
            },
            {
              headers: {
                cookie: `access_token=${token}`,
              },
            }
          );

          const links = invoiceData.map((i) => ({
            title: i.invoiceNumber,
            link: `http://localhost:4200/app/invoice/${i?.id}`,
          }));

          const emailPayload = {
            to: req.user.email,
            from: 'no-reply@invyce.com',
            TemplateAlias: 'payment-has-been-made-in-invoice',
            TemplateModel: {
              product_url: 'product_url_Value',
              user_name: req.user.profile.fullName,
              action_url: 'action_url_Value',
              product_name: 'product_name_Value',
              name: 'name_Value',
              operating_system: 'operating_system_Value',
              browser_name: 'browser_name_Value',
              support_url: 'support_url_Value',
              company_name: 'company_name_Value',
              company_address: 'company_address_Value',
              links,
            },
          };

          await this.emailService.emit(SEND_FORGOT_PASSWORD, emailPayload);
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

      // send payment send email

      await axios.get(Host('contacts', `contacts/contact/balance`), {
        headers: {
          cookie: `access_token=${token}`,
        },
      });
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
      const sql = `
        select
          p.id,
            (
              select coalesce(sum(t.amount),0) from payments t where t."entryType" = 1 
              and t.${id} = p.${id} and t.status = 1
            ) as credits,
            (
              select coalesce(abs(sum(t.amount)),0) from payments t where t."entryType" in (4, 5) 
              and t.${id} = p.${id} and t.status = 1
            ) as credit_notes,
            (
              select coalesce(abs(sum(t.amount)),0) from payments t where t."entryType" = 2 
              and t.${id} = p.${id} and t.status = 1
            ) as payment,
            (
              (
                select coalesce(sum(t.amount),0) from payments t where t."entryType" = 1 
                and t.${id} = p.${id} and t.status = 1
              ) - (
                select coalesce(abs(sum(t.amount)),0) from payments t where t."entryType" in (4, 5) 
                and t.${id} = p.${id} and t.status = 1
              ) - (
                select coalesce(abs(sum(t.amount)),0) from payments t where t."entryType" = 2 
                and t.${id} = p.${id} and t.status = 1
              )
            ) as balance,
            (
              (
                select coalesce(abs(sum(t.amount)),0) from payments t where t."entryType" = 1 
                and t.${id} = p.${id} and t.status = 1
              ) - (
                select coalesce(sum(t.amount),0) from payments t where t."entryType" in (4, 5) 
                and t.${id} = p.${id} and t.status = 1
              ) - (
                select coalesce(sum(t.amount),0) from payments t where t."entryType" = 2 
                and t.${id} = p.${id} and t.status = 1
              )
            ) as billbalance

          from payments p
          where p.${id} = $1
          and p."branchId" = $2
          and p.status = 1
      `;

      const [invoice] = await getCustomRepository(PaymentRepository).query(
        sql,
        [i, user.branchId]
      );

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
      const [payment] = await getCustomRepository(PaymentRepository)
        .createQueryBuilder('pay')
        .select('COALESCE(SUM(amount), 0)', 'balance')
        .where({
          contactId: i.id,
          entryType: Not(IsNull()),
          organizationId: user.organizationId,
          branchId: user.branchId,
          status: 1,
        })
        .getRawMany();

      payment_arr.push({ id: i.id, payment });
    }

    return payment_arr;
  }

  async GetPaymentAndBalance(
    contactId: string,
    user: IBaseUser,
    query: IPage
  ): Promise<unknown> {
    const { page_no, page_size, type, start, end } = query;

    const ps: number = parseInt(page_size);
    const pn: number = parseInt(page_no);

    const total = await getCustomRepository(PaymentRepository).count({
      status: 1,
      organizationId: user.organizationId,
    });
    const add_one_day = moment(new Date()).add(1, 'day').format();

    const filterByDate = type
      ? { [type]: Between(start, end) }
      : { createdAt: LessThan(add_one_day) };

    const payment = await getCustomRepository(PaymentRepository)
      .createQueryBuilder('p')
      .select('p.*, abs(p.amount) as amount')
      .addSelect('COALESCE(sum(amount) over (order by date asc), 0)', 'balance')
      .where({
        contactId,
        entryType: Not(IsNull()),
        organizationId: user.organizationId,
        branchId: user.branchId,
        status: 1,
      })
      .andWhere(filterByDate)
      .orderBy('balance', 'ASC')
      .offset(pn * ps - ps || 0)
      .limit(ps)
      .getRawMany();

    return {
      pagination: {
        total,
        total_pages: Math.ceil(total / ps),
        page_size: parseInt(page_size) || 20,
        page_no: parseInt(page_no),
        page_total: payment.length,
        // sort_column: sort_column,
        // sort_order: sort_order,
      },
      result: payment,
    };
  }

  async ContactOpeningBalance(
    contactId: string,
    user: IBaseUser,
    query: IPage
  ) {
    return await getCustomRepository(PaymentRepository)
      .createQueryBuilder('p')
      .select('date(date), comment, "createdAt"')
      .addSelect(
        ' COALESCE(sum(amount) over (order by date asc), 0)',
        'balance'
      )
      .where({
        organizationId: user.organizationId,
        branchId: user.branchId,
        contactId,
        status: In([1, 3]),
        entryType: Not(IsNull()),
        date: LessThan(query.start),
      })
      .orderBy('balance', 'ASC')
      .limit(1)
      .getRawMany();
  }

  async DeletePaymentAgainstInvoiceOrBillId(data, req) {
    if (!req || !req.cookies) return null;
    const token = req?.cookies['access_token'];

    const id = data.type === PaymentModes.INVOICES ? 'invoiceId' : 'billId';

    let payments;
    if (data?.entryType) {
      payments = await getCustomRepository(PaymentRepository).find({
        where: {
          [id]: In(data.ids),
          entryType: data.entryType,
        },
      });
    } else {
      payments = await getCustomRepository(PaymentRepository).find({
        where: {
          [id]: In(data.ids),
        },
      });
    }

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

    await axios.get(Host('contacts', `contacts/contact/balance`), {
      headers: {
        cookie: `access_token=${token}`,
      },
    });
    await axios.post(
      Host('accounts', `accounts/transaction/delete`),
      {
        ids: mapTransactionIds,
      },
      {
        headers: {
          cookie: `access_token=${token}`,
        },
      }
    );
  }

  // async AgedPayments(req: IRequest, data, query) {
  //   let token;
  //   if (process.env.NODE_ENV === 'development') {
  //     const header = req.headers?.authorization?.split(' ')[1];
  //     token = header;
  //   } else {
  //     if (!req || !req.cookies) return null;
  //     token = req.cookies['access_token'];
  //   }

  //   const tokenType =
  //     process.env.NODE_ENV === 'development' ? 'Authorization' : 'cookie';
  //   const value =
  //     process.env.NODE_ENV === 'development'
  //       ? `Bearer ${token}`
  //       : `access_token=${token}`;

  //   const http = axios.create({
  //     baseURL: 'http://localhost',
  //     headers: {
  //       [tokenType]: value,
  //     },
  //   });

  // }

  async AddPayment(data, user: IBaseUser): Promise<void> {
    console.log('okkkk');
    for (const i of data.payments) {
      await getCustomRepository(PaymentRepository).save({
        amount: i?.balance,
        dueDate: i?.dueDate,
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
    if (!req || !req.cookies) return null;
    const token = req.cookies['access_token'];

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

    await axios.get(Host('contacts', `contacts/contact/balance`), {
      headers: {
        cookie: `access_token=${token}`,
      },
    });
    const mapTransactionIds = transactionArray.map((ids) => ids.transactionId);
    if (mapTransactionIds.length > 0) {
      await axios.post(
        Host('accounts', `accounts/transaction/delete`),
        {
          ids: mapTransactionIds,
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
}
