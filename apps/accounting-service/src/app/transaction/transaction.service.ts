import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Between, getCustomRepository, ILike, In } from 'typeorm';
import axios from 'axios';
import { Sorting } from '@invyce/sorting';

import {
  TransactionRepository,
  TransactionItemRepository,
  AccountRepository,
  PrimaryAccountRepository,
} from '../repositories';
import {
  IBaseUser,
  IPage,
  ITransactionItem,
  ITransaction,
  ITransactionWithResponse,
  IRequest,
} from '@invyce/interfaces';
import { DeleteTransactionsDto, TransactionDto } from '../dto/transaction.dto';
import { Entries } from '@invyce/global-constants';

const transactionNature = {
  reverse: true,
};

@Injectable()
export class TransactionService {
  async ListTransactions(
    user: IBaseUser,
    queryData: IPage
  ): Promise<ITransactionWithResponse> {
    try {
      const { page_no, page_size, sort, status, query } = queryData;
      const ps: number = parseInt(page_size);
      const pn: number = parseInt(page_no);

      let transactions;
      const { sort_column, sort_order } = await Sorting(sort);
      const total = await getCustomRepository(TransactionRepository).count({
        status: status || 1,
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
                status: status || 1,
                organizationId: user.organizationId,
                [i]: ILike(val),
              },
              skip: pn * ps - ps,
              take: ps,
              order: {
                [sort_column]: sort_order,
              },
              relations: ['transactionItems', 'transactionItems.account'],
            });
          } else if (data[i].type === 'compare') {
            transactions = await getCustomRepository(
              TransactionRepository
            ).find({
              where: {
                status: status || 1,
                organizationId: user.organizationId,
                [i]: In(data[i].value),
              },
              skip: pn * ps - ps,
              take: ps,
              order: {
                [sort_column]: sort_order,
              },
              relations: ['transactionItems', 'transactionItems.account'],
            });
          } else if (data[i].type === 'date-between') {
            const start_date = data[i].value[0];
            const end_date = data[i].value[1];
            transactions = await getCustomRepository(
              TransactionRepository
            ).find({
              where: {
                status: status || 1,
                organizationId: user.organizationId,
                [i]: Between(start_date, end_date),
              },
              skip: pn * ps - ps,
              take: ps,
              order: {
                [sort_column]: sort_order,
              },
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
            status: status || 1,
            organizationId: user.organizationId,
            branchId: user.branchId,
          },
          skip: pn * ps - ps,
          take: ps,
          relations: ['transactionItems', 'transactionItems.account'],
          order: {
            [sort_column]: sort_order,
          },
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

  async CreateTransaction(transactionDto: TransactionDto, userInfo) {
    if (transactionDto?.isNewRecord === false) {
      const transaction = await getCustomRepository(
        TransactionRepository
      ).findOne({
        id: transactionDto.id,
      });

      if (transaction) {
        await getCustomRepository(TransactionRepository).update(
          {
            id: transactionDto.id,
          },
          {
            date: transactionDto.date || transaction.date,
            ref: transactionDto.ref || transaction.ref,
            narration: transactionDto.narration || transaction.narration,
            notes: transactionDto.notes || transaction.notes,
            amount: transactionDto.amount || transaction.amount,
            updatedById: userInfo.id,
            status: transactionDto.status || transaction.status,
          }
        );

        await getCustomRepository(TransactionItemRepository).delete({
          transactionId: transactionDto.id,
        });

        const { debits, credits } = transactionDto.entries;

        for (const i of debits) {
          await getCustomRepository(TransactionItemRepository).save({
            transactionId: transaction.id,
            amount: i.amount,
            accountId: i.accountId,
            description: i.description,
            branchId: userInfo.branchId,
            organizationId: userInfo.organizationId,
            createdById: userInfo.userId,
            updatedById: userInfo.userId,
            transactionType: Entries.DEBITS,
            status: transaction.status,
          });
        }

        for (const i of credits) {
          await getCustomRepository(TransactionItemRepository).save({
            transactionId: transaction.id,
            amount: i.amount,
            description: i.description,
            accountId: i.accountId,
            branchId: userInfo.branchId,
            organizationId: userInfo.organizationId,
            createdById: userInfo.userId,
            updatedById: userInfo.userId,
            transactionType: Entries.CREDITS,
            status: transaction.status,
          });
        }

        return {
          message: 'Transaction updated successfully',
          status: true,
        };
      } else {
        throw new HttpException(
          'Transaction not found',
          HttpStatus.BAD_REQUEST
        );
      }
    }
    {
      const transaction = await getCustomRepository(TransactionRepository).save(
        {
          date: transactionDto.date,
          ref: transactionDto.ref,
          narration: transactionDto.narration,
          notes: transactionDto.notes,
          amount: transactionDto.amount,
          branchId: userInfo.branchId,
          organizationId: userInfo.organizationId,
          createdById: userInfo.userId,
          updatedById: userInfo.userId,
          status: transactionDto.status,
        }
      );

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
          status: transaction.status,
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
          status: transaction.status,
        });

        arr.push(transactionItems);
      }

      return {
        ...transaction,
        transactionItems: arr,
      };
    }
  }

  async ApproveTransaction(transactionId) {
    const transaction = await getCustomRepository(
      TransactionRepository
    ).findOne({
      id: transactionId,
    });

    if (transaction) {
      await getCustomRepository(TransactionRepository).update(
        {
          id: transactionId,
        },
        {
          status: 1,
        }
      );

      await getCustomRepository(TransactionItemRepository).update(
        {
          transactionId: transactionId,
        },
        {
          status: 1,
        }
      );

      return {
        message: 'Transaction approved successfully',
        status: true,
      };
    }
  }

  async FindTransactionById(transactionId: number): Promise<ITransaction> {
    const [transaction] = await getCustomRepository(TransactionRepository).find(
      {
        where: { id: transactionId },
        relations: ['transactionItems', 'transactionItems.account'],
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
            ref: transactions.reference,
            date: transactions.createdAt || new Date(),
            createdAt: transactions.createdAt || new Date().toDateString(),
            narration: `System transaction against ${transactions.type}`,
            branchId: user.branchId,
            organizationId: user.organizationId,
            createdById: user.id,
            updatedById: user.id,
            status: transactions?.status === 2 ? 2 : 1 || 1,
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
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async AddTransaction(data, req: IRequest): Promise<void> {
    // let token;
    // if (process.env.NODE_ENV === 'development') {
    //   const header = req.headers?.authorization?.split(' ')[1];
    //   token = header;
    // } else if (process.env['NODE' + '_ENV'] === 'production') {
    //   if (!req || !req.cookies) return null;
    //   token = req.cookies['access_token'];
    // }

    // const type =
    //   process.env.NODE_ENV === 'development' ? 'Authorization' : 'cookie';
    // const value =
    //   process.env.NODE_ENV === 'development'
    //     ? `Bearer ${token}`
    //     : `access_token=${token}`;

    if (!req || !req.cookies) return null;
    const token = req?.cookies['access_token'];

    const http = axios.create({
      baseURL: process.env.SSL ? 'https://localhost' : 'payments',
      headers: {
        cookie: `access_token=${token}`,
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

  async CashSummaryReport(user: IBaseUser, query) {
    return await getCustomRepository(PrimaryAccountRepository)
      .createQueryBuilder('pa')
      .where({
        status: 1,
        organizationId: user.organizationId,
        name: In(['asset', 'liability']),
      })
      .innerJoinAndSelect('pa.accounts', 'acc')
      .innerJoinAndSelect('acc.transactionItems', 'ti')
      .getMany();
  }

  async reverseTransaction(transactionId: DeleteTransactionsDto, user) {
    const transactions = await getCustomRepository(TransactionRepository).find({
      where: {
        id: In(transactionId.ids),
      },
      relations: ['transactionItems'],
    });

    for (const i of transactions) {
      const newTransaction = await getCustomRepository(
        TransactionRepository
      ).save({
        amount: i.amount,
        ref: i.ref,
        date: new Date(),
        // createdAt: transactions.createdAt || new Date().toDateString(),
        narration: `System reverse entry transaction against ${i.id}`,
        branchId: user.branchId,
        organizationId: user.organizationId,
        createdById: user.id,
        updatedById: user.id,
        status: 1,
      });

      for (const j of i.transactionItems) {
        if (j.transactionType === Entries.DEBITS) {
          await getCustomRepository(TransactionItemRepository).save({
            transactionId: newTransaction.id,
            amount: j.amount,
            accountId: j.accountId,
            transactionType: Entries.CREDITS,
            branchId: user.branchId,
            organizationId: user.organizationId,
            createdById: user.id,
            updatedById: user.id,
            // createdAt: transaction.createdAt,
            status: 1,
          });
        } else if (j.transactionType === Entries.CREDITS) {
          await getCustomRepository(TransactionItemRepository).save({
            transactionId: newTransaction.id,
            amount: j.amount,
            accountId: j.accountId,
            transactionType: Entries.DEBITS,
            branchId: user.branchId,
            organizationId: user.organizationId,
            createdById: user.id,
            updatedById: user.id,
            // createdAt: transaction.createdAt,
            status: 1,
          });
        }
      }
    }

    return true;
  }

  async DeleteTransaction(trasnactionIds) {
    for (const transactionId of trasnactionIds.ids) {
      await getCustomRepository(TransactionRepository).update(
        { id: transactionId },
        { status: 0 }
      );

      const items = await getCustomRepository(TransactionItemRepository).find({
        where: {
          transactionId: transactionId,
        },
      });

      for (const i of items) {
        await getCustomRepository(TransactionItemRepository).update(
          { id: i.id },
          {
            status: 0,
          }
        );
      }
    }
  }

  async DeleteJornalEntry(
    trasnactionIds: DeleteTransactionsDto,
    user: IBaseUser
  ): Promise<void> {
    if (transactionNature.reverse) {
      await this.reverseTransaction(trasnactionIds, user);
    } else {
      await this.DeleteTransaction(trasnactionIds);
    }
  }
}
