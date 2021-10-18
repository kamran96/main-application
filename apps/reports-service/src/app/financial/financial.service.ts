import { Injectable } from '@nestjs/common';

@Injectable()
export class FinancialService {
  async BalanceSheet() {
    return 'Balace sheet data will be here';
  }

  async BudgetManager() {
    return 'budget manager will be here';
  }

  async BudgetSummary() {
    return 'budget summary will be here';
  }

  async BudgetVariance() {
    return 'budget variance will be here';
  }

  async BussinessPerformance() {
    return 'bussiness permformance will be here';
  }

  async CashSummary() {
    return 'cash summary will be here';
  }

  async ExecutiveSummary() {
    return 'executive summary will be here';
  }

  async MovementInEquity() {
    return 'moment in equity will be here';
  }

  async ProfitAndLoss() {
    return 'profit and loss will be here';
  }

  async StatmentOfCashFlow() {
    return 'statment of cash flow will be here';
  }

  async TrackingSummary() {
    return 'tracking summary will be here';
  }
}
