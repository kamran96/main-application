import { Controller, Get, Query, Req } from '@nestjs/common';
import { Request } from 'express';

import { ReportService } from './report.service';

@Controller('reports')
export class ReportController {
  constructor(private reportService: ReportService) {}

  @Get('/income-statement')
  async income_statement(@Req() req: Request, @Query() { query }) {
    const income = await this.reportService.IncomeStatement(req.user, query);

    if (income) {
      return {
        message: 'successfull',
        result: income,
      };
    }
  }

  @Get('/balance-sheet')
  async balance_sheet(@Req() req: Request, @Query() { query }) {
    const account = await this.reportService.BalanceSheet(req.user, query);

    if (account) {
      return {
        message: 'successfull',
        result: account,
      };
    }
  }

  @Get('/trial-balance')
  async trail_balance(@Req() req: Request, @Query() { query }) {
    const account = await this.reportService.TrailBalance(req.user, query);

    if (account) {
      return {
        message: 'successfull',
        result: account,
      };
    }
  }
}
