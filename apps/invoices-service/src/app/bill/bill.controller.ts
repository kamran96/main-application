import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BillService } from './bill.service';
import { GlobalAuthGuard } from '@invyce/global-auth-guard';
import { BillIdsDto, BillDto, BillParamsDto } from '../dto/bill.dto';
import { IRequest, IPage, IBillWithResponse, IBill } from '@invyce/interfaces';

@Controller('bill')
export class BillController {
  constructor(private billService: BillService) {}

  @Get()
  @UseGuards(GlobalAuthGuard)
  async index(
    @Req() req: IRequest,
    @Query() query: IPage
  ): Promise<IBillWithResponse> {
    try {
      const bill = await this.billService.IndexBill(req, query);

      if (bill) {
        return {
          message: 'Bill fetched successfully.',
          status: true,
          pagination: bill.pagination,
          result: bill.result,
        };
      }
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('ids')
  @UseGuards(GlobalAuthGuard)
  async findByInvoiceIds(@Body() invoiceIds: BillIdsDto): Promise<IBill[]> {
    return await this.billService.FindByBillIds(invoiceIds);
  }

  @Post()
  @UseGuards(GlobalAuthGuard)
  async create(
    @Body() billDto: BillDto,
    @Req() req: IRequest
  ): Promise<IBillWithResponse> {
    try {
      const bill = await this.billService.CreateBill(billDto, req);

      if (bill) {
        return {
          message: 'Bill created successfully.',
          status: true,
          result: bill,
        };
      }
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @UseGuards(GlobalAuthGuard)
  @Get('/:id')
  async show(
    @Param() params: BillParamsDto,
    @Req() req: IRequest
  ): Promise<IBillWithResponse> {
    try {
      const invoice = await this.billService.FindById(params.id, req);

      if (invoice) {
        return {
          message: 'Invoice fetched successfully.',
          status: true,
          result: invoice,
        };
      }
      throw new HttpException(
        'Failed to create invoice',
        HttpStatus.BAD_REQUEST
      );
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
    @Body() billIds: BillIdsDto,
    @Req() req: IRequest
  ): Promise<IBillWithResponse> {
    const bill = await this.billService.deleteBill(billIds, req);

    if (bill) {
      return {
        message: 'Bill deleted successfully.',
        status: true,
      };
    }
  }
}
