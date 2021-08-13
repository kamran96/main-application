import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager, getCustomRepository } from 'typeorm';
import { Accounts } from '../entities';
import { AccountRepository } from '../repositories/account.repository';
import { PrimaryAccountRepository } from '../repositories/primaryAccount.repository';
import { SecondaryAccountRepository } from '../repositories/secondaryAccount.repository';
import { Pagination } from '../Common/services/pagination.service';

@Injectable()
export class AccountService {
  constructor(private manager: EntityManager, private pagination: Pagination) {}

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
        where ti."accountId" = a.id and ti.type = 2 
      ), 0) as total_credists,
      
      coalesce((
        select sum(ti.amount) from transaction_items ti
        where ti."accountId" = a.id and ti.type = 1
      ), 0) as total_debits,
      
      (
        CASE
        WHEN (pa.name = 'assets') OR ( pa.name='expense') THEN (
          coalesce((
            SELECT sum(ti.amount) from transaction_items AS ti
            left join transactions as t
            on ti."transactionId" = t.id
            WHERE ti."accountId" = a.id AND ti.type = 1 
            and t.status = 1
          ), 0) 
            -
    
          coalesce((
            SELECT sum(ti.amount) from transaction_items AS ti
            left join transactions as t
            on ti."transactionId" = t.id
            WHERE ti."accountId" = a.id AND ti.type = 2 
            and t.status = 1
          ), 0 )
        )
        ELSE 
           coalesce((
            SELECT sum(ti.amount) from transaction_items AS ti
            left join transactions as t
            on ti."transactionId" = t.id
            WHERE ti."accountId" = a.id AND ti.type = 2 
            and t.status = 1
          ), 0) -
    
          coalesce((
            SELECT sum(ti.amount) from transaction_items AS ti
            left join transactions as t
            on ti."transactionId" = t.id
            WHERE ti."accountId" = a.id AND ti.type = 1 
            and t.status = 1
          ), 0 )
        END
        ) as balance
    from accounts a
    left join secondary_accounts sa
    on sa.id = a."secondaryAccountId"
    left join primary_accounts pa
    on pa.id = sa."primaryAccountId"
    `;

      if (purpose === 'all') {
        return this.manager.query(sql);
      }

      return await this.pagination.ListApi(
        accountRepository,
        take,
        page_no,
        sort,
        sql,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async SecondaryAccountName(accountData) {
    const secondaryAccountRepository = getCustomRepository(
      SecondaryAccountRepository,
    );

    const account = await secondaryAccountRepository.find({
      where: {
        status: 1,
        organizationId: accountData.organizationId,
      },
      relations: ['primaryAccount'],
    });

    return account;
  }

  async initAccounts(organization, user): Promise<any> {
    try {
      const accountRepository = getCustomRepository(AccountRepository);
      const primaryAccountRepository = getCustomRepository(
        PrimaryAccountRepository,
      );
      const secondaryAccountRepository = getCustomRepository(
        SecondaryAccountRepository,
      );

      const { primary, secondary } = await import('../accounts');
      for (let account of primary) {
        const accountModel = {
          name: account.name,
          status: 1,
          code: account.code,
          organizationId: organization.id,
          createdById: user.userId,
          updatedById: user.userId,
        };

        const primaryAccount = await primaryAccountRepository.save(
          accountModel,
        );
        const secondaryAccounts = secondary.filter(
          item => item.primary_account_id === account.oldId,
        );
        for (let secondaryAccount of secondaryAccounts) {
          const secondaryModel = {
            name: secondaryAccount.name,
            code: secondaryAccount.code,
            status: 1,
            primaryAccountId: primaryAccount.id,
            organizationId: organization.id,
            updatedById: user.userId,
            createdById: user.userId,
          };
          const insertSecondary = await secondaryAccountRepository.save(
            secondaryModel,
          );

          for (let account of secondaryAccount.accounts) {
            const accountModel = {
              name: account.name,
              status: 1,
              code: account.code,
              isSystemAccount: account.isSystemAccount,
              secondaryAccountId: insertSecondary.id,
              organizationId: organization.id,
              createdById: user.userId,
              updatedById: user.userId,
            };
            await accountRepository.save(accountModel);
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
          updatedAccount.status = account.status;
          updatedAccount.branchId = account.branchId;
          updatedAccount.createdById = account.createdById;
          updatedAccount.updatedById =
            accountData.userId || account.updatedById;

          await this.manager.update(
            Accounts,
            { id: accountDto.id },
            updatedAccount,
          );

          const [updated] = await accountRepository.find({
            where: { id: accountDto.id, status: 1 },
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
          taxRate: accountDto.taxRate,
          branchId: accountData.branchId,
          organizationId: accountData.organizationId,
          status: 1,
          createdById: accountData.userId,
          updatedById: accountData.userId,
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

  async DeleteAccount(accountDto) {
    try {
      for (let i of accountDto.ids) {
        await this.manager.update(Accounts, { id: i }, { status: 0 });
      }
      const accountRepository = getCustomRepository(AccountRepository);
      const [account] = await accountRepository.find({
        where: {
          id: accountDto.ids[0],
        },
      });

      return account;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
