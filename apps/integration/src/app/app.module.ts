import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { XeroModule } from './xero/xero.module';

@Module({
  imports: [XeroModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
