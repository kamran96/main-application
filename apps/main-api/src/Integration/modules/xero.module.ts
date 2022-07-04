import { Module } from '@nestjs/common';
import { XeroController } from '../controllers/xero.controller';
import { XeroService } from '../services/xero.service';

@Module({
  providers: [XeroService],
  controllers: [XeroController],
})
export class XeroModule {}
