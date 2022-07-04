import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuickbooksModule } from './quickbooks/quickbooks.module';
import { XeroModule } from './xero/xero.module';

@Module({
  imports: [XeroModule, QuickbooksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
