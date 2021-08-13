import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { TransactionDto } from '../dto/transaction.dto';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async index(TransactionDto, @Req() req: Request) {
    try {
      const transaction = await this.transactionService.ListTransactions(
        req.body,
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
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() transactionDto: TransactionDto, @Req() req: Request) {
    try {
      const transaction = await this.transactionService.CreateTransaction(
        transactionDto,
        req.user,
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
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
