import { Module } from '@nestjs/common';
import { TrasnactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

@Module({
  imports: [],
  providers: [TransactionService],
  controllers: [TrasnactionController],
})
export class TransactionModule {}
