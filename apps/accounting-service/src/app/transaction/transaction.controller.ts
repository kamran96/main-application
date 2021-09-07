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
import { TransactionDto } from '../dto/transaction.dto';
import { TransactionService } from './transaction.service';
import { GlobalAuthGuard } from '@invyce/global-auth-guard';

@Controller('transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Get()
  @UseGuards(GlobalAuthGuard)
  async index(@Req() req: Request, @Query() query) {
    try {
      const transaction = await this.transactionService.ListTransactions(
        req.user,
        query
      );

      if (transaction) {
        return {
          message: 'Transaction fetched successfully',
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

  @Post()
  @UseGuards(GlobalAuthGuard)
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

  @Get('/:id')
  @UseGuards(GlobalAuthGuard)
  async show(@Param() params) {
    try {
      const transaction = await this.transactionService.FindTransactionById(
        params.id
      );

      if (transaction.length) {
        return {
          message: 'Transaction fetched successfully.',
          status: true,
          result: transaction[0],
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
}
