import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { GlobalAuthGuard } from '@invyce/global-auth-guard';
import { BankService } from './bank.service';

@Controller('bank')
export class BankController {
  constructor(private BankService: BankService) {}

  @Get()
  @UseGuards(GlobalAuthGuard)
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
  @UseGuards(GlobalAuthGuard)
  async indexBankAccount(@Req() req: Request) {
    const banks = await this.BankService.ListBankAccount(req.user);

    if (banks) {
      return {
        message: 'Bank fetched successfully.',
        status: true,
        result: banks,
      };
    }
  }

  @Post('account')
  @UseGuards(GlobalAuthGuard)
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
