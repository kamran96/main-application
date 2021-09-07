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
} from '@nestjs/common';
import { Request } from 'express';
import { BillService } from './bill.service';
import { GlobalAuthGuard } from '@invyce/global-auth-guard';
import { BillDto } from '../dto/bill.dto';

@Controller('bill')
export class BillController {
  constructor(private billService: BillService) {}

  @UseGuards(GlobalAuthGuard)
  @Post()
  async create(@Body() billDto: BillDto, @Req() req: Request) {
    try {
      const bill = await this.billService.CreateBill(billDto, req.user);

      if (bill.length > 0) {
        return {
          message: 'Bill created successfully.',
          status: true,
          result: bill[0],
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

  @UseGuards(GlobalAuthGuard)
  @Get('/:id')
  async show(@Param() params) {
    try {
      const invoice = await this.billService.FindById(params.id);

      if (invoice.length > 0) {
        return {
          message: 'Invoice fetched successfully.',
          status: true,
          result: invoice[0],
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
}
