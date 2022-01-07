import { Module } from '@nestjs/common';
import { Authenticate } from '@invyce/auth-middleware';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';

@Module({
  imports: [],
  controllers: [InventoryController],
  providers: [InventoryService, Authenticate],
})
export class InventoryModule {}
