import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { getCustomRepository } from 'typeorm';
import * as Moment from 'moment';
import { ITransaction } from '../interfaces/ITransaction';
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
  async ListTransactions(transactionData) {
    try {
      const transactionRepository = getCustomRepository(TransactionRepository);
      const transaction = await transactionRepository.find({
        where: {
          status: 1,
        },
        relations: ['transactionItems'],
      });

      return transaction;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async CreateTransaction(transactionDto, userInfo): Promise<any> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const transactionItemRepository = getCustomRepository(
      TransactionItemRepository
    );

    const transaction = await transactionRepository.save({
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

    let arr = [];

    for (let i of debits) {
      const transactionItems = await transactionItemRepository.save({
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

    for (let i of credits) {
      const transactionItems = await transactionItemRepository.save({
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
}
