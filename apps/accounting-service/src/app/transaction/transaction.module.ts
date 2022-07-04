import { Module } from '@nestjs/common';
import { Authenticate } from '@invyce/auth-middleware';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

@Module({
  imports: [],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {
  configure(route) {
    route.apply(Authenticate).forRoutes(TransactionController);
  }
}
