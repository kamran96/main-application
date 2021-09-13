import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { InvoiceService } from './invoice.service';
import { GlobalAuthGuard } from '@invyce/global-auth-guard';
import { InvoiceDto } from '../dto/invoice.dto';

@Controller('invoice')
export class InvoiceController {
  constructor(private invoiceService: InvoiceService) {}

  @Get('pdf')
  async pdf() {
    return await this.invoiceService.Pdf();
  }

  @UseGuards(GlobalAuthGuard)
  @Post()
  async create(@Body() invoiceDto: InvoiceDto, @Req() req: Request) {
    try {
      const invoice = await this.invoiceService.CreateInvoice(
        invoiceDto,
        req.user
      );

      if (invoice.length > 0) {
        return {
          message: 'Invoice created successfully.',
          status: true,
          result: invoice[0],
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
  @Get('number')
  async getInvoiceNumber(@Query() { type }, @Req() req: Request) {
    try {
      const invoice = await this.invoiceService.GetInvoiceNumber(
        type,
        req.user
      );

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

  @UseGuards(GlobalAuthGuard)
  @Get('/:id')
  async show(@Param() params) {
    try {
      const invoice = await this.invoiceService.FindById(params.id);

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
