import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { Authenticate } from '@invyce/auth-middleware';

@Module({
  imports: [],
  controllers: [AccountsController],
  providers: [AccountsService],
})
export class AccountsModule {
  configure(route) {
    route.apply(Authenticate).forRoutes(AccountsController);
  }
}
