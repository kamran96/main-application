import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { ItemDto, ItemIdsDto } from '../../dto/item.dto';
import { JwtAuthGuard } from '../../jwt-auth.guard';
import { ItemService } from '../services/item.service';

@Controller('item')
export class ItemController {
  constructor(private itemService: ItemService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async index(@Req() req: Request, @Query() { take, page_no, sort, query }) {
    try {
      const item = await this.itemService.ListItem(
        req.user,
        take,
        page_no,
        sort,
        query
      );

      if (item) {
        return {
          message: 'Item fetched successfully.',
          result: item.item,
          pagination: item.pagination,
        };
      }
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() itemDto: ItemDto, @Req() req: Request) {
    try {
      const item = await this.itemService.createOrUpdateItem(itemDto, req.user);

      if (item) {
        return {
          message:
            itemDto.isNewRecord === false
              ? 'Item updated successfully'
              : 'Item created successfully.',
          result: item,
        };
      }
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @HttpCode(200)
  @Get(':id')
  async view(@Param() params) {
    try {
      const item = await this.itemService.FindItemById(params);

      if (item) {
        return {
          message: 'Item fetched successfully.',
          result: item[0],
        };
      }

      throw new HttpException('Failed to get Item', HttpStatus.BAD_REQUEST);
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put()
  async remove(@Body() itemIdsDto: ItemIdsDto) {
    try {
      const item = await this.itemService.DeleteItem(itemIdsDto);

      if (item) {
        return {
          message: 'Resource modified successfully.',
          status: 1,
        };
      }

      throw new HttpException('Failed to get Item', HttpStatus.BAD_REQUEST);
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
