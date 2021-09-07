import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { getCustomRepository } from 'typeorm';
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
  async ListTransactions(user, query) {
    try {
      const { page_no, page_size, sort } = query;

      const { sort_column, sort_order } = await Sorting(sort);

      let transactions = await getCustomRepository(TransactionRepository).find({
        where: {
          status: 1,
          organizationId: user.organizationId,
          // branchId: user.branchId,
        },
        skip: page_no * page_no - page_no,
        take: page_size,
        relations: ['transactionItems', 'transactionItems.account'],
      });

      const total = await getCustomRepository(TransactionRepository).count({
        status: 1,
        organizationId: user.organizationId,
        // branchId: user.branchId,
      });

      return {
        pagination: {
          total,
          total_pages: Math.ceil(total / page_size),
          page_size: parseInt(page_size) || 20,
          // page_total: null,
          page_no: parseInt(page_no),
          sort_column: sort_column,
          sort_order: sort_order,
        },
        transactions,
      };
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
