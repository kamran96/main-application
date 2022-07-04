import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { GlobalAuthGuard } from '@invyce/global-auth-guard';
import { IRequest } from '@invyce/interfaces';
import { InventoryService } from './inventory.service';
import { ItemLedgerDetailDto } from '../dto/ItemLedger.dto';

@Controller('inventory')
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  @Post('manage')
  @UseGuards(GlobalAuthGuard)
  async manageInventory(
    @Body() data: ItemLedgerDetailDto,
    @Req() req: IRequest
  ) {
    return await this.inventoryService.ManageInventory(data, req);
  }
}
