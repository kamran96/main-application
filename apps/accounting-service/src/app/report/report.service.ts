import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import * as Moment from 'moment';

@Injectable()
export class ReportService {
  constructor(private manager: EntityManager) {}

  async BalanceQuery(user, value = null, type = null) {
    const formate_today_date = Moment(new Date())
      .add(1, 'day')
      .format('YYYY-MM-DD');

    let today_date = null;
    if (value !== null) {
      today_date = Array.isArray(value) && value.length > 0 ? value[0] : value;
    }

    function add_a_day(value) {
      return Moment(value).add(1, 'day').format('YYYY-MM-DD');
    }
    const add_one_day =
      type !== null
        ? Moment(value[1]).add(1, 'day').format('YYYY-MM-DD')
        : null;

    let total_debits = `
      SELECT COALESCE((SUM(transaction_items.amount)), 0)
      FROM "transaction_items" INNER JOIN "transactions" ON "transactions"."id" = "transaction_items"."transactionId"
      WHERE transaction_items."accountId" = accounts.id
      and transaction_items."transactionType" = 10
      and transactions."organizationId" = '${user.organizationId}'
      and transactions."branchId" = '${user.branchId}'
      and transactions.status = 1
      `;

    let total_credits = `
      SELECT COALESCE((SUM(transaction_items.amount)), 0)
      FROM "transaction_items" INNER JOIN "transactions" ON "transactions"."id" = "transaction_items"."transactionId"
       WHERE transaction_items."accountId" = accounts.id
       and transaction_items."transactionType" = 20
       and transactions."organizationId" = '${user.organizationId}'
       and transactions."branchId" = '${user.branchId}'
       and transactions.status = 1
      `;

    if ((value == null || value == []) && type == null) {
      const t_debits = `
        ${total_debits}
        and transactions.date < '${formate_today_date}'
        `;
      const t_credits = `
        ${total_credits}
        and transactions.date < '${formate_today_date}'
     `;

      const balance_query = `case when primary_accounts.name='asset' OR primary_accounts.name='expense'
     then ( (${t_debits})-(${t_credits}))
     else (( ${t_credits})-(${t_debits})) end`;

      return `
     select accounts.*, secondary_accounts.name as secondary_name, primary_accounts.name as primary_name,  (${t_debits}) as total_debits, (${t_credits}) as total_credits,
     (${balance_query}) as balance
    from accounts
    inner join secondary_accounts
    on secondary_accounts.id = accounts."secondaryAccountId"
    inner join primary_accounts
    on primary_accounts.id = secondary_accounts."primaryAccountId"
    where accounts."organizationId" = '${user.organizationId}'
    `;
    } else {
      if (type === 'in') {
        total_debits = `${total_debits}
        and transactions.date < '${add_a_day(value)}'
        `;
        total_credits = `${total_credits}
        and transactions.date < '${add_a_day(value)}'
        `;

        const balance_query = `case when primary_accounts.name='asset' OR primary_accounts.name='expense'
          then ( (${total_debits})-(${total_credits}))
          else (( ${total_credits})-(${total_debits})) end`;

        return `
          select accounts.*, secondary_accounts.name as secondary_name, primary_accounts.name as primary_name, (${total_debits}) as total_debits,
          (${total_credits}) as total_credits, (${balance_query}) as balance
          FROM accounts
          inner join secondary_accounts
          on secondary_accounts.id = accounts."secondaryAccountId"
          inner join primary_accountsß
          on primary_accounts.id = secondary_accounts."primaryAccountId"
          `;
      } else if (type == 'between') {
        const _debits = `${total_debits}
        and transactions.date < '${today_date}'
        `;
        const _credits = `${total_credits}
        and transactions.date < '${today_date}'
        `;

        const debits = `${total_debits}
     and transactions.date >= '${today_date}' and transactions.date <= '${add_one_day}'
      `;
        const credits = `${total_credits}
     and transactions.date >= '${today_date}' and transactions.date <= '${add_one_day}'
      `;

        const opening_balance = `case when primary_accounts.name='asset' OR primary_accounts.name='expense'
      then ( (${_debits})-(${_credits}))
      else (( ${_credits})-(${_debits})) end`;

        const _balance = `case when primary_accounts.name='asset' OR primary_accounts.name='expense'
      then ( (${debits})-(${credits}))
      else (( ${credits})-(${debits})) end`;

        return `
        select accounts.*, secondary_accounts.name as secondary_name, primary_accounts.name as primary_name, 
        (${debits}) as total_debits, (${credits}) as total_credits,
        (${_balance}) as net_change, (${opening_balance}) as opening_balance, 
        (${_debits}) as opening_debits, (${_credits}) as opening_credits,
        (${opening_balance}) + (${_balance}) as balance,
         (${_debits}) + (${debits}) as closing_debits,
         (${_credits}) + (${credits}) as closing_credits

        FROM accounts
        inner join secondary_accounts
        on secondary_accounts.id = accounts."secondaryAccountId"
        inner join primary_accounts
        on primary_accounts.id = secondary_accounts."primaryAccountId"
        where accounts."organizationId" = '${user.organizationId}'
        `;
      }
    }
  }

