import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  HttpException,
  HttpStatus,
  Get,
  Query,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { GlobalAuthGuard } from '@invyce/global-auth-guard';
import {
  IRequest,
  IPage,
  IPaymentWithResponse,
  IPayment,
} from '@invyce/interfaces';
import {
  PaymentContactDto,
  PaymentDto,
  PaymentInvoiceDto,
} from '../dto/payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Get()
  @UseGuards(GlobalAuthGuard)
  async index(
    @Query() query: IPage,
    @Req() req: IRequest
  ): Promise<IPaymentWithResponse> {
    const payments = await this.paymentService.Index(query, req.user);

    if (payments) {
      return {
        message: 'Payments fetched successfully.',
        status: true,
        pagination: payments.pagination,
        result: payments.result,
      };
    }
  }

  @Post('/invoice')
  @UseGuards(GlobalAuthGuard)
  async getPaymentAgainstInvoice(
    @Body() invoiceIds: PaymentInvoiceDto
  ): Promise<IPayment[]> {
    return await this.paymentService.GetPaymentAgainstInvoiceId(invoiceIds);
  }

  @Post('/contact')
  @UseGuards(GlobalAuthGuard)
  async GetPaymentAgainstContactId(
    @Body() contactIds: PaymentContactDto
  ): Promise<IPayment[]> {
    return await this.paymentService.GetPaymentAgainstContactId(contactIds);
  }

  @Post()
  @UseGuards(GlobalAuthGuard)
  async create(
    @Body() data: PaymentDto,
    @Req() req: IRequest
  ): Promise<IPaymentWithResponse> {
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

  @Post('add')
  @UseGuards(GlobalAuthGuard)
  async addPayment(@Body() body, @Req() req: IRequest): Promise<void> {
    return await this.paymentService.AddPayment(body, req.user);
  }
}
