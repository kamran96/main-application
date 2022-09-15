import { Injectable } from '@nestjs/common';
import { aql } from 'arangojs';
import { DB } from '../arangodb/arango.service';
import { TransactionSchema } from '../schemas/transaction.schema';

@Injectable()
export class TransactionService {
  async CreateTransaction(data) {
    // await DB.collection('transactions').drop();
    const transactionCollection = await (
      await DB.listCollections()
    ).map((i) => i.name);
    if (!transactionCollection.includes('transactions')) {
      await DB.createCollection('transactions', {
        schema: TransactionSchema,
      });
    }

    const transactionsArray = [];
    for (const i of data.transactionItems) {
      const transactionData = {
        ...i,
      };
      delete transactionData.id;
      transactionsArray.push({
        ...transactionData,
        transaction: data.transaction,
        account: data.accounts.find((acc) => acc.id === i.accountId),
      });
    }

    await DB.query(aql`
    FOR d IN ${transactionsArray}
      INSERT d INTO transactions
  `);
  }
}
