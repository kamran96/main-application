import { Module } from '@nestjs/common';
import { Authenticate } from '@invyce/auth-middleware';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

@Module({
  imports: [],
  controllers: [TransactionController],
  providers: [TransactionService, Authenticate],
})
export class TransactionModule {}
