import { Module } from '@nestjs/common';
import { XeroController } from './xero.controller';
import { XeroService } from './xero.service';
import { Authenticate } from '@invyce/auth-middleware';

@Module({
  imports: [],
  providers: [XeroService, Authenticate],
  controllers: [XeroController],
})
export class XeroModule {}
