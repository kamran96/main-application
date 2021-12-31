import { Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FinancialService } from './financial.service';
import { GlobalAuthGuard } from '@invyce/global-auth-guard';
import { CONTACT_CREATED } from '@invyce/send-email';

@Controller('financial')
export class FiancialController {
  constructor(private financialService: FinancialService) {}

  @MessagePattern(CONTACT_CREATED)
  async CreateContact(@Payload() data) {
    Logger.log('Data is received.');
    Logger.log(data);

    await this.financialService.CreateContact(data);
  }

  @Post('balance-sheet')
  @UseGuards(GlobalAuthGuard)
  async balanceSheet() {
    const balance_sheet = await this.financialService.BalanceSheet();

    if (balance_sheet) {
      return {
        message: 'Balance sheet fetched successfully.',
        status: true,
        result: balance_sheet,
      };
    }
  }

  @Post('budget-manager')
  @UseGuards(GlobalAuthGuard)
  async budgetManager() {
    const budget_manager = await this.financialService.BudgetManager();

    if (budget_manager) {
      return {
        message: 'budget manager fetched successfully.',
        status: true,
        result: budget_manager,
      };
    }
  }

  @Post('budget-summary')
  @UseGuards(GlobalAuthGuard)
  async budgetSummary() {
    const budget_summary = await this.financialService.BudgetSummary();

    if (budget_summary) {
      return {
        message: 'budget summary fetched successfully.',
        status: true,
        result: budget_summary,
      };
    }
  }

  @Post('budget-variance')
  @UseGuards(GlobalAuthGuard)
  async budgetVariance() {
    const budger_variance = await this.financialService.BudgetVariance();

    if (budger_variance) {
      return {
        message: 'budget variance fetched successfully.',
        status: true,
        result: budger_variance,
      };
    }
  }

  @Post('bussiness-performance')
  @UseGuards(GlobalAuthGuard)
  async bussinessPerformance() {
    const bussiness_performance =
      await this.financialService.BussinessPerformance();

    if (bussiness_performance) {
      return {
        message: 'Bussiness performance fetched successfully.',
        status: true,
        result: bussiness_performance,
      };
    }
  }

  @Post('cash-summary')
  @UseGuards(GlobalAuthGuard)
  async cashSummary() {
    const cash_summary = await this.financialService.CashSummary();

    if (cash_summary) {
      return {
        message: 'Cash summary fetched successfully.',
        status: true,
        result: cash_summary,
      };
    }
  }

  @Post('executive-summary')
  @UseGuards(GlobalAuthGuard)
  async executiveSummary() {
    const executive_summary = await this.financialService.ExecutiveSummary();

    if (executive_summary) {
      return {
        message: 'Executive summary fetched successfully.',
        status: true,
        result: executive_summary,
      };
    }
  }

  @Post('movement-equity')
  @UseGuards(GlobalAuthGuard)
  async movementInEquity() {
    const moment_in_equity = await this.financialService.MovementInEquity();

    if (moment_in_equity) {
      return {
        message: 'Moment in equity fetched successfully.',
        status: true,
        result: moment_in_equity,
      };
    }
  }

  @Post('profit-loss')
  @UseGuards(GlobalAuthGuard)
  async profitAndLoss() {
    const profit_and_loss = await this.financialService.ProfitAndLoss();

    if (profit_and_loss) {
      return {
        message: 'Profit and loss fetched successfully.',
        status: true,
        result: profit_and_loss,
      };
    }
  }

  @Post('cash-flow-statment')
  @UseGuards(GlobalAuthGuard)
  async statmentOfCashFlow() {
    const statment_of_cash_flow =
      await this.financialService.StatmentOfCashFlow();

    if (statment_of_cash_flow) {
      return {
        message: 'Statment of cash flow fetched successfully.',
        status: true,
        result: statment_of_cash_flow,
      };
    }
  }

  @Post('tracking-summary')
  @UseGuards(GlobalAuthGuard)
  async trackingSummary() {
    const tracking_summary = await this.financialService.TrackingSummary();

    if (tracking_summary) {
      return {
        message: 'Tracking summary fetched successfully.',
        status: true,
        result: tracking_summary,
      };
    }
  }
}
