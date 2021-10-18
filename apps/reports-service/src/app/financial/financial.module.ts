import { Module } from '@nestjs/common';
import { FiancialController } from './financial.controllert';
import { FinancialService } from './financial.service';
import { Authenticate } from '@invyce/auth-middleware';

@Module({
  imports: [],
  providers: [FinancialService, Authenticate],
  controllers: [FiancialController],
})
export class FinancialModule {}
