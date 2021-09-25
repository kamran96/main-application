import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Between, getCustomRepository, ILike, In } from 'typeorm';
import { Sorting } from '@invyce/sorting';

import {
  TransactionRepository,
  TransactionItemRepository,
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
}
