import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Between, getCustomRepository, ILike, In } from 'typeorm';
import axios from 'axios';
import { Sorting } from '@invyce/sorting';

import {
  TransactionRepository,
  TransactionItemRepository,
  AccountRepository,
} from '../repositories';
import {
  IBaseUser,
  IPage,
  ITransactionItem,
  ITransaction,
  ITransactionWithResponse,
  IRequest,
} from '@invyce/interfaces';
import { TransactionDto } from '../dto/transaction.dto';
import { Entries } from '@invyce/global-constants';

@Injectable()
export class TransactionService {
  async ListTransactions(
    user: IBaseUser,
    queryData: IPage
  ): Promise<ITransactionWithResponse> {
    try {
      const { page_no, page_size, sort, query } = queryData;
      const ps: number = parseInt(page_size);
      const pn: number = parseInt(page_no);

      let transactions;
      const { sort_column, sort_order } = await Sorting(sort);
      const total = await getCustomRepository(TransactionRepository).count({
        status: 1,
        organizationId: user.organizationId,
        branchId: user.branchId,
      });

      if (query) {
        const filterData = Buffer.from(query, 'base64').toString();
        const data = JSON.parse(filterData);

        for (const i in data) {
          if (data[i].type === 'search') {
            const val = data[i].value?.split('%')[1];
            transactions = await getCustomRepository(
              TransactionRepository
            ).find({
              where: {
                status: 1,
                organizationId: user.organizationId,
                [i]: ILike(val),
              },
              skip: pn * ps - ps,
              take: ps,
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
              skip: pn * ps - ps,
              take: ps,
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
              skip: pn * ps - ps,
              take: ps,
              relations: ['transactionItems', 'transactionItems.account'],
            });
          }

          return {
            result: transactions,
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
        transactions = await getCustomRepository(TransactionRepository).find({
          where: {
            status: 1,
            organizationId: user.organizationId,
            // branchId: user.branchId,
          },
          skip: pn * ps - ps,
          take: ps,
          order: {
            date: 'DESC',
          },
          relations: ['transactionItems', 'transactionItems.account'],
        });

        return {
          result: transactions,
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
      return transactions;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async CreateTransaction(
    transactionDto: TransactionDto,
    userInfo
  ): Promise<ITransaction> {
    const transaction = await getCustomRepository(TransactionRepository).save({
      date: transactionDto.date,
      ref: transactionDto.ref,
      narration: transactionDto.narration,
      notes: transactionDto.notes,
      amount: transactionDto.amount,
      branchId: userInfo.branchId,
      organizationId: userInfo.organizationId,
      createdById: userInfo.userId,
      updatedById: userInfo.userId,
      status: 1,
    });

    const { debits, credits } = transactionDto.entries;

    const arr: ITransactionItem[] = [];

    for (const i of debits) {
      const transactionItems = await getCustomRepository(
        TransactionItemRepository
      ).save({
        transactionId: transaction.id,
        amount: i.amount,
        accountId: i.accountId,
        description: i.description,
        branchId: userInfo.branchId,
        organizationId: userInfo.organizationId,
        createdById: userInfo.userId,
        updatedById: userInfo.userId,
        transactionType: Entries.DEBITS,
        status: 1,
      });

      arr.push(transactionItems);
    }

    for (const i of credits) {
      const transactionItems = await getCustomRepository(
        TransactionItemRepository
      ).save({
        transactionId: transaction.id,
        amount: i.amount,
        description: i.description,
        accountId: i.accountId,
        branchId: userInfo.branchId,
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

  async FindTransactionById(transactionId: number): Promise<ITransaction> {
    const [transaction] = await getCustomRepository(TransactionRepository).find(
      {
        where: { id: transactionId, status: 1 },
        relations: ['transactionItems'],
      }
    );
    return transaction;
  }

  async TransactionApi(transactions, user: IBaseUser): Promise<ITransaction> {
    try {
      console.log('making transaction...');
      if (transactions) {
        const debits = transactions['dr'];
        const credits = transactions['cr'];

        const debitIds = debits.map((i) => i.account_id);
        const creditIds = credits.map((i) => i.account_id);

        const initialValue = 0;
        const amount = debits.reduce(function (previousValue, currentValue) {
          return previousValue + currentValue.amount;
        }, initialValue);

        const intersection = debitIds.filter((element) =>
          creditIds.includes(element)
        );

        if (intersection.length > 0) {
          throw new HttpException(
            "There's no way to pass an entry on same accounts",
            HttpStatus.BAD_REQUEST
          );
        } else {
          const transaction = await getCustomRepository(
            TransactionRepository
          ).save({
            amount: transactions.amount ? transactions.amount : amount,
            ref: transactions.invoice
              ? transactions.invoice.reference
              : transactions.reference,
            date: transactions.createdAt || new Date(),
            createdAt: transactions.createdAt || new Date().toDateString(),
            narration: `System transaction against ${transactions?.invoice?.invoiceNumber}`,
            branchId: user.branchId,
            organizationId: user.organizationId,
            createdById: user.id,
            updatedById: user.id,
            status: transactions?.invoice?.status === 2 ? 2 : 1 || 1,
          });

          getCustomRepository(TransactionItemRepository).save(
            debits.map((dr) => ({
              transactionId: transaction.id,
              amount: dr.amount,
              accountId: dr.account_id,
              transactionType: Entries.DEBITS,
              branchId: user.branchId,
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
              accountId: cr.account_id,
              transactionType: Entries.CREDITS,
              branchId: user.branchId,
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
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async AddTransaction(data, req: IRequest): Promise<void> {
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

    const paymentArr = [];
    for (const i of data.transactions) {
      const getAccount = async (name: string) => {
        if (i.name) {
          const [account] = await getCustomRepository(AccountRepository).find({
            where: {
              name,
              organizationId: req.user.organizationId,
            },
          });
          return account.id;
        }
      };

      const transaction = await getCustomRepository(TransactionRepository).save(
        {
          amount: i.balance,
          ref: i.ref,
          narration: i.narration,
          date: new Date(),
          organizationId: req.user.organizationId,
          branchId: req.user.branchId,
          createdById: req.user.id,
          updatedById: req.user.id,
          status: 1,
        }
      );

      await getCustomRepository(TransactionItemRepository).save({
        amount: i.balance,
        accountId: i.accountId
          ? i.accountId
          : i.contactType === 'customer'
          ? await getAccount('Accounts Receivable')
          : await getAccount('Accounts Payable'),
        transactionId: transaction.id,
        transactionType: 10,
        branchId: req.user.branchId,
        organizationId: req.user.organizationId,
        createdById: req.user.id,
        updatedById: req.user.id,
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
