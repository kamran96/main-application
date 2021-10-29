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
import { InvoiceService } from './invoice.service';
import { GlobalAuthGuard } from '@invyce/global-auth-guard';
import { InvoiceDeleteIdsDto, InvoiceDto } from '../dto/invoice.dto';

@Controller('invoice')
export class InvoiceController {
  constructor(private invoiceService: InvoiceService) {}

  @Get()
  @UseGuards(GlobalAuthGuard)
  async index(@Req() req: Request, @Query() query) {
    try {
      const invoice = await this.invoiceService.IndexInvoice(req.user, query);

      if (invoice) {
        return {
          message: 'Invoice fetched successfully.',
          status: true,
          pagination: invoice.pagination,
          result: invoice.invoices,
        };
      }
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('contact/:id')
  @UseGuards(GlobalAuthGuard)
  async invoiceAgainstContact(
    @Param() params,
    @Req() req: Request,
    @Query() { type }
  ) {
    const invoices = await this.invoiceService.InvoicesAgainstContactId(
      params.id,
      req,
      type
    );

    if (invoices) {
      return {
        message: 'Invoices fetched successfully.',
        status: true,
        result: invoices,
      };
    }
  }

  @Get('pdf')
  async pdf() {
    return await this.invoiceService.Pdf();
  }

  @Post('ids')
  @UseGuards(GlobalAuthGuard)
  async findByInvoiceIds(@Body() invoiceIds: InvoiceDeleteIdsDto) {
    return await this.invoiceService.FindByInvoiceIds(invoiceIds);
  }

  @UseGuards(GlobalAuthGuard)
  @Post()
  async create(@Body() invoiceDto: InvoiceDto, @Req() req: Request) {
    try {
      const invoice = await this.invoiceService.CreateInvoice(
        invoiceDto,
        req.user
      );

      if (invoice) {
        return {
          message: 'Invoice created successfully.',
          status: true,
          result: invoice,
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
  async show(@Param() params, @Req() req: Request) {
    try {
      const invoice = await this.invoiceService.FindById(params.id, req);

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
  async delete(@Body() inoviceIds: InvoiceDeleteIdsDto) {
    const invoice = await this.invoiceService.deleteInvoice(inoviceIds);

    if (invoice) {
      return {
        message: 'Invoice deleted successfully.',
        status: true,
      };
    }
  }

  @Post('sync')
  @UseGuards(GlobalAuthGuard)
  async SyncInvoices(@Body() body, @Req() req: Request) {
    return await this.invoiceService.SyncInvoices(body, req);
  }
}
