import { Injectable } from '@nestjs/common';
import { ArrangoDBService } from '../arangodb/arango.service';

@Injectable()
export class InvoiceService {
  constructor(private arrangoService: ArrangoDBService) {}

  async CreateInvoice(data) {
    return await this.arrangoService.CreateInvoice(data);
  }

  async CreatePaymentForInvoice(data) {
    return await this.arrangoService.CreatePaymentForInvoice(data);
  }

  async CreateTransactionForInvoice(data) {
    return await this.arrangoService.CreateTransactionForInvoice(data);
  }
}
