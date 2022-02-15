import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  AccountRepository,
  PrimaryAccountRepository,
  SecondaryAccountRepository,
  TransactionItemRepository,
  TransactionRepository,
} from '../repositories';
import * as moment from 'moment';
import { getCustomRepository, In, Not, Raw } from 'typeorm';
import { Sorting } from '@invyce/sorting';
import { Integrations, Entries } from '@invyce/global-constants';
import {
  IAccount,
  IAccountWithResponse,
  IBaseUser,
  IPage,
  IRequest,
  ISecondaryAccount,
} from '@invyce/interfaces';
import { AccountDto, AccountIdsDto } from '../dto/account.dto';
import { PrimaryAccounts, TransactionItems, Transactions } from '../entities';

@Injectable()
export class AccountsService {
  // account name filter not working
  async ListAccounts(
    user: IBaseUser,
    queryData: IPage
  ): Promise<IAccountWithResponse> {
    try {
      const { purpose, page_size, page_no, sort, query } = queryData;
      const ps: number = parseInt(page_size);
      const pn: number = parseInt(page_no);

      const total = await getCustomRepository(AccountRepository).count({
        status: 1,
        organizationId: user.organizationId,
      });

      const { sort_column, sort_order } = await Sorting(sort);

      let accounts;
      if (purpose === 'ALL') {
        accounts = await getCustomRepository(AccountRepository).find({
          where: { status: 1, organizationId: user.organizationId },
          relations: ['secondaryAccount', 'secondaryAccount.primaryAccount'],
        });

        return {
          result: accounts,
        };
      } else {
        const total_debits = await getCustomRepository(
          TransactionItemRepository
        )
          .createQueryBuilder('ti')
          .select('coalesce(sum(ti.amount), 0)')
          .leftJoin('ti.transaction', 't')
          .where('ti."accountId" = a.id')
          .andWhere('ti."transactionType" = 10')
          .andWhere('t.status = 1')
          .andWhere('ti.status = 1')
          // .andWhere('t.date between :start and :end')
          .getQuery();

        const total_credits = await getCustomRepository(
          TransactionItemRepository
        )
          .createQueryBuilder('ti')
          .select('coalesce(sum(ti.amount), 0)')
          .leftJoin('ti.transaction', 't')
          .where('ti."accountId" = a.id')
          .andWhere('ti."transactionType" = 20')
          .andWhere('t.status = 1')
          .andWhere('ti.status = 1')
          // .andWhere('t.date between :start and :end')
          .getQuery();

        const balances = `case when pa.name='asset' OR pa.name='expense'
        then ( (${total_debits})-(${total_credits}))
        else (( ${total_credits})-(${total_debits})) end`;

        if (query) {
          // const filterData = Buffer.from(query, 'base64').toString();
          // const data = JSON.parse(filterData);

          const data = {
            name: {
              type: 'search',
              value: '%cash%',
            },
          };

          for (const i in data) {
            if (data[i].type === 'search') {
              const val = data[i].value.toLowerCase();
              accounts = await getCustomRepository(AccountRepository)
                .createQueryBuilder('a')
                .select(
                  `a.*, (${total_debits}) as total_debits, (${total_credits}) as total_credits, (abs(${balances})) as balance `
                )
                .where({
                  organizationId: user.organizationId,
                })
                .andWhere('a.name like :name', { name: val })
                .leftJoin('a.secondaryAccount', 'sa')
                .leftJoin('sa.primaryAccount', 'pa')
                .offset(pn * ps - ps)
                .limit(ps)
                .getRawMany();
            } else if (data[i].type === 'in') {
              accounts = await getCustomRepository(AccountRepository)
                .createQueryBuilder('a')
                .select(
                  `a.*, (${total_debits}) as total_debits, (${total_credits}) as total_credits, (abs(${balances})) as balance `
                )
                .where({
                  organizationId: user.organizationId,
                  secondaryAccountId: In([data[i].value]),
                })
                .leftJoin('a.secondaryAccount', 'sa')
                .leftJoin('sa.primaryAccount', 'pa')
                .offset(pn * ps - ps)
                .limit(ps)
                .getRawMany();
            }
          }
        } else {
          accounts = await getCustomRepository(AccountRepository)
            .createQueryBuilder('a')
            .select(
              `a.*, (${total_debits}) as total_debits, (${total_credits}) as total_credits, (abs(${balances})) as balance `
            )
            .where({
              organizationId: user.organizationId,
            })
            .leftJoin('a.secondaryAccount', 'sa')
            .leftJoin('sa.primaryAccount', 'pa')
            .offset(pn * ps - ps)
            .limit(ps)
            .getRawMany();
        }
      }

      return {
        pagination: {
          total,
          total_pages: Math.ceil(total / ps),
          page_size: parseInt(page_size) || 20,
          page_no: parseInt(page_no),
          sort_column: sort_column,
          sort_order: sort_order,
        },
        result: accounts,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async AccountWithType(type: string, user: IBaseUser) {
    if (type === 'invoice') {
      const primaryAccounts = await getCustomRepository(
        PrimaryAccountRepository
      ).find({
        select: ['id'],
        where: {
          name: In(['revenue']),
        },
      });

      const mapPrimaryAccounts = primaryAccounts.map((p) => p.id);
      const accounts = await getCustomRepository(AccountRepository).find({
        where: {
          primaryAccountId: In(mapPrimaryAccounts),
          organizationId: user.organizationId,
          status: 1,
        },
      });
      return accounts;
    } else if (type === 'bill') {
      const primaryAccounts = await getCustomRepository(
        PrimaryAccountRepository
      ).find({
        select: ['id'],
        where: { name: In(['asset']) },
      });

      const mapPrimaryAccounts = primaryAccounts.map((p) => p.id);
      const accounts = await getCustomRepository(AccountRepository).find({
        where: {
          primaryAccountId: In(mapPrimaryAccounts),
          organizationId: user.organizationId,
          status: 1,
        },
      });
      return accounts;
    }
  }

  async SecondaryAccountName(user: IBaseUser): Promise<ISecondaryAccount[]> {
    return await getCustomRepository(SecondaryAccountRepository).find({
      where: {
        status: 1,
        organizationId: user.organizationId,
      },
      relations: ['primaryAccount'],
    });
  }

  async GetBalances(user, query) {
    // sql = 'select id from accounts where primary_account_id in (Select id from primary where name=assests or name=expenses';

    // const data = {
    //   accountIds: [482, 485, 500],
    //   dates: ['2022-01-01', '2022-01-07'],
    //   primaryAccounts: [],
    // };
    const data = {
      accountIds: [],
      dates: ['2022-01-01', '2022-01-07'],
      primaryAccounts: ['asset'],
    };

    let account;

    const total_debits = await getCustomRepository(TransactionItemRepository)
      .createQueryBuilder('ti')
      .select('coalesce(sum(ti.amount), 0)')
      .leftJoin('ti.transaction', 't')
      .where('ti."accountId" = a.id')
      .andWhere('ti."transactionType" = 10')
      .andWhere('t.status = 1')
      .andWhere('ti.status = 1')
      .andWhere('t.date < :start')
      .getQuery();

    const total_credits = await getCustomRepository(TransactionItemRepository)
      .createQueryBuilder('ti')
      .select('coalesce(sum(ti.amount), 0)')
      .leftJoin('ti.transaction', 't')
      .where('ti."accountId" = a.id')
      .andWhere('ti."transactionType" = 20')
      .andWhere('t.status = 1')
      .andWhere('ti.status = 1')
      .andWhere('t.date < :start')
      .getQuery();

    const balances = `case when pa.name='asset' OR pa.name='expense'
      then ( (${total_debits})-(${total_credits}))
      else (( ${total_credits})-(${total_debits})) end`;

    let accounts_array = [];
    for (const i of data.dates) {
      if (data?.accountIds.length > 0) {
        account = await getCustomRepository(AccountRepository)
          .createQueryBuilder('a')
          .select(
            `a.*, pa.name as "primaryName", sa.name as "secondaryName", 
              (${total_debits}) as total_debits,
              (${total_credits}) as total_credits,
              (abs(${balances})) as balance `
          )
          .where({
            organizationId: user.organizationId,
            id: In(data.accountIds),
          })
          .leftJoin('a.secondaryAccount', 'sa')
          .leftJoin('sa.primaryAccount', 'pa')
          .setParameter('start', i)
          .getRawMany();

        account = account.map((obj) => {
          obj.date = i;
          return obj;
        });

        accounts_array.push(account);
        accounts_array = accounts_array.flat();
      } else if (data?.primaryAccounts.length > 0) {
        account = await getCustomRepository(AccountRepository)
          .createQueryBuilder('a')
          .select(
            `a.*, pa.name as "primaryName", sa.name as "secondaryName", 
              (${total_debits}) as total_debits,
              (${total_credits}) as total_credits,
              (abs(${balances})) as balance `
          )
          .where({
            organizationId: user.organizationId,
          })
          .andWhere((qb) => {
            const subQuery = qb
              .subQuery()
              .select('id')
              .from(PrimaryAccounts, 'p')
              .where('p.name = :name')
              .getQuery();
            return `a."primaryAccountId" IN ` + subQuery;
          })
          .leftJoin('a.secondaryAccount', 'sa')
          .leftJoin('sa.primaryAccount', 'pa')
          .setParameter('name', 'asset')
          .setParameter('start', i)
          .getRawMany();

        account = account.map((obj) => {
          obj.date = i;
          return obj;
        });

        accounts_array.push(account);
        accounts_array = accounts_array.flat();
      }
    }

    const newAccountArray = [];
    if (data.accountIds.length > 0) {
      for (const i of data.accountIds) {
        const filter = accounts_array.filter((j) => j.id === i);

        const balances = filter.map((f) => ({
          balance: f.balance,
          total_debits: f.total_debits,
          total_credits: f.total_credits,
          date: f.date,
        }));

        const [account] = filter;
        const { name } = account;

        delete account.date;
        delete account.balance;
        delete account.total_debits;
        delete account.total_credits;

        newAccountArray.push({
          [name]: { ...account, balances },
        });
      }
    } else if (data.primaryAccounts.length > 0) {
      for (const i of data.primaryAccounts) {
        const filter = accounts_array.filter((j) => j.primaryName === i);

        const balances = filter.map((f) => ({
          balance: f.balance,
          total_debits: f.total_debits,
          total_credits: f.total_credits,
          date: f.date,
        }));

        const [account] = filter;
        const { name } = account;

        delete account.date;
        delete account.balance;
        delete account.total_debits;
        delete account.total_credits;

        newAccountArray.push({
          [name]: { ...account, balances },
        });
      }
    }

    return newAccountArray;
  }

  async initAccounts(data: IRequest): Promise<void> {
    try {
      const { primary, secondary } = await import('../accounts');
      for (const account of primary) {
        const accountModel = {
          name: account.name,
          status: 1,
          code: account.code,
          organizationId: data.user.organizationId,
          createdById: data.user.id, // need to be change later
          updatedById: data.user.id, // need to be change later
        };
        const primaryAccount = await getCustomRepository(
          PrimaryAccountRepository
        ).save(accountModel);
        const secondaryAccounts = secondary.filter(
          (item) => item.primary_account_id === account.oldId
        );
        for (const secondaryAccount of secondaryAccounts) {
          const secondaryModel = {
            name: secondaryAccount.name,
            code: secondaryAccount.code,
            status: 1,
            primaryAccountId: primaryAccount.id,
            organizationId: data.user.organizationId,
            updatedById: data.user.id,
            createdById: data.user.id,
          };
          const insertSecondary = await getCustomRepository(
            SecondaryAccountRepository
          ).save(secondaryModel);
          if (secondaryAccount.accounts.length > 0) {
            for (const account of secondaryAccount.accounts) {
              const accountModel = {
                name: account.name,
                status: 1,
                code: account.code,
                isSystemAccount: account.isSystemAccount,
                secondaryAccountId: insertSecondary.id,
                primaryAccountId: primaryAccount.id,
                importedFrom: 'init',
                organizationId: data.user.organizationId,
                createdById: data.user.id,
                updatedById: data.user.id,
              };
              await getCustomRepository(AccountRepository).save(accountModel);
            }
          }
        }
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async AccountLedger(
    user: IBaseUser,
    queryData: IPage,
    accountId: number
  ): Promise<IAccountWithResponse> {
    const { page_size, page_no, sort, query } = queryData;
    const ps: number = parseInt(page_size);
    const pn: number = parseInt(page_no);
    let sql = `
            SELECT transaction_items.*, (
              select date from transactions
              where transactions.id = transaction_items."transactionId"
              and transactions.status = 1
            )
        FROM "transaction_items"
        WHERE "transaction_items"."status" = 1
        AND "transaction_items"."organizationId" = '${user.organizationId}'
        AND "transaction_items"."transactionId" IN
          (
              SELECT "transaction_items"."transactionId" FROM "transaction_items"
              WHERE "transaction_items"."accountId" = ${accountId}
              )
        AND "transaction_items"."accountId" != ${accountId}
    `;

    let opening_balance;

    if (query) {
      const filterData = Buffer.from(query, 'base64').toString();
      const data = JSON.parse(filterData);

      for (const i in data) {
        if (data[i].type === 'date-between') {
          const start_date = data[i].value[0];
          const end_date = data[i].value[1];
          const add_one_day = moment(end_date).add(1, 'day').format();

          opening_balance = getCustomRepository(TransactionItemRepository)
            .query(`
              SELECT (
                select coalesce(sum(case when transaction_items."transactionType" = 10
                then transaction_items.amount else - transaction_items.amount end ), 0)
                  from transaction_items where transaction_items."transactionId" in (
                    select id from transactions where date < '${start_date}'
                  ) and transaction_items."accountId" = accounts.id
                    and transaction_items.status = 1 ) as balance,
                     (
                  SELECT "transactions"."date" FROM "transactions"
                  WHERE (date < '${start_date}')
                  AND "transactions"."status" = 1
                  AND "transactions"."id" IN (
                    SELECT "transaction_items"."transactionId" FROM "transaction_items"
                    WHERE "transaction_items"."accountId" = accounts.id)
                    ORDER BY "transactions"."date"
                    DESC LIMIT 1) as date FROM "accounts"
                    WHERE "accounts"."id" = ${accountId}
                    AND "accounts"."organizationId" = '${user.organizationId}'
                    AND "accounts"."status" = 1
            `);

          sql = sql += `and transaction_items."transactionId" in (
              select id from transactions
              WHERE transactions.${i} BETWEEN '${start_date}' AND '${add_one_day}'
            )`;
        }
      }
    }

    const { sort_column, sort_order } = await Sorting(sort);

    const page = `
    limit ${ps || 20}
    offset ${pn * ps - ps || 0}
  `;

    const transaction_items = await getCustomRepository(
      TransactionItemRepository
    ).query((sql += `order by ${sort_column} ${sort_order}  ${page}`));

    const account_arr = [];
    const transaction_arr = [];
    for (const i of transaction_items) {
      const [account] = await getCustomRepository(AccountRepository).find({
        where: {
          id: i.accountId,
        },
      });
      account_arr.push(account);

      const [transaction] = await getCustomRepository(
        TransactionRepository
      ).find({
        where: {
          id: i.transactionId,
        },
      });
      transaction_arr.push(transaction);
    }

    const new_arr = [];
    for (const i of transaction_items) {
      const account = account_arr.find((a) => a.id === i.accountId);
      const transaction = transaction_arr.find(
        (tr) => tr.id === i.transactionId
      );
      new_arr.push({
        ...i,
        account,
        transaction,
      });
    }

    const total = await getCustomRepository(TransactionItemRepository).count({
      status: 1,
      organizationId: user.organizationId,
    });

    return {
      pagination: {
        total,
        total_pages: Math.ceil(total / ps),
        page_size: ps || 20,
        // page_total: null,
        page_no: pn,
        sort_column: sort_column,
        sort_order: sort_order,
      },
      opening_balance: {
        comment: 'Opening Balance',
        date: opening_balance?.length > 0 ? opening_balance[0].date : null,
        amount: opening_balance?.length > 0 ? opening_balance[0].balance : null,
      },
      transaction_items: new_arr,
    };
  }

  async AccountLedgerUpdated(
    user: IBaseUser,
    queryData: IPage,
    accountId: number
  ): Promise<IAccountWithResponse> {
    try {
      let ledger;
      let opening_balance;

      const { page_size, page_no, sort, query } = queryData;
      const ps: number = parseInt(page_size);
      const pn: number = parseInt(page_no);

      const { sort_column, sort_order } = await Sorting(sort);

      const total = await getCustomRepository(TransactionItemRepository).count({
        status: 1,
        organizationId: user.organizationId,
      });

      if (!query) {
        ledger = await getCustomRepository(TransactionItemRepository)
          .createQueryBuilder('ti')
          .select(
            `ti.*, (
              select date from transactions t
              where t.id = ti."transactionId"
              and t.status = 1
            ) as date`
          )
          .where({
            organizationId: user.organizationId,
            status: 1,
          })
          .andWhere((qb) => {
            const subQuery = qb
              .subQuery()
              .select('"transactionId"')
              .from(TransactionItems, 'items')
              .where(`items."accountId" = :accountId`)
              .getQuery();

            return `ti."transactionId" IN ` + subQuery;
          })
          .setParameter('accountId', accountId)
          .andWhere({ accountId: Not(accountId) })
          .innerJoin('ti.account', 'acc')
          .addSelect(
            'acc.name as "accountName", acc."secondaryAccountId", acc."primaryAccountId", acc.code as "accountCode"'
          )
          .offset(pn * ps - ps)
          .limit(ps)
          .getRawMany();
      } else {
        const filterData = Buffer.from(query, 'base64').toString();
        const data = JSON.parse(filterData);

        // const data = {
        //   date: {
        //     type: 'date-between',
        //     value: ['2022-01-5', '2022-01-07'],
        //   },
        // };

        for (const i in data) {
          if (data[i].type === 'date-between') {
            const start_date = data[i].value[0];
            const end_date = data[i].value[1];
            const add_one_day = moment(end_date).add(1, 'day').format();

            opening_balance = await getCustomRepository(AccountRepository)
              .createQueryBuilder('a')
              .select(
                `(coalesce(sum(case when ti."transactionType" = 10
                then ti.amount else - ti.amount end ), 0)) as balance`
              )
              .innerJoin('a.transactionItems', 'ti')
              .innerJoin('ti.transaction', 't')
              .where({
                id: accountId,
                organizationId: user.organizationId,
                status: 1,
              })
              .getRawOne();

            opening_balance.date = start_date;

            ledger = await getCustomRepository(TransactionItemRepository)
              .createQueryBuilder('ti')
              .select(
                `ti.*, (
                  select date from transactions t
                  where t.id = ti."transactionId"
                  and t.status = 1
                ) as date`
              )
              .where({
                organizationId: user.organizationId,
                status: 1,
              })
              .andWhere((qb) => {
                const subQuery = qb
                  .subQuery()
                  .select('"transactionId"')
                  .from(TransactionItems, 'items')
                  .where(`items."accountId" = :accountId`)
                  .getQuery();

                return `ti."transactionId" IN ` + subQuery;
              })
              .setParameter('accountId', accountId)
              .andWhere({ accountId: Not(accountId) })
              .innerJoin('ti.account', 'acc')
              .addSelect(
                'acc.name as "accountName", acc."secondaryAccountId", acc."primaryAccountId", acc.code as "accountCode"'
              )
              .andWhere((qb) => {
                const subQuery = qb
                  .subQuery()
                  .select('"id"')
                  .from(Transactions, 't')
                  .where(`t."${i}" between :startDate AND :endDate`)
                  .getQuery();

                return `ti."transactionId" IN ` + subQuery;
              })
              .setParameter('startDate', start_date)
              .setParameter('endDate', add_one_day)
              .offset(pn * ps - ps)
              .limit(ps)
              .getRawMany();
          }
        }
      }

      return {
        pagination: {
          total,
          total_pages: Math.ceil(total / ps),
          page_size: ps || 20,
          // page_total: null,
          page_no: pn,
          sort_column: sort_column,
          sort_order: sort_order,
        },
        opening_balance: {
          comment: 'Opening Balance',
          date: opening_balance ? opening_balance.date : null,
          amount: opening_balance ? opening_balance.balance : null,
        },
        result: ledger,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async CreateOrUpdateAccount(
    accountDto: AccountDto,
    accountData: IBaseUser
  ): Promise<IAccount> {
    const accountRepository = getCustomRepository(AccountRepository);
    if (accountDto && accountDto.isNewRecord === false) {
      // we need to update account
      try {
        const result = await accountRepository.find({
          where: { id: accountDto.id, status: 1 },
        });
        if (Array.isArray(result) && result.length > 0) {
          const [account] = result;
          const updatedAccount = { ...account };
          delete updatedAccount.id;
          updatedAccount.name = accountDto.name || account.name;
          updatedAccount.description =
            accountDto.description || account.description;
          updatedAccount.code = accountDto.code || account.code;
          updatedAccount.taxRate = accountDto.taxRate;
          updatedAccount.secondaryAccountId =
            accountDto.secondaryAccountId || account.secondaryAccountId;
          updatedAccount.primaryAccountId =
            accountDto.primaryAccountId || account.primaryAccountId;
          updatedAccount.status = account.status;
          // updatedAccount.branchId = account.branchId;
          updatedAccount.organizationId = account.organizationId;
          updatedAccount.createdById = account.createdById;
          updatedAccount.updatedById = accountData.id;
          updatedAccount.status = 1;

          await accountRepository.update({ id: accountDto.id }, updatedAccount);

          return await this.FindAccountById(accountDto.id);
        }
        throw new HttpException('Invalid params', HttpStatus.BAD_REQUEST);
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    } else {
      try {
        // we need to create new account
        const account = await accountRepository.save({
          name: accountDto.name,
          description: accountDto.description,
          code: accountDto.code,
          secondaryAccountId: accountDto.secondaryAccountId,
          primaryAccountId: accountDto.primaryAccountId,
          taxRate: accountDto.taxRate,
          // branchId: accountDto.branchId,
          organizationId: accountData.organizationId,
          status: 1,
          createdById: accountData.id,
          updatedById: accountData.id,
        });

        return account;
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }

  async FindAccountById(accountId: number): Promise<IAccount> {
    const [account] = await getCustomRepository(AccountRepository).find({
      where: { id: accountId, status: 1 },
      relations: ['secondaryAccount', 'secondaryAccount.primaryAccount'],
    });

    return account;
  }

  async DeleteAccount(accountDto: AccountIdsDto): Promise<boolean> {
    try {
      for (const i of accountDto.ids) {
        await getCustomRepository(AccountRepository).update(
          { id: i },
          { status: 0 }
        );
      }

      return true;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async FindAccountsByCode(codes, user: IBaseUser): Promise<IAccount[]> {
    return await getCustomRepository(AccountRepository).find({
      where: {
        code: In(codes),
        organizationId: user.organizationId,
      },
    });
  }

  async SyncAccounts(data, user: IBaseUser): Promise<void> {
    if (data.type === Integrations.XERO) {
      for (const i of data.accounts) {
        const accountBalance = data.balances.find((j) => j.id === i.accountID);

        const account = await getCustomRepository(AccountRepository).find({
          where: {
            importedAccountId: i.accountID,
            organizationId: user.organizationId,
          },
        });

        if (account.length === 0) {
          const secondaryAccount = await getCustomRepository(
            SecondaryAccountRepository
          ).find({
            where: {
              name: i.type,
              organizationId: user.organizationId,
              status: 1,
            },
          });

          let newSecondaryAccount;
          if (secondaryAccount.length === 0) {
            const primaryAccount = await getCustomRepository(
              PrimaryAccountRepository
            ).find({
              where: {
                name: Raw(
                  (alias) => `lower(${alias}) ilike lower('%${i._class}%')`
                ),
                organizationId: user.organizationId,
                status: 1,
              },
            });

            newSecondaryAccount = await getCustomRepository(
              SecondaryAccountRepository
            ).save({
              name: i.type,
              primaryAccountId:
                primaryAccount.length > 0 ? primaryAccount[0].id : null,
              organizationId: user.organizationId,
              createdById: user.id,
              updatedById: user.id,
              status: 1,
            });
          }

          const account = await getCustomRepository(AccountRepository).save({
            name: i.name,
            description: i.description,
            secondaryAccountId:
              secondaryAccount.length > 0
                ? secondaryAccount[0].id
                : newSecondaryAccount.id,
            primaryAccountId:
              secondaryAccount.length > 0
                ? secondaryAccount[0].primaryAccountId
                : newSecondaryAccount.primaryAccountId,
            code: i.code,
            taxRate: null,
            status: 1,
            importedAccountId: i.accountID,
            importedFrom: Integrations.XERO,
            organizationId: user.organizationId,
          });

          if (accountBalance?.balance > 0) {
            const transaction = await getCustomRepository(
              TransactionRepository
            ).save({
              amount: accountBalance.balance,
              ref: 'Xero account balance',
              narration: 'Xero account balance',
              date: new Date(),
              organizationId: user.organizationId,
              branchId: user.branchId,
              createdById: user.id,
              updatedById: user.id,
              status: 1,
            });

            await getCustomRepository(TransactionItemRepository).save({
              amount: accountBalance.balance,
              accountId: account.id,
              transactionId: transaction.id,
              transactionType: Entries.DEBITS,
              branchId: user.branchId,
              organizationId: user.organizationId,
              createdById: user.id,
              updatedById: user.id,
              status: 1,
            });
          }
        }
      }
    } else if (data.type === Integrations.QUICK_BOOK) {
      for (const i of data.accounts) {
        const account = await getCustomRepository(AccountRepository).find({
          where: {
            importedAccountId: i.Id,
            organizationId: user.organizationId,
          },
        });

        if (account.length === 0) {
          const secondaryAccount = await getCustomRepository(
            SecondaryAccountRepository
          ).find({
            where: {
              name: i.type,
              organizationId: user.organizationId,
              status: 1,
            },
          });

          let newSecondaryAccount;
          if (secondaryAccount.length === 0) {
            const primaryAccount = await getCustomRepository(
              PrimaryAccountRepository
            ).find({
              where: {
                name: Raw(
                  (alias) =>
                    `lower(${alias}) ilike lower('%${i.Classification}%')`
                ),
                organizationId: user.organizationId,
                status: 1,
              },
            });

            newSecondaryAccount = await getCustomRepository(
              SecondaryAccountRepository
            ).save({
              name: i.AccountType,
              primaryAccountId:
                primaryAccount.length > 0 ? primaryAccount[0].id : null,
              organizationId: user.organizationId,
              createdById: user.id,
              updatedById: user.id,
              status: 1,
            });
          }

          const account = await getCustomRepository(AccountRepository).save({
            name: i.Name,
            description: i.FullyQualifiedName,
            secondaryAccountId:
              secondaryAccount.length > 0
                ? secondaryAccount[0].id
                : newSecondaryAccount.id,
            // code: getCode.toString(),
            importedAccountId: i.Id,
            importedFrom: Integrations.QUICK_BOOK,
            organizationId: user.organizationId,
            createdById: user.id,
            updatedById: user.id,
            status: 1,
          });

          if (i?.CurrentBalance > 0) {
            const transaction = await getCustomRepository(
              TransactionRepository
            ).save({
              amount: i.CurrentBalance,
              ref: 'Quickbooks account balance',
              narration: 'Quickbooks account balance',
              date: new Date(),
              organizationId: user.organizationId,
              branchId: user.branchId,
              createdById: user.id,
              updatedById: user.id,
              status: 1,
            });

            await getCustomRepository(TransactionItemRepository).save({
              amount: i.CurrentBalance,
              accountId: account.id,
              transactionId: transaction.id,
              transactionType: Entries.DEBITS,
              branchId: user.branchId,
              organizationId: user.organizationId,
              createdById: user.id,
              updatedById: user.id,
              status: 1,
            });
          }
        }
      }
    }
  }
}
