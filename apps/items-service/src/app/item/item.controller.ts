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
import { ItemCodesDto, ItemDto, ItemIdsDto, ParamsDto } from '../dto/item.dto';
import { ItemService } from './item.service';
import { GlobalAuthGuard } from '@invyce/global-auth-guard';
import { IRequest, IPage, IItemWithResponse, IItem } from '@invyce/interfaces';
import { ItemLedgerDetailDto } from '../dto/ItemLedger.dto';

@Controller('item')
export class ItemController {
  constructor(private itemService: ItemService) {}

  @Get()
  @UseGuards(GlobalAuthGuard)
  async index(
    @Req() req: IRequest,
    @Query() query: IPage
  ): Promise<IItemWithResponse> {
    const item = await this.itemService.ListItems(req.user, query);

    if (item) {
      return {
        message: 'Item created successfull',
        status: true,
        result: !item.pagination ? item : item.result,
        pagination: item.pagination,
      };
    }
  }

  @Post('ids')
  @UseGuards(GlobalAuthGuard)
  async listItemByIds(@Body() itemDto: ItemIdsDto): Promise<IItem[]> {
    return await this.itemService.findByItemIds(itemDto);
  }

  @Post()
  @UseGuards(GlobalAuthGuard)
  async create(
    @Body() itemDto: ItemDto,
    @Req() req: IRequest
  ): Promise<IItemWithResponse> {
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
  async show(@Param() params: ParamsDto): Promise<IItemWithResponse> {
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
  async delete(
    @Body() itemDeleteIds: ItemIdsDto,
    @Req() req: IRequest
  ): Promise<IItemWithResponse> {
    const item = await this.itemService.DeleteItem(itemDeleteIds, req);

    if (item !== undefined) {
      return {
        message: 'Item deleted succesfully',
        status: true,
      };
    }
  }

  @Post('manage-inventory')
  @UseGuards(GlobalAuthGuard)
  async manageInventory(
    @Body() body: ItemLedgerDetailDto,
    @Req() req: IRequest
  ) {
    return await this.itemService.ManageInventory(body, req.user);
  }

  @Post('ids-or-codes')
  @UseGuards(GlobalAuthGuard)
  async fetchMultipleItems(@Body() body: ItemCodesDto): Promise<IItem[]> {
    return await this.itemService.FetchMultipleItems(body);
  }

  @Post('manage-stock')
  @UseGuards(GlobalAuthGuard)
  async manageItemStock(@Body() body): Promise<void> {
    return await this.itemService.ManageItemStock(body);
  }

  @Post('sync')
  @UseGuards(GlobalAuthGuard)
  async SyncItems(@Body() body, @Req() req: IRequest): Promise<void> {
    return await this.itemService.SyncItems(body, req.user);
  }
}
