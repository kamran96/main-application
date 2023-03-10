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
  Res,
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { Response } from 'express';

import { InvoiceIdsDto, InvoiceDto, ParamsDto } from '../dto/invoice.dto';
import {
  IInvoice,
  IInvoiceWithResponse,
  IPage,
  IRequest,
} from '@invyce/interfaces';

@Controller('invoice')
export class InvoiceController {
  constructor(private invoiceService: InvoiceService) {}

  @Get()
  async index(
    @Req() req: IRequest,
    @Query() query: IPage
  ): Promise<IInvoiceWithResponse> {
    try {
      const invoice = await this.invoiceService.IndexInvoice(req, query);

      if (invoice) {
        return {
          message: 'Invoice fetched successfully.',
          status: true,
          pagination: invoice.pagination,
          result: invoice.result,
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
  async invoiceAgainstContact(
    @Param() params: ParamsDto,
    @Req() req: IRequest,
    @Query() { type }
  ): Promise<IInvoiceWithResponse> {
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

  @Get('first-invoice')
  async createFirstInvoice(@Req() req: IRequest) {
    return await this.invoiceService.CreateYourFirstInvoice(req.user);
  }

  @Get('pending-invoices')
  async pendingInvoices(@Req() req: IRequest) {
    return await this.invoiceService.PendingPaymentInvoices(req);
  }

  @Post('pdf')
  async generatePdfAndSendEmail(@Body() data, @Req() req: IRequest) {
    return await this.invoiceService.GeneratePdfAndSendEamil(data, req);
  }

  @Post('ids')
  async findByInvoiceIds(
    @Body() invoiceIds: InvoiceIdsDto
  ): Promise<IInvoice[]> {
    return await this.invoiceService.FindByInvoiceIds(invoiceIds);
  }

  @Get('contacts/:id')
  async findInvoiceByContactId(
    @Param() invoiceIds: ParamsDto
  ): Promise<IInvoice[]> {
    return await this.invoiceService.FindInvoicesByContactId(invoiceIds.id);
  }

  @Get('receivables')
  async agedReceivables(@Req() req: IRequest, @Query() query) {
    const invoices = await this.invoiceService.AgedReceivables(req, query);

    if (invoices) {
      return {
        message: 'Successfull',
        status: true,
        result: invoices,
      };
    }
  }

  @Post()
  async create(
    @Body() invoiceDto: InvoiceDto,
    @Req() req: IRequest
  ): Promise<IInvoiceWithResponse> {
    try {
      const invoice = await this.invoiceService.CreateInvoice(invoiceDto, req);

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

  @Get('number')
  async getInvoiceNumber(
    @Query() { type },
    @Req() req: IRequest
  ): Promise<IInvoiceWithResponse> {
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
    } catch (error) {
      console.log(error);
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put('due-date/:id')
  async changeDueDate(@Param() params, @Body() invoiceDto) {
    return await this.invoiceService.ChangeDueDate(params.id, invoiceDto);
  }

  @Get('/:id')
  async show(
    @Param() params,
    @Req() req: IRequest
  ): Promise<IInvoiceWithResponse> {
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
  async delete(
    @Body() inoviceIds: InvoiceIdsDto,
    @Req() req: IRequest
  ): Promise<IInvoiceWithResponse> {
    const invoice = await this.invoiceService.deleteInvoice(inoviceIds, req);

    if (invoice) {
      return {
        message: 'Invoice deleted successfully.',
        status: true,
      };
    }
  }

  @Post('sync')
  async SyncInvoices(@Body() body, @Req() req: IRequest): Promise<void> {
    return await this.invoiceService.SyncInvoices(body, req);
  }
}
