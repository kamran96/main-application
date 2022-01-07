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
  Put,
  Param,
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
  DeletePaymentDto,
  PaymentContactDto,
  PaymentDto,
  PaymentIdDto,
  PaymentIdsDto,
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
    @Body() invoiceIds: PaymentInvoiceDto,
    @Req() req: IRequest
  ): Promise<IPayment[]> {
    return await this.paymentService.GetPaymentAgainstInvoiceId(
      invoiceIds,
      req.user
    );
  }

  @Post('/contact')
  @UseGuards(GlobalAuthGuard)
  async GetPaymentAgainstContactId(
    @Body() contactIds: PaymentContactDto,
    @Req() req: IRequest
  ): Promise<IPayment[]> {
    return await this.paymentService.GetPaymentAgainstContactId(
      contactIds,
      req.user
    );
  }

  @Get('/opening-balance/:id')
  @UseGuards(GlobalAuthGuard)
  async getPaymentOpeningBalance(
    @Param() contactIds: PaymentIdDto,
    @Req() req: IRequest,
    @Query() query
  ): Promise<unknown> {
    return await this.paymentService.ContactOpeningBalance(
      contactIds.id,
      req.user,
      query
    );
  }

  @Get('/contact/:id')
  @UseGuards(GlobalAuthGuard)
  async getPaymentWithBalance(
    @Param() contactIds: PaymentIdDto,
    @Req() req: IRequest,
    @Query() query
  ): Promise<unknown> {
    return await this.paymentService.GetPaymentAndBalance(
      contactIds.id,
      req.user,
      query
    );
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

  @Post('delete')
  @UseGuards(GlobalAuthGuard)
  async deletePaymentAgainstInvoiceOrBillId(
    @Body() body: DeletePaymentDto,
    @Req() req: IRequest
  ) {
    return await this.paymentService.DeletePaymentAgainstInvoiceOrBillId(
      body,
      req
    );
  }

  @Put('delete')
  @UseGuards(GlobalAuthGuard)
  async delete(@Body() body: PaymentIdsDto, @Req() req: Request) {
    const payment = await this.paymentService.DeletePayment(body, req);

    if (payment) {
      return {
        message: 'Payment deleted successfully.',
        status: true,
      };
    }
  }
}
