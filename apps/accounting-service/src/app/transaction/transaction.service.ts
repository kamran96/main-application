import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Between, getCustomRepository, ILike, In } from 'typeorm';
import axios from 'axios';
import { Sorting } from '@invyce/sorting';

import {
  TransactionRepository,
  TransactionItemRepository,
  AccountRepository,
} from '../repositories';

enum Entries {
  DEBITS = 10,
  CREDITS = 20,
}

@Injectable()
export class TransactionService {
  async ListTransactions(user, queryData) {
    try {
      const { page_no, page_size, sort, query } = queryData;
      let transactions;

      const { sort_column, sort_order } = await Sorting(sort);
      const total = await getCustomRepository(TransactionRepository).count({
        status: 1,
        organizationId: user.organizationId,
        // branchId: user.branchId,
      });

      if (query) {
        const filterData: any = Buffer.from(query, 'base64').toString();
        const data = JSON.parse(filterData);

        for (let i in data) {
          if (data[i].type === 'search') {
            const val = data[i].value?.split('%')[1];
            // const lower = val.toLowerCase();
            transactions = await getCustomRepository(
              TransactionRepository
            ).find({
              where: {
                status: 1,
                organizationId: user.organizationId,
                [i]: ILike(val),
              },
              skip: page_no * page_size - page_size,
              take: page_size,
              relations: ['transactionItems', 'transactionItems.account'],
            });
          } else if (data[i].type === 'compare') {
            transactions = await getCustomRepository(
              TransactionRepository
            ).find({
              where: {
                status: 1,
                organizationId: user.organizationId,
                [i]: In(data[i].value),
              },
              skip: page_no * page_size - page_size,
              take: page_size,
              relations: ['transactionItems', 'transactionItems.account'],
            });
          } else if (data[i].type === 'date-between') {
            const start_date = data[i].value[0];
            const end_date = data[i].value[1];
            transactions = await getCustomRepository(
              TransactionRepository
            ).find({
              where: {
                status: 1,
                organizationId: user.organizationId,
                [i]: Between(start_date, end_date),
              },
              skip: page_no * page_size - page_size,
              take: page_size,
              relations: ['transactionItems', 'transactionItems.account'],
            });
          }

          return {
            transactions: transactions,
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
        transactions = await getCustomRepository(TransactionRepository).find({
          where: {
            status: 1,
            organizationId: user.organizationId,
            // branchId: user.branchId,
          },
          skip: page_no * page_size - page_size,
          take: page_size,
          order: {
            date: 'DESC',
          },
          relations: ['transactionItems', 'transactionItems.account'],
        });

        return {
          transactions: transactions,
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
      return transactions;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async CreateTransaction(transactionDto, userInfo): Promise<any> {
    const transaction = await getCustomRepository(TransactionRepository).save({
      date: transactionDto.date,
      ref: transactionDto.ref,
      narration: transactionDto.narration,
      notes: transactionDto.notes,
      amount: transactionDto.amount,
      // branchId: userInfo.branchId,
      organizationId: userInfo.organizationId,
      createdById: userInfo.userId,
      updatedById: userInfo.userId,
      status: 1,
    });

    const { debits, credits } = transactionDto.entries;

    let arr = [];

    for (let i of debits) {
      const transactionItems = await getCustomRepository(
        TransactionItemRepository
      ).save({
        transactionId: transaction.id,
        amount: i.amount,
        accountId: i.accountId,
        description: i.description,
        // branchId: userInfo.branchId,
        organizationId: userInfo.organizationId,
        createdById: userInfo.userId,
        updatedById: userInfo.userId,
        transactionType: Entries.DEBITS,
        status: 1,
      });

      arr.push(transactionItems);
    }

    for (let i of credits) {
      const transactionItems = await getCustomRepository(
        TransactionItemRepository
      ).save({
        transactionId: transaction.id,
        amount: i.amount,
        description: i.description,
        accountId: i.accountId,
        // branchId: userInfo.branchId,
        organizationId: userInfo.organizationId,
        createdById: userInfo.userId,
        updatedById: userInfo.userId,
        transactionType: Entries.CREDITS,
        status: 1,
      });

      arr.push(transactionItems);
    }

    return {
      ...transaction,
      transactionItems: arr,
    };
  }

  async FindTransactionById(transactionId) {
    return await getCustomRepository(TransactionRepository).find({
      where: { id: transactionId, status: 1 },
      relations: ['transactionItems'],
    });
  }

  async TransactionApi(data: ITransactionApi, user) {
    try {
      if (data || data !== null || data || undefined) {
        const debits = data['dr'];
        const credits = data['cr'];

        const debitIds = debits.map((i) => i.account_id);
        const creditIds = credits.map((i) => i.account_id);

        let initialValue = 0;
        let amount = debits.reduce(function (previousValue, currentValue) {
          return previousValue + currentValue.amount;
        }, initialValue);

        console.log(creditIds, debitIds);
        const intersection = debitIds.filter((element) =>
          creditIds.includes(element)
        );
        console.log(intersection);

        if (intersection.length > 0) {
          throw new HttpException(
            "There's no way to pass an entry on same accounts",
            HttpStatus.BAD_REQUEST
          );
        } else {
          const transaction = await getCustomRepository(
            TransactionRepository
          ).save({
            amount: data.amount ? data.amount : amount,
            ref: data.invoice ? data.invoice.reference : data.reference,
            date: data.createdAt || new Date(),
            createdAt: data.createdAt || new Date().toDateString(),
            ndataation: `System transaction against ${data?.invoice?.invoiceNumber}`,
            // branchId: user.branchId,
            organizationId: user.organizationId,
            createdById: user.id,
            updatedById: user.id,
            status: data?.invoice?.status === 2 ? 2 : 1 || 1,
          });

          getCustomRepository(TransactionItemRepository).save(
            debits.map((dr) => ({
              transactionId: transaction.id,
              amount: dr.amount,
              accountId: dr.accountId,
              transactionType: Entries.DEBITS,
              // branchId: user.branchId,
              organizationId: user.organizationId,
              createdById: user.id,
              updatedById: user.id,
              createdAt: transaction.createdAt,
              status: transaction.status,
            }))
          );

          getCustomRepository(TransactionItemRepository).save(
            credits.map((cr) => ({
              transactionId: transaction.id,
              amount: cr.amount,
              accountId: cr.accountId,
              transactionType: Entries.CREDITS,
              // branchId: user.branchId,
              organizationId: user.organizationId,
              createdById: user.id,
              updatedById: user.id,
              createdAt: transaction.createdAt,
              status: transaction.status,
            }))
          );

          return transaction;
        }
      }
      throw new HttpException('Parameter is invalid', HttpStatus.BAD_REQUEST);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async AddTransaction(data, req) {
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

    let paymentArr = [];
    for (let i of data.transactions) {
      async function getAccount(name) {
        const [account] = await getCustomRepository(AccountRepository).find({
          where: {
            name,
            organizationId: req.user.organizationId,
          },
        });
        return account.id;
      }

      const transaction = await getCustomRepository(TransactionRepository).save(
        {
          amount: i.balance,
          ref: 'XERO',
          narration: 'Xero contact balance',
          date: new Date(),
          organizationId: req.user.organizationId,
          branchId: req.user.branchId,
          createdById: req.user.userId,
          updatedById: req.user.userId,
          status: 1,
        }
      );

      await getCustomRepository(TransactionItemRepository).save({
        amount: i.balance,
        accountId:
          i.isCustomer === true
            ? await getAccount('Accounts Receivable')
            : await getAccount('Accounts Payable'),
        transactionId: transaction.id,
        transactionType: 10,
        branchId: req.user.branchId,
        organizationId: req.user.organizationId,
        createdById: req.user.userId,
        updatedById: req.user.userId,
        status: 1,
      });

      paymentArr.push({
        ...i,
        entryType: 1,
        transactionId: transaction.id,
      });
    }

    await http.post(`payments/payment/add`, {
      payments: paymentArr,
    });
  }
}

interface ITransactionApi {
  amount: number;
  cr: Array<any>;
  dr: Array<any>;
  invoice: any;
  reference: string;
  createdAt: string;
}
