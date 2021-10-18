import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FinancialModule } from './financial/financial.module';

@Module({
  imports: [FinancialModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
