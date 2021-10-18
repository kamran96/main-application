import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  HttpException,
  HttpStatus,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { query, Request } from 'express';
import { PaymentService } from './payment.service';
import { GlobalAuthGuard } from '@invyce/global-auth-guard';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Get()
  @UseGuards(GlobalAuthGuard)
  async index(@Query() query, @Req() req: Request) {
    const payments = await this.paymentService.Index(query, req.user);

    if (payments) {
      return {
        message: 'Payments fetched successfully.',
        status: true,
        pagination: payments.pagination,
        result: payments.payments,
      };
    }
  }

  @Post('/invoice')
  @UseGuards(GlobalAuthGuard)
  async getPaymentAgainstInvoice(@Body() invoiceIds) {
    return await this.paymentService.GetPaymentAgainstInvoiceId(invoiceIds);
  }

  @Post()
  @UseGuards(GlobalAuthGuard)
  async create(@Body() data, @Req() req: Request) {
    try {
      const payment = await this.paymentService.CreatePayment(data, req);

      if (payment) {
        return {
          message: 'Payment created successfully.',
          status: true,
          result: payment,
        };
      }
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
