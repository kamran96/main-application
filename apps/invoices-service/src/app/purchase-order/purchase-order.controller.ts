import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GlobalAuthGuard } from '@invyce/global-auth-guard';
import { PurchaseOrderService } from './purchase-order.service';
import { PurchaseOrderDto } from '../dto/purchase-order.dto';
import { IRequest, IPage } from '@invyce/interfaces';

@Controller('purchase-order')
export class PurchaseOrderController {
  constructor(private purchaseOrderService: PurchaseOrderService) {}

  @UseGuards(GlobalAuthGuard)
  @Get()
  async index(@Req() req: IRequest, @Query() query: IPage) {
    return this.purchaseOrderService.IndexPO(req, query);
  }

  @UseGuards(GlobalAuthGuard)
  @Post()
  async CreatePurchaseOrder(
    @Body() purchaseOrder: PurchaseOrderDto,
    @Req() req: IRequest
  ) {
    return this.purchaseOrderService.CreatePurchaseOrder(purchaseOrder, req);
  }

  @UseGuards(GlobalAuthGuard)
  @Get('/:id')
  async show(@Param() params, @Req() req: IRequest) {
    return await this.purchaseOrderService.FindById(params.id, req);
  }

  @UseGuards(GlobalAuthGuard)
  @Put()
  async update(@Body() data, @Req() req: IRequest) {
    return await this.purchaseOrderService.DeletePurchaseOrder(data, req);
  }
}
