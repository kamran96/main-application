import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TRANSACTION_CREATED } from '@invyce/send-email';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TrasnactionController {
  constructor(private transactionService: TransactionService) {}

  @MessagePattern(TRANSACTION_CREATED)
  async CreateTransactionForBill(@Payload() data) {
    Logger.log('Data is received.');
    Logger.log(data);
    return await this.transactionService.CreateTransaction(data);
  }
}
