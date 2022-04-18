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
import { IRequest, IPage } from '@invyce/interfaces';
import { QuotationService } from './quotation.service';
import { QuotationDto } from '../dto/quotation.dto';

@Controller('quotation')
export class QuotationController {
  constructor(private quotationService: QuotationService) {}

  @UseGuards(GlobalAuthGuard)
  @Get()
  async index(@Req() req: IRequest, @Query() query: IPage) {
    return this.quotationService.IndexQO(req, query);
  }

  @UseGuards(GlobalAuthGuard)
  @Post()
  async CreatePurchaseOrder(
    @Body() purchaseOrder: QuotationDto,
    @Req() req: IRequest
  ) {
    return this.quotationService.CreateQuotation(purchaseOrder, req);
  }

  @UseGuards(GlobalAuthGuard)
  @Get('/:id')
  async show(@Param() params, @Req() req: IRequest) {
    return await this.quotationService.FindById(params.id, req);
  }

  @UseGuards(GlobalAuthGuard)
  @Put()
  async update(@Body() data, @Req() req: IRequest) {
    return await this.quotationService.DeleteQuotation(data, req);
  }
}
