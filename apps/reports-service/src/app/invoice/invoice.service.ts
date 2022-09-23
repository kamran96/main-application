import { Injectable } from '@nestjs/common';
import { aql } from 'arangojs';
import * as dayjs from 'dayjs';
import { Arango } from '../arangodb/arango.service';
import { InvoiceSchema } from '../schemas/invoice.schema';

@Injectable()
export class InvoiceService {
  async CreateInvoice(data) {
    // await db.collection('invoices').drop();
    const DB = await Arango();

    const invoiceCollection = await (
      await DB.listCollections()
    ).map((i) => i.name);
    if (!invoiceCollection.includes('invoices')) {
      await DB.createCollection('invoices', {
        schema: InvoiceSchema,
      });
    }

    const invoice = { ...data.invoice, invoiceId: data.invoice.id };
    delete invoice.id;
    delete invoice.discount;
    delete invoice.grossTotal;
    delete invoice.netTotal;
    delete invoice.invoiceType;
    delete invoice.updatedById;
    delete invoice.status;
    delete invoice.date;
    delete invoice.isTaxIncluded;
    const invoiceArray = [];
    for (const i of data.invoiceItems) {
      const item = {
        ...i,
      };
      delete item.invoiceId;
      delete item.sequence;
      delete item.status;
      delete item.id;
      const invoiceData = {
        ...invoice,
        ...item,
        organizationName: data.organizationName,
        item: data.items.find((j) => j.id === i.itemId),
        contact: data.contact,
        user: data.user,
        payment: {},
        transactions: [],
      };
      invoiceArray.push(invoiceData);
    }

    await DB.query(aql`
      FOR d IN ${invoiceArray}
        INSERT d INTO invoices
    `);
  }

  async CreatePaymentForInvoice(data) {
    // update payment for invoice
    const DB = await Arango();

    for (const d of data) {
      await DB.query(aql`
        FOR i IN invoices
          FILTER i.invoiceId == ${d.invoiceId}
          UPDATE i WITH { payment: ${d} } IN invoices
      `);
    }
  }

  async CreateTransactionForInvoice(data) {
    // update transaction for invoice
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
        FOR i IN invoices
          FILTER i.invoiceId == ${data.invoiceId}
          UPDATE i WITH { transactions: ${transactionArray} } IN invoices
      `);
  }

  async AgedReceivables(user) {
    const DB = await Arango();

    const addOneDay = dayjs().add(1, 'day').format('YYYY-MM-DD');
    const oneMonth = dayjs(addOneDay).add(1, 'month').format('YYYY-MM-DD');
    const oneMonthToTwoMonths = dayjs(oneMonth)
      .add(1, 'month')
      .format('YYYY-MM-DD');
    const twoMonthToThreeMonths = dayjs(oneMonthToTwoMonths)
      .add(1, 'month')
      .format('YYYY-MM-DD');

    const current = await DB.query({
      query: `
      FOR i IN invoices
        FILTER i.organizationId == @organizationId
        COLLECT contact = i.contact.name,
              invoice = i.invoiceNumber,
              dueDate = i.dueDate
          AGGREGATE balance = SUM(i.total)
          RETURN {
              "current": dueDate <= '${addOneDay}' ? {
              contact,
              invoice,
              dueDate: DATE_FORMAT(dueDate, '%dd-%mmm-%yy'),
              balance
              } : {},
              "oneMonth": dueDate >= '${addOneDay}' and dueDate <= '${oneMonth}' ? {
              contact,
              invoice,
              dueDate: DATE_FORMAT(dueDate, '%dd-%mmm-%yy'),
              balance
              } : {},
              "twoMonths": dueDate >= '${oneMonth}' and dueDate <= '${oneMonthToTwoMonths}' ? {
                contact,
              invoice,
              dueDate: DATE_FORMAT(dueDate, '%dd-%mmm-%yy'),
              balance
              } : {},
              "threeMonths": dueDate >= '${oneMonthToTwoMonths}' and dueDate <= '${twoMonthToThreeMonths}' ? {
                contact,
              invoice,
              dueDate: DATE_FORMAT(dueDate, '%dd-%mmm-%yy'),
              balance
              } : {},
              "overThreeMonths": dueDate >= '${twoMonthToThreeMonths}' ? {
                contact,
              invoice,
              dueDate: DATE_FORMAT(dueDate, '%dd-%mmm-%yy'),
              balance
              } : {}
          }
      `,
      bindVars: { organizationId: user.organizationId },
    });

    return await current.all();
  }
}
