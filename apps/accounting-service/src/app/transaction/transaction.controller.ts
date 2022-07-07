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
} from '@nestjs/common';
import { Request } from 'express';
import {
  DeleteTransactionsDto,
  TransactionApiDto,
  TransactionDto,
} from '../dto/transaction.dto';
import { TransactionService } from './transaction.service';

import {
  IRequest,
  IPage,
  ITransactionWithResponse,
  ITransaction,
} from '@invyce/interfaces';
import { ParamsDto } from '../dto/account.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Get()
  async index(
    @Req() req: IRequest,
    @Query() query: IPage
  ): Promise<ITransactionWithResponse> {
    try {
      const transaction = await this.transactionService.ListTransactions(
        req.user,
        query
      );
      if (transaction) {
        return {
          message: 'Transaction fetched successfully',
          status: true,
          pagination: transaction.pagination,
          result: !transaction.pagination ? transaction : transaction.result,
        };
      }
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post()
  async create(@Body() transactionDto: TransactionDto, @Req() req: Request) {
    try {
      const transaction = await this.transactionService.CreateTransaction(
        transactionDto,
        req.user
      );

      if (transaction) {
        return {
          message: 'Transaction Created successfully',
          result: transaction,
        };
      }
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('cash-summary')
  async cashSummary(@Req() req: IRequest, @Query() query) {
    const transaction = await this.transactionService.CashSummaryReport(
      req.user,
      query
    );

    if (transaction) {
      return {
        message: 'Cash summary report fetched successfully',
        result: transaction,
      };
    }
  }

  @Get('/:id')
  async show(@Param() params: ParamsDto): Promise<ITransactionWithResponse> {
    try {
      const transaction = await this.transactionService.FindTransactionById(
        params.id
      );

      if (transaction) {
        return {
          message: 'Transaction fetched successfully.',
          status: true,
          result: transaction,
        };
      }
      throw new HttpException('Transaction not found', HttpStatus.BAD_REQUEST);
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('api')
  async trasanctionApi(
    @Body() data: TransactionApiDto,
    @Req() req: IRequest
  ): Promise<ITransaction> {
    return await this.transactionService.TransactionApi(
      data.transactions,
      req.user
    );
  }

  @Post('add')
  async addTransaction(
    @Body() data: TransactionApiDto,
    @Req() req: IRequest
  ): Promise<void> {
    return await this.transactionService.AddTransaction(data, req);
  }

  @Put('approve/:id')
  async approveTransaction(@Param() params) {
    return await this.transactionService.ApproveTransaction(params.id);
  }

  @Post('delete')
  async deleteJournalEntry(
    @Body() data: DeleteTransactionsDto,
    @Req() req: IRequest
  ) {
    return await this.transactionService.DeleteJornalEntry(data, req.user);
  }

  @Put('delete')
  async deleteDraftTransactions(@Body() data: DeleteTransactionsDto) {
    return await this.transactionService.DeleteTransaction(data);
  }
}
