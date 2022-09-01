import { Injectable } from '@nestjs/common';
import { aql } from 'arangojs';
import { DB } from '../arangodb/arango.service';
import { BillSchema } from '../schemas/bill.schema';

@Injectable()
export class BillService {
  async CreateBill(data) {
    // await DB.collection('bills').drop();

    const billCollection = await (
      await DB.listCollections()
    ).map((i) => i.name);
    if (!billCollection.includes('bills')) {
      await DB.createCollection('bills', {
        schema: BillSchema,
      });
    }

    const bill = { ...data.bill, billId: data.bill.id };
    delete bill.id;
    delete bill.discount;
    delete bill.grossTotal;
    delete bill.netTotal;
    delete bill.invoiceType;
    delete bill.updatedById;
    delete bill.status;
    delete bill.date;
    delete bill.isTaxIncluded;
    const billArray = [];
    for (const i of data.billItems) {
      const item = {
        ...i,
      };
      delete item.billId;
      delete item.sequence;
      delete item.status;
      delete item.id;
      const billData = {
        ...bill,
        ...item,
        organizationName: data.organizationName,
        item: data.items.find((j) => j.id === i.itemId),
        contact: data.contact,
        user: data.user,
        payment: {},
        transactions: [],
      };
      billArray.push(billData);
    }

    console.log(billArray, 'bills');

    await DB.query(aql`
      FOR d IN ${billArray}
        INSERT d INTO bills
    `);
  }

  async CreatePaymentForBill(data) {
    // update payment for bill

    for (const d of data) {
      await DB.query(aql`
            FOR i IN bills
              FILTER i.billId == ${d.billId}
              UPDATE i WITH { payment: ${d} } IN bills
          `);
    }
  }

  async CreateTransactionForBill(data) {
    // update transaction for bill

    const transactionArray = [];

    for (const i of data.transactions.transactionItems) {
      const item = {
        tansactionId: data.transactions.id,
        narration: data.transactions.narration,
        reference: data.transactions.ref,
        date: data.transactions.date,
        organizationId: data.transactions.organizationId,
        branchId: data.transactions.branchId,
        status: data.transactions.status,
        transactionMode: data.transactions.transactionMode,
        ...i,
        accountId: i.account.id,
        accountName: i.account.name,
        accountCode: i.account.code,
        transactionItemId: i.id,
      };

      delete item.account;
      delete item.id;

      transactionArray.push(item);
    }

    await DB.query(aql`
            FOR i IN bills
              FILTER i.billId == ${data.billId}
              UPDATE i WITH { transactions: ${transactionArray} } IN bills
          `);
  }
}
