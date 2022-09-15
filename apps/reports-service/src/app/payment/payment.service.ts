import { Injectable } from '@nestjs/common';
import { aql } from 'arangojs';
import { PaymentModes } from '@invyce/global-constants';
import { DB } from '../arangodb/arango.service';
import { PaymentSchema } from '../schemas/payment.schema';
import { IPage, IRequest } from '@invyce/interfaces';

@Injectable()
export class PaymentService {
  async CreateContactLegder(data) {
    // await DB.collection('payments').drop();

    const paymentCollection = await (
      await DB.listCollections()
    ).map((i) => i.name);
    if (!paymentCollection.includes('payments')) {
      await DB.createCollection('payments', {
        schema: PaymentSchema,
      });
    }

    const paymentArray = [];
    for (const i of data) {
      const payment = {
        ...i,
        targetId: i.type === 1 ? i.invoiceId : i.billId,
        paymentId: i.id,
        amount: parseFloat(i.amount),
      };
      delete payment.id;
      delete payment.billId;
      delete payment.updatedById;
      if (i.type === 1) {
        delete payment.invoiceId;
      } else {
        delete payment.billId;
      }

      paymentArray.push(payment);
    }

    await DB.query(aql`
      FOR i IN ${paymentArray}
        INSERT i INTO payments
    `);
  }

  async ContactLedger(contactId: string, req: IRequest, query: IPage) {
    const { page_no, page_size, query: filters, type } = query;

    if (type == PaymentModes.INVOICES) {
      const invoices = await DB.query(aql`
        FOR i IN payments
          FILTER i.contactId == '632067fdea0d3477695c11c4'
        
          WINDOW { preceding: "unbounded", following: 0 }
          AGGREGATE balance = SUM(abs(i.amount))
        
        RETURN {
            data: i,
            balance
        }
      `);
      return invoices.all();
    } else if (type == PaymentModes.BILLS) {
      const bills = await DB.query(aql`
        FOR i IN payments
        FILTER i.contactId == '6320686bea0d3477695c11cc'
        SORT i.date desc
        WINDOW { preceding: "unbounded", following: 0 }
        AGGREGATE balance = SUM(abs(i.amount))
        
        RETURN {
            data: i,
            balance
        }
      `);

      return bills.all();
    }
  }
}
