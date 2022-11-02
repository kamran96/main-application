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
        FOR i IN invoices
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
        FOR i IN invoices
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
        FOR i IN invoices
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
      FOR i IN invoices
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
    FOR i IN invoices
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
    FOR i IN invoices
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
