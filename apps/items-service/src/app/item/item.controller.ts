import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ItemDto } from '../dto/item.dto';
import { ItemService } from './item.service';

@Controller('item')
export class ItemController {
  constructor(private itemService: ItemService) {}

  @Post()
  async create(@Body() itemDto: ItemDto) {
    const item = await this.itemService.CreateItem(itemDto);

    if (item) {
      return {
        message: 'Item created successfull',
        status: true,
        result: item,
      };
    }
  }

  @Get('/:id')
  async show(@Param() params) {
    const item = await this.itemService.FindById(params.id);

    if (item) {
      return {
        message: 'Item created successfull',
        status: true,
        result: item[0] || [],
      };
    }
  }
}
