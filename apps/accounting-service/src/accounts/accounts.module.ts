import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { Authenticate } from '@invyce/auth-middleware'

@Module({
  controllers: [AccountsController],
  providers: [AccountsService, Authenticate],
})
export class AccountsModule {}
