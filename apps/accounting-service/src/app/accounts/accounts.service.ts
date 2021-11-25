import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  AccountRepository,
  PrimaryAccountRepository,
  SecondaryAccountRepository,
  TransactionItemRepository,
  TransactionRepository,
} from '../repositories';
import * as moment from 'moment';
import { getCustomRepository, In, Raw } from 'typeorm';
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

@Injectable()
export class AccountsService {
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
        });
      } else {
        let sql = `
      select 
      a.id, a.name, a.description, a.code, sa.name as "type", pa.name as "primary", 
      pa.id as "primaryAccountId", sa.id as "secondaryAccountId",
      coalesce((
        select count(ti.id) from transaction_items ti
        where ti."accountId" = a.id
        group by a.id
      ), 0) as total_transactions,
      
      coalesce((
        select sum(ti.amount) from transaction_items ti
        where ti."accountId" = a.id and ti."transactionType" = 20
      ), 0) as total_credit,
      
      coalesce((
        select sum(ti.amount) from transaction_items ti
        where ti."accountId" = a.id and ti."transactionType" = 10
      ), 0) as total_debit,
      
      ABS((
        CASE
        WHEN (pa.name = 'assets') OR ( pa.name='expense') THEN (
          coalesce((
            SELECT sum(ti.amount) from transaction_items AS ti
            left join transactions as t
            on ti."transactionId" = t.id
            WHERE ti."accountId" = a.id AND ti."transactionType" = 10
            and t.status = 1
          ), 0) 
            -
    
          coalesce((
            SELECT sum(ti.amount) from transaction_items AS ti
            left join transactions as t
            on ti."transactionId" = t.id
            WHERE ti."accountId" = a.id AND ti."transactionType" = 20
            and t.status = 1
          ), 0 )
        )
        ELSE 
           coalesce((
            SELECT sum(ti.amount) from transaction_items AS ti
            left join transactions as t
            on ti."transactionId" = t.id
            WHERE ti."accountId" = a.id AND ti."transactionType" = 20
            and t.status = 1
          ), 0) -
    
          coalesce((
            SELECT sum(ti.amount) from transaction_items AS ti
            left join transactions as t
            on ti."transactionId" = t.id
            WHERE ti."accountId" = a.id AND ti."transactionType" = 10
            and t.status = 1
          ), 0 )
        END
        )) as balance
    from accounts a
    left join secondary_accounts sa
    on sa.id = a."secondaryAccountId"
    left join primary_accounts pa
    on pa.id = sa."primaryAccountId"
    where a."organizationId" = '${user.organizationId}'
    `;

        if (query) {
          const filterData = Buffer.from(query, 'base64').toString();
          const data = JSON.parse(filterData);

          for (const i in data) {
            if (data[i].type === 'search') {
              const val = data[i].value.toLowerCase();
              return await getCustomRepository(AccountRepository).query(
                (sql += `and lower(a.${i}) like '${val}'`)
              );
            } else if (data[i].type === 'in') {
              return await getCustomRepository(AccountRepository).query(
                (sql += `and a."${i}" in (${data[i].value})`)
              );
            }
          }
        }

        const page = `
        limit ${ps || 20}
        offset ${pn * ps - ps || 0}
      `;

        // const secondaryAccounts = await getCustomRepository(
        //   SecondaryAccountRepository
        // ).find({
        //   where: { status: 1, organizationId: user.organizationId },
        // });
        accounts = await getCustomRepository(AccountRepository).query(
          (sql += `order by ${sort_column} ${sort_order}  ${page}`)
        );

        // let newAccountArr = [];
        // for (let i of accounts) {
        //   for (let j of secondaryAccounts) {
        //     if (i.secondaryAccountId === j.id) {
        //       let resp = {
        //         ...i,
        //         secondaryAccounts: j,
        //       };

        //       newAccountArr.push(resp);
        //     }
        //   }
        // }
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
        where: { name: In(['assets', 'equity', 'liability', 'income']) },
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
        where: { name: In(['assets', 'expense', 'liability', 'income']) },
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
          const add_one_day = moment(end_date).add(1, 'day').calendar();

          opening_balance = getCustomRepository(TransactionItemRepository)
            .query(`
              SELECT (select coalesce(sum(case when transaction_items."transactionType" = 10
                then transaction_items.amount else - transaction_items.amount end ), 0)
                from transaction_items where transaction_items."transactionId" in (
                    select id from transactions where date < '${start_date}'
                  )
                and transaction_items."accountId" = accounts.id
                and transaction_items.status = 1 ) as balance, (
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

  async FindAccountsByCode(codes): Promise<IAccount[]> {
    return await getCustomRepository(AccountRepository).find({
      where: {
        code: In(codes),
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
