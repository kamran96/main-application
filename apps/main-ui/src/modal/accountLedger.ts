import { IBase, IBaseRequest, IBaseRequestResponse } from './base';
import { TransactionsType } from './transaction';
export interface IAccountOwner extends IBase {
  amount?: number;
  ref?: string;
  narration?: string;
  date?: string;
  notes?: string;
}

interface IAccountDetail extends IBase {
  name: string;
  description: string;
  code: string;
  secondaryAccountId: number;
  taxRate: number;
  isSystemAccount: boolean;
}

export interface IAccountLedger {
  id?: number;
  amount?: number;
  accountId?: number;
  transactionId?: number;
  transactionType?: number;
  description?: string;
  owner?: IAccountOwner;
  account?: IAccountDetail | any;
  balance?: number;
  date?: string;
}

export interface IAccountLederResponse extends IBaseRequest {
  result?: IAccountLedger[];
  opening_balance?: {
    amount?: number;
    date?: string;
    comment?: string;
  };
}

export class IAccountLedgerResult extends IBaseRequestResponse {
  result?: IAccountLedger[];
  opening_balance?: {
    amount?: number;
    date?: string;
    comment?: string;
  };

  getMergetData() {
    const result = this.result;
    if (this?.opening_balance?.amount) {
      result.splice(0, 0, {
        amount: Math.abs(this.opening_balance.amount),
        owner: {
          narration: this.opening_balance.comment,
        },
        account: {
          name: 'Opening Balance',
        },
        date: this.opening_balance.date,
        transactionType: this.opening_balance.amount < 0 ? 10 : 20,
      });
    }

    return result;
  }

  getResult() {
    const resolvedData = [];

    this?.getMergetData().map((acc, index) => {
      if (index === 0) {
        resolvedData.push({
          ...acc,
          balance: acc.transactionType === 10 ? -acc.amount : acc.amount,
        });
      } else {
        resolvedData.push({
          ...acc,
          balance:
            acc.transactionType === 10
              ? resolvedData[index - 1].balance - acc.amount
              : acc.transactionType === 20
              ? resolvedData[index - 1].balance + acc.amount
              : 0,
        });
      }
    });

    if (resolvedData.length) {
      const allDebits = resolvedData.filter(
        (i, ind) => i.transactionType === TransactionsType.CREDIT
      );
      const allCredits = resolvedData.filter(
        (i, ind) => i.transactionType === TransactionsType.DEBIT
      );

      resolvedData.push({
        lastIndex: true,
        totalDebits:
          allDebits?.length &&
          allDebits?.reduce((a, b) => ({ amount: a.amount + b.amount })).amount,
        totalCredits:
          allCredits?.length &&
          allCredits?.reduce((a, b) => ({ amount: a.amount + b.amount }))
            .amount,
        balance: resolvedData[resolvedData.length - 1].balance,
      });
    }

    return resolvedData;
  }
}
