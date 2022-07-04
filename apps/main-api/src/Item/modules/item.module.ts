import { Module } from '@nestjs/common';
import { ItemController } from '../controllers/item.controller';
import { ItemService } from '../services/item.service';
import { PaginationModule } from '../../Common/modules/pagination.module';

@Module({
  imports: [PaginationModule],
  providers: [ItemService],
  controllers: [ItemController],
})
export class ItemModule {}