  async BalanceSheet(user, query = null) {
    let main_query;

    if (query !== null) {
      const filter_data = Buffer.from(query, 'base64').toString();
      const data = JSON.parse(filter_data);

      for (const i in data) {
        if (data[i].type == 'date-between') {
          main_query = await this.BalanceQuery(user, data[i].value, 'between');
        } else if (data[i].type == 'date-in') {
          main_query = await this.BalanceQuery(user, data[i].value, 'in');
        }
      }
    } else {
      main_query = await this.BalanceQuery(user);
    }

    const account = await this.manager.query(main_query);

    const newResult = ['asset', 'equity', 'liability']
      .map((item) => {
        const filtered = account.filter((acc) => {
          return acc.primary_name === item && acc?.balance !== 0;
        });
        if (filtered.length > 0) {
          const { balance } = filtered.reduce((a, b) => {
            return { balance: a.balance + b.balance };
          });
          return {
            name: item,
            type: item === 'asset' ? 1 : 2,
            balance,
            accounts: filtered,
          };
        } else {
          return null;
        }
      })
      .filter((item) => item !== null);
    return newResult;
  }

  async TrailBalance(user, query = null) {
    try {
      let main_query;

      if (query !== null) {
        const filter_data = Buffer.from(query, 'base64').toString();
        const data = JSON.parse(filter_data);

        for (const i in data) {
          if (data[i].type == 'date-between') {
            main_query = await this.BalanceQuery(
              user,
              data[i].value,
              'between'
            );
          } else if (data[i].type == 'date-in') {
            main_query = await this.BalanceQuery(user, data[i].value, 'in');
          }
        }
      } else {
        main_query = await this.BalanceQuery(user);
      }

      const account = await this.manager.query(main_query);
      const newResult = account
        .filter(
          (item) =>
            (item.opening_balance && item.opening_balance !== 0) ||
            item.balance !== 0
        )
        .map((acc) => {
          if (['asset', 'expense'].includes(acc?.primary_name)) {
            return { ...acc, debit: acc.balance, credit: 0 };
          } else if (!['asset', 'expense'].includes(acc?.primary_name)) {
            return { ...acc, debit: 0, credit: acc.balance };
          }
        });

      const totalCredits = (newResult?.length &&
        newResult?.reduce((a, b) => {
          return { credit: a.credit + b.credit };
        })) || { credit: 0 };

      const totalDebits = (newResult?.length &&
        newResult?.reduce((a, b) => {
          return { debit: a.debit + b.debit };
        })) || { debit: 0 };

      newResult.push({
        credit: Math.abs(totalCredits?.credit),
        debit: Math.abs(totalDebits?.debit),
        name: 'Total',
        isLastIndex: true,
      });

      return newResult;
    } catch (error) {
      console.log(error);
    }
  }

  async IncomeStatement(user, query = null) {
    let main_query;

    if (query !== null) {
      const filter_data = Buffer.from(query, 'base64').toString();
      const data = JSON.parse(filter_data);

      for (const i in data) {
        if (data[i].type == 'date-between') {
          main_query = await this.BalanceQuery(user, data[i].value, 'between');
        } else if (data[i].type == 'date-in') {
          main_query = await this.BalanceQuery(user, data[i].value, 'in');
        }
      }
    } else {
      main_query = await this.BalanceQuery(user);
    }

    const account = await this.manager.query(main_query);
    const newResult = ['income', 'expense']
      .map((item) => {
        const filtered = account.filter((acc) => {
          return acc.primary_name === item && acc?.balance !== 0;
        });
        if (filtered.length > 0) {
          const calc = filtered.reduce((a, b) => {
            return { balance: a.balance + b.balance };
          });
          return {
            name: item,
            type: item === 'income' ? 1 : 2,
            balance: calc.balance,
            accounts: filtered,
          };
        } else {
          return null;
        }
      })
      .filter((item) => item !== null);
    return newResult;
  }
}
