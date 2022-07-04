import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

@Module({
  imports: [],
  providers: [TransactionService],
  controllers: [TransactionController],
})
export class TransactionModule {}
