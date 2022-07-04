import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { Request } from 'express';

import { BankService } from './bank.service';

@Controller('bank')
export class BankController {
  constructor(private BankService: BankService) {}

  @Get()
  async index() {
    const banks = await this.BankService.ListBanks();

    if (banks) {
      return {
        message: 'Bank fetched successfully.',
        status: true,
        result: banks,
      };
    }
  }

  @Get('account')
  async indexBankAccount(@Req() req: Request, @Query() query) {
    const banks = await this.BankService.ListBankAccount(req.user, query);

    if (banks) {
      return {
        message: 'Bank fetched successfully.',
        status: true,
        result: banks,
      };
    }
  }

  @Post('account')
  async bankAccount(@Body() bankAccountDto, @Req() req: Request) {
    const banks = await this.BankService.CreateBankAccount(
      bankAccountDto,
      req.user
    );

    if (banks) {
      return {
        message: 'Bank Account created successfully.',
        status: true,
        result: banks,
      };
    }
  }
}
