import { Injectable } from '@nestjs/common';
import { aql } from 'arangojs';
import { DB } from '../arangodb/arango.service';

@Injectable()
export class AccountService {
  async TrailBalance() {
    const result = await DB.query(aql`
    LET result = (
        FOR i IN transactions
            COLLECT account = i.account.name,
                id = i.account.id
            AGGREGATE balance = SUM(i.amount)
            RETURN {id, account: account, balance}
    )
    
    LET total_debits = (
        FOR i IN transactions
            FILTER i.transactionType == 10
            COLLECT tt = i.transactionType
            AGGREGATE balance = SUM(i.amount)
            RETURN balance
    )
    
    LET total_credits = (
        FOR i IN transactions
            FILTER i.transactionType == 20
            COLLECT tt = i.transactionType
            AGGREGATE balance = SUM(i.amount)
            RETURN balance
    )
    
    RETURN {
        result,
        total_debits,
        total_credits
    }
  `);

    return result.all();
  }

  async BalanceSheet() {
    const result = await DB.query(aql`
    LET result = (
        FOR i IN transactions
            FILTER i.account.primaryAccount.name IN [ "asset","equity","liability"]
            COLLECT account = i.account.name,
                id = i.account.id
            AGGREGATE balance = SUM(i.amount)
            RETURN {id, account: account, balance}
    )

    LET total_debits = (
        FOR i IN transactions
            FILTER i.transactionType == 10 && i.account.primaryAccount.name IN [ "asset","equity","liability"]
            COLLECT tt = i.transactionType
            AGGREGATE balance = SUM(i.amount)
            RETURN balance
    )

    LET total_credits = (
        FOR i IN transactions
            FILTER i.transactionType == 20 && i.account.primaryAccount.name IN [ "asset","equity","liability"]
            COLLECT tt = i.transactionType
            AGGREGATE balance = SUM(i.amount)
            RETURN balance
    )

    RETURN {
        result,
        total_debits,
        total_credits
    }
    `);

    return result.all();
  }

  async IncomeStatment() {
    const result = await DB.query(aql`
    LET result = (
        FOR i IN transactions
            FILTER i.account.primaryAccount.name IN ['income', 'expense']
            COLLECT account = i.account.name,
                id = i.account.id
            AGGREGATE balance = SUM(i.amount)
            RETURN {id, account: account, balance}
    )

    LET total_debits = (
        FOR i IN transactions
            FILTER i.transactionType == 10 && i.account.primaryAccount.name IN ['income', 'expense']
            COLLECT tt = i.transactionType
            AGGREGATE balance = SUM(i.amount)
            RETURN balance
    )

    LET total_credits = (
        FOR i IN transactions
            FILTER i.transactionType == 20 && i.account.primaryAccount.name IN ['income', 'expense']
            COLLECT tt = i.transactionType
            AGGREGATE balance = SUM(i.amount)
            RETURN balance
    )

    RETURN {
        result,
        total_debits,
        total_credits
    }
    `);

    return result.all();
  }
}
