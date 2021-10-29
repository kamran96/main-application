import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
  Query,
  Put,
} from '@nestjs/common';
import { Request } from 'express';
import { DeleteItemDto, ItemDto } from '../dto/item.dto';
import { ItemService } from './item.service';
import { GlobalAuthGuard } from '@invyce/global-auth-guard';

@Controller('item')
export class ItemController {
  constructor(private itemService: ItemService) {}

  @Get()
  @UseGuards(GlobalAuthGuard)
  async index(@Req() req: Request, @Query() query) {
    const item = await this.itemService.ListItems(req.user, query);

    if (item) {
      return {
        message: 'Item created successfull',
        status: true,
        result: !item.pagination ? item : item.items,
        pagination: item.pagination,
      };
    }
  }

  @Post('ids')
  @UseGuards(GlobalAuthGuard)
  async listItemByIds(@Body() itemDto: DeleteItemDto) {
    return await this.itemService.findByItemIds(itemDto);
  }

  @Post()
  @UseGuards(GlobalAuthGuard)
  async create(@Body() itemDto: ItemDto, @Req() req: Request) {
    const item = await this.itemService.CreateItem(itemDto, req.user);

    if (item) {
      return {
        message: 'Item created successfull',
        status: true,
        result: item,
      };
    }
  }

  @Get('/:id')
  @UseGuards(GlobalAuthGuard)
  async show(@Param() params) {
    try {
      const item = await this.itemService.FindById(params.id);

      if (item) {
        return {
          message: 'Item created successfull',
          status: true,
          result: item,
        };
      }

      throw new HttpException('Item not found', HttpStatus.BAD_REQUEST);
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put()
  @UseGuards(GlobalAuthGuard)
  async delete(@Body() itemDeleteIds: DeleteItemDto) {
    const item = await this.itemService.DeleteItem(itemDeleteIds);

    if (item) {
      return {
        message: 'Item deleted succesfully',
        status: true,
      };
    }
  }

  @Post('sync')
  @UseGuards(GlobalAuthGuard)
  async SyncItems(@Body() body, @Req() req: Request) {
    return await this.itemService.SyncItems(body, req.user);
  }
}
