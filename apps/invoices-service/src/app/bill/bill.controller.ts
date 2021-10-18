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
import { Request } from 'express';
import { BillService } from './bill.service';
import { GlobalAuthGuard } from '@invyce/global-auth-guard';
import { BillDeleteIdsDto, BillDto } from '../dto/bill.dto';

@Controller('bill')
export class BillController {
  constructor(private billService: BillService) {}

  @Get()
  @UseGuards(GlobalAuthGuard)
  async index(@Req() req: Request, @Query() query) {
    try {
      const bill = await this.billService.IndexBill(req.user, query);

      if (bill) {
        return {
          message: 'Bill fetched successfully.',
          status: true,
          pagination: bill.pagination,
          result: bill.bills,
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
  async findByInvoiceIds(@Body() invoiceIds: BillDeleteIdsDto) {
    return await this.billService.FindByBillIds(invoiceIds);
  }

  @Post()
  @UseGuards(GlobalAuthGuard)
  async create(@Body() billDto: BillDto, @Req() req: Request) {
    try {
      const bill = await this.billService.CreateBill(billDto, req.user);

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
  async show(@Param() params, @Req() req: Request) {
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
      console.log(error);
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put()
  @UseGuards(GlobalAuthGuard)
  async delete(@Body() billIds: BillDeleteIdsDto) {
    const bill = await this.billService.deleteBill(billIds);

    if (bill) {
      return {
        message: 'Bill deleted successfully.',
        status: true,
      };
    }
  }
}
