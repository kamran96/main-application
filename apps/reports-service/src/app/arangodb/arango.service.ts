import { Injectable } from '@nestjs/common';
import { Database, aql } from 'arangojs';
import { InvoiceSchema } from '../schemas/invoice.schema';

const db = new Database({
  url: 'http://127.0.0.1:8529',
  auth: { username: 'root', password: 'asdf' },
});

@Injectable()
export class ArrangoDBService {
  async CreateInvoice(data) {
    // await db.collection('invoices').drop();

    const invoiceCollection = await (
      await db.listCollections()
    ).map((i) => i.name);
    if (!invoiceCollection.includes('invoices')) {
      await db.createCollection('invoices', {
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

    await db.query(aql`
      FOR d IN ${invoiceArray}
        INSERT d INTO invoices
    `);
  }

  async CreatePaymentForInvoice(data) {
    // update payment for invoice

    for (const d of data) {
      await db.query(aql`
        FOR i IN invoices
          FILTER i.invoiceId == ${d.invoiceId}
          UPDATE i WITH { payment: ${d} } IN invoices
      `);
    }
  }

  async CreateTransactionForInvoice(data) {
    // update transaction for invoice

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

    await db.query(aql`
        FOR i IN invoices
          FILTER i.invoiceId == ${data.invoiceId}
          UPDATE i WITH { transactions: ${transactionArray} } IN invoices
      `);
  }
}
