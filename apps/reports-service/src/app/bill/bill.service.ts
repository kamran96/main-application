import { Injectable } from '@nestjs/common';
import { aql } from 'arangojs';
import * as dayjs from 'dayjs';
import { Arango } from '../arangodb/arango.service';
import { BillSchema } from '../schemas/bill.schema';

@Injectable()
export class BillService {
  async CreateBill(data) {
    // await DB.collection('bills').drop();
    const DB = await Arango();

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
    const DB = await Arango();

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
    const DB = await Arango();

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

  async AgedPayables(user) {
    const DB = await Arango();
    const today = dayjs().format('YYYY-MM-DD');
    const oneMonth = dayjs(today).subtract(1, 'month').format('YYYY-MM-DD');
    const twoMonth = dayjs(oneMonth).subtract(1, 'month').format('YYYY-MM-DD');
    const threemonth = dayjs(twoMonth)
      .subtract(1, 'month')
      .format('YYYY-MM-DD');
    const fourmonth = dayjs(threemonth)
      .subtract(1, 'month')
      .format('YYYY-MM-DD');

    const current = await DB.query({
      query: `
        LET current = (
          FOR i IN bills
              FILTER i.dueDate >= '${today}'
              and i.organizationId == @organizationId
              COLLECT contact = i.contact.name,
                  invoice = i.invoiceNumber,
                  dueDate = i.dueDate
              AGGREGATE balance = SUM(i.total)
          RETURN {
              contact,
              dueDate,
              invoice,
              balance
          }
      )
      
      LET onemonth = (
          FOR i IN bills
              FILTER i.dueDate <= '${today}' and i.dueDate >= '${oneMonth}'
              and i.organizationId == @organizationId
              COLLECT contact = i.contact.name,
                  invoice = i.invoiceNumber,
                  dueDate = i.dueDate
              AGGREGATE balance = SUM(i.total)
          RETURN {
              contact,
              dueDate,
              invoice,
              balance
          }
      )
      
      LET twomonth = (
          FOR i IN bills
              FILTER i.dueDate <= '${oneMonth}' and i.dueDate >= '${twoMonth}'
              and i.organizationId == @organizationId
              COLLECT contact = i.contact.name,
                  invoice = i.invoiceNumber,
                  dueDate = i.dueDate
              AGGREGATE balance = SUM(i.total)
          RETURN {
              contact,
              dueDate,
              invoice,
              balance
          }
      )

      LET threemonth = (
        FOR i IN bills
            FILTER i.dueDate <= '${twoMonth}' and i.dueDate >= '${threemonth}'
            and i.organizationId == @organizationId
            COLLECT contact = i.contact.name,
                invoice = i.invoiceNumber,
                dueDate = i.dueDate
            AGGREGATE balance = SUM(i.total)
        RETURN {
            contact,
            dueDate,
            invoice,
            balance
        }
    )

    LET fourmonth = (
      FOR i IN bills
          FILTER i.dueDate <= '${threemonth}' and i.dueDate >= '${fourmonth}'
          and i.organizationId == @organizationId
          COLLECT contact = i.contact.name,
              invoice = i.invoiceNumber,
              dueDate = i.dueDate
          AGGREGATE balance = SUM(i.total)
      RETURN {
          contact,
          dueDate,
          invoice,
          balance
      }
    )

    LET older = (
      FOR i IN bills
          FILTER i.dueDate <= '${fourmonth}'
          and i.organizationId == @organizationId
          COLLECT contact = i.contact.name,
              invoice = i.invoiceNumber,
              dueDate = i.dueDate
          AGGREGATE balance = SUM(i.total)
      RETURN {
          contact,
          dueDate,
          invoice,
          balance
      }
    )
      
    RETURN {
      Current: current,
      "< 1 Month": onemonth,
      "1 Month": twomonth,
      "2 Month": threemonth,
      "3 Month": fourmonth,
      Older: older
    }
    `,
      bindVars: { organizationId: user.organizationId },
    });

    return await current.all();
  }
}
