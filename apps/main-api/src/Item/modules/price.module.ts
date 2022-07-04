import { Module } from '@nestjs/common';
import { PriceController } from '../controllers/price.controller';
import { PriceService } from '../services/price.service';

@Module({
  imports: [],
  providers: [PriceService],
  controllers: [PriceController],
})
export class PriceModule {}
