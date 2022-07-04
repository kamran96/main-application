import { Module } from '@nestjs/common';
import { Authenticate } from '@invyce/auth-middleware';
import { QuotationController } from './quotation.controller';
import { QuotationService } from './quotation.service';

@Module({
  imports: [],
  controllers: [QuotationController],
  providers: [QuotationService],
})
export class QuotationModule {
  configure(route) {
    route.apply(Authenticate).forRoutes(QuotationController);
  }
}
