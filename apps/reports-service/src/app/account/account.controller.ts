import { Controller, Get } from '@nestjs/common';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Get('balance-sheet')
  async BalanceSheet() {
    return await this.accountService.BalanceSheet();
  }

  @Get('trail-balance')
  async TrailBalance() {
    return await this.accountService.TrailBalance();
  }

  @Get('income-statement')
  async IncomeStatment() {
    return await this.accountService.IncomeStatment();
  }

  @Get('changes-in-equity')
  async ChangesInEquity() {
    return await this.accountService.ChangesInEquity();
  }
}
