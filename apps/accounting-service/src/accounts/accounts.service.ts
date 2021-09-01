import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AccountRepository, PrimaryAccountRepository, SecondaryAccountRepository } from '../../repositories';
import { EntityManager, getCustomRepository, UpdateResult } from 'typeorm';
import { Pagination } from './pagination.service';
// import { PrimaryAccounts } from 'apps/accounting-service/entities';
import { Accounts } from '../../entities';


@Injectable()
export class AccountsService {
  constructor(private entitymanager: EntityManager) {}
  async ListAccounts(accountData, take, page_no, sort, query, purpose) {
    try {
      const accountRepository = getCustomRepository(AccountRepository);
      const sql = `
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
    where a."organizationId" = 1
    `;

      if (purpose === 'all') {
        const result = await this.entitymanager.query(sql);
        return result;
      }

      // return await this.pagination.ListApi(
      //   accountRepository,
      //   take,
      //   page_no,
      //   sort,
      //   sql,
      // );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async SecondaryAccountName(organizationId) {
    const secondaryAccountRepository = getCustomRepository(
      SecondaryAccountRepository,
    );

    const account = await secondaryAccountRepository.find({
      where: {
        status: 1,
        organizationId: organizationId,
      },
      relations: ['primaryAccount'],
    });

    return account;
  }

  async initAccounts(organizationId, userId): Promise<any> {
    try {
      const accountRepository = getCustomRepository(AccountRepository);
      const primaryAccountRepository = getCustomRepository(
        PrimaryAccountRepository,
      );
      const secondaryAccountRepository = getCustomRepository(
        SecondaryAccountRepository,
      );
      const { primary, secondary } = await import('../accounts');
      for(const account of primary) {
        const accountModel = {
          name: account.name,
          status: 1,
          code: account.code,
          organizationId: organizationId,
          createdById: userId, // need to be change later
          updatedById: userId, // need to be change later
        };
        const primaryAccount = await primaryAccountRepository.save(
          accountModel,
        );
        const secondaryAccounts = secondary.filter(
          item => item.primary_account_id === account.oldId,
        );
        for (const secondaryAccount of secondaryAccounts) {
          const secondaryModel = {
            name: secondaryAccount.name,
            code: secondaryAccount.code,
            status: 1,
            primaryAccountId: primaryAccount.id,
            organizationId: organizationId,
            updatedById: userId,
            createdById: userId,
          };
          const insertSecondary = await secondaryAccountRepository.save(
            secondaryModel,
          );
          if(secondaryAccount.accounts.length > 0){
            for (const account of secondaryAccount.accounts) {
              const accountModel = {
                name: account.name,
                status: 1,
                code: account.code,
                isSystemAccount: account.isSystemAccount,
                secondaryAccountId: insertSecondary.id,
                primaryAccountId: primaryAccount.id,
                importedFrom : 'init',
                organizationId: organizationId,
                createdById: userId,
                updatedById: userId,
              };
              await accountRepository.save(accountModel);
            }
          }  
        }
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async CreateOrUpdateAccount(accountDto) {
    const accountRepository = getCustomRepository(AccountRepository);
    if (accountDto && accountDto.isNewRecord === false) {
      // we need to update account
      try {
        const result = await accountRepository.find({
          where: { id: accountDto.accountId, status: 1 },
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
          updatedAccount.branchId = account.branchId;
          updatedAccount.createdById = account.createdById;
          updatedAccount.updatedById =
            accountDto.userId || account.updatedById;

          await this.entitymanager.update(
            Accounts,
            { id: accountDto.accountId },
            updatedAccount,
          );

          const [updated] = await accountRepository.find({
            where: { id: accountDto.accountId, status: 1 },
          });

          return updated;
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
          branchId: accountDto.branchId,
          organizationId: accountDto.organizationId,
          status: 1,
          createdById: accountDto.userId,
          updatedById: accountDto.userId,
        });

        return account;
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }

  async FindAccountById(params, accountData) {
    const accountRepository = getCustomRepository(AccountRepository);
    const account = await accountRepository.find({
      where: { status: 1 },
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
