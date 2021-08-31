import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { ItemDto } from '../dto/item.dto';
import { ItemService } from './item.service';
import { GlobalAuthGuard } from '@invyce/global-auth-guard';

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
  @UseGuards(GlobalAuthGuard)
  async show(@Param() params, @Req() req: Request) {
    try {
      const item = await this.itemService.FindById(params.id);

      if (item) {
        return {
          message: 'Item created successfull',
          status: true,
          result: item[0] || [],
        };
      }
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
