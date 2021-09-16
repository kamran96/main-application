import { Module } from '@nestjs/common';
import { Authenticate } from '@invyce/auth-middleware';
import { BankController } from './bank.controller';
import { BankService } from './bank.service';

@Module({
  imports: [],
  providers: [BankService, Authenticate],
  controllers: [BankController],
})
export class BankModule {}
