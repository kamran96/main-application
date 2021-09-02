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
} from '@nestjs/common';
import { Request } from 'express';
import { ItemDto } from '../dto/item.dto';
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
        result: item,
      };
    }
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
