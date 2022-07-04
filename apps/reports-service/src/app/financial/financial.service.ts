import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { BigQuery } from '@google-cloud/bigquery';
import { CONTACT_CREATED } from '@invyce/send-email';
const bigquery = new BigQuery();

@Injectable()
export class FinancialService {
  @RabbitSubscribe({
    exchange: 'contact-created',
    routingKey: 'adsfaasdfasdfasdf12341234',
    queue: CONTACT_CREATED,
  })
  public async FetchContactData(data) {
    console.log(`Received message: ${JSON.stringify(data)}`);
  }

  async CreateContact(data) {
    await bigquery.dataset('invyce-testing').table('contacts').insert(data);
  }

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
