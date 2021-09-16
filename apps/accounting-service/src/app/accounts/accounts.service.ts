import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  AccountRepository,
  PrimaryAccountRepository,
  SecondaryAccountRepository,
} from '../repositories';
import { getCustomRepository } from 'typeorm';
import { Sorting } from '@invyce/sorting';

@Injectable()
export class AccountsService {
  async ListAccounts(user, query) {
    try {
      const { purpose, page_size, page_no, sort, filters } = query;

      if (purpose === 'ALL') {
        return await getCustomRepository(AccountRepository).find({
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
        where ti."accountId" = a.id and ti."transactionType" = 2 
      ), 0) as total_credit,
      
      coalesce((
        select sum(ti.amount) from transaction_items ti
        where ti."accountId" = a.id and ti."transactionType" = 1
      ), 0) as total_debit,
      
      (
        CASE
        WHEN (pa.name = 'assets') OR ( pa.name='expense') THEN (
          coalesce((
            SELECT sum(ti.amount) from transaction_items AS ti
            left join transactions as t
            on ti."transactionId" = t.id
            WHERE ti."accountId" = a.id AND ti."transactionType" = 1 
            and t.status = 1
          ), 0) 
            -
    
          coalesce((
            SELECT sum(ti.amount) from transaction_items AS ti
            left join transactions as t
            on ti."transactionId" = t.id
            WHERE ti."accountId" = a.id AND ti."transactionType" = 2 
            and t.status = 1
          ), 0 )
        )
        ELSE 
           coalesce((
            SELECT sum(ti.amount) from transaction_items AS ti
            left join transactions as t
            on ti."transactionId" = t.id
            WHERE ti."accountId" = a.id AND ti."transactionType" = 2 
            and t.status = 1
          ), 0) -
    
          coalesce((
            SELECT sum(ti.amount) from transaction_items AS ti
            left join transactions as t
            on ti."transactionId" = t.id
            WHERE ti."accountId" = a.id AND ti."transactionType" = 1 
            and t.status = 1
          ), 0 )
        END
        ) as balance
    from accounts a
    left join secondary_accounts sa
    on sa.id = a."secondaryAccountId"
    left join primary_accounts pa
    on pa.id = sa."primaryAccountId"
    where a."organizationId" = '${user.organizationId}'
    `;

        if (filters) {
          const filterData: any = Buffer.from(filters, 'base64').toString();
          const data = JSON.parse(filterData);

          for (let i in data) {
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

        const { sort_column, sort_order } = await Sorting(sort);

        const page = `
        limit ${page_size || 20}
        offset ${page_no * page_size - page_size || 1}
      `;

        // const secondaryAccounts = await getCustomRepository(
        //   SecondaryAccountRepository
        // ).find({
        //   where: { status: 1, organizationId: user.organizationId },
        // });
        const accounts = await getCustomRepository(AccountRepository).query(
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

        const total = await getCustomRepository(AccountRepository).count({
          status: 1,
          organizationId: user.organizationId,
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
          accounts,
        };
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async SecondaryAccountName(user) {
    return await getCustomRepository(SecondaryAccountRepository).find({
      where: {
        status: 1,
        organizationId: user.organizationId,
      },
      relations: ['primaryAccount'],
    });
  }

  async initAccounts(user): Promise<any> {
    try {
      const { primary, secondary } = await import('../accounts');
      for (const account of primary) {
        const accountModel = {
          name: account.name,
          status: 1,
          code: account.code,
          organizationId: user.organizationId,
          createdById: user.id, // need to be change later
          updatedById: user.id, // need to be change later
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
            organizationId: user.organizationId,
            updatedById: user.id,
            createdById: user.id,
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
                organizationId: user.organizationId,
                createdById: user.id,
                updatedById: user.id,
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

  async CreateOrUpdateAccount(accountDto, accountData) {
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
            accountDto.parimaryAccountId || account.primaryAccountId;
          updatedAccount.status = account.status;
          // updatedAccount.branchId = account.branchId;
          updatedAccount.organizationId = account.organizationId;
          updatedAccount.createdById = account.createdById;
          updatedAccount.updatedById = accountData._id;

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

  async FindAccountById(accountId) {
    const account = await getCustomRepository(AccountRepository).find({
      where: { id: accountId, status: 1 },
      relations: ['secondaryAccount', 'secondaryAccount.primaryAccount'],
    });

    return account;
  }

  //   async DeleteAccount(accountDto) {
  //     try {
  //       for (let i of accountDto.ids) {
  //         await this.manager.update(Accounts, { id: i }, { status: 0 });
  //       }
  //       const accountRepository = getCustomRepository(AccountRepository);
  //       const [account] = await accountRepository.find({
  //         where: {
  //           id: accountDto.ids[0],
  //         },
  //       });

  //       return account;
  //     } catch (error) {
  //       throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  //     }
  //   }
}
