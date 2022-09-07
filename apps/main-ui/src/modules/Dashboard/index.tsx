import { Col, Row } from 'antd';
import dayjs from 'dayjs';
import { FC, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { DailyStalesDashboardAPI } from '../../api';
import {
  CustomDateRange,
  ExpensesOverview,
  Heading,
  InvoiceOverview,
  InvoicesOverview,
  ProfitAndLossOverview,
  Sales,
  SalesReportGraph,
  SystemMessages,
} from '@components';
import { IDashboardSalesOverview } from '@invyce/shared/types';

export const DashboardContainer: FC<any> = () => {
  const [dailySales, setDailySales] = useState<IDashboardSalesOverview>({
    expenseDifference: 0,
    id: 0,
    invoiceDifference: 0,
    invoicePercent: 0,
    prev_invoice: 0,
    prev_sale: 0,
    prevexpense: 0,
    purchasePercent: 0,
    saleDifference: 0,
    salePercent: 0,
    totalExpenses: 0,
    totalInvoiceSend: 0,
    totalSales: 0,
  });

  const [apiConfig, setApiConfig] = useState({
    start: dayjs().subtract(7, 'day'),
    end: dayjs(),
  });

  const { data: dailySalesData, isLoading: dailySalesLoading } = useQuery(
    [
      `daily-sales-report-start=${apiConfig.start}-end=${apiConfig.end}`,
      apiConfig.start,
      apiConfig.end,
    ],
    DailyStalesDashboardAPI
  );

  useEffect(() => {
    if (dailySalesData?.data?.result) {
      setDailySales(dailySalesData.data.result);
    }
  }, [dailySalesData]);

  return (
    <WrapperDashboardContainer>
      <Row gutter={24}>
        <Col span={22} offset={1}>
          <Row gutter={24}>
            <Col span={12}>
              <Heading type="table">Overview</Heading>
            </Col>
            <Col span={12}>
              <div className="flex justifyFlexEnd">
                <CustomDateRange
                  size="small"
                  onChange={(dates) => {
                    if (dates && dates.length) {
                      setApiConfig({
                        ...apiConfig,
                        start: dates[0],
                        end: dates[1],
                      });
                    } else {
                      setApiConfig({
                        ...apiConfig,
                        start: dayjs(),
                        end: dayjs(),
                      });
                    }
                  }}
                />
              </div>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col
              xxl={{ span: 18 }}
              xl={{ span: 16 }}
              lg={{ span: 24 }}
              sm={{ span: 24 }}
              xs={{ span: 24 }}
              className={'pb-24'}
            >
              <Row gutter={24}>
                <Col span={24} className={'pb-24'}>
                  <SystemMessages />
                </Col>
                <Col
                  xxl={{ span: 8 }}
                  xl={{ span: 8 }}
                  lg={{ span: 8 }}
                  sm={{ span: 12 }}
                  xs={{ span: 24 }}
                >
                  <Sales data={dailySales} />
                </Col>
                <Col
                  xxl={{ span: 8 }}
                  xl={{ span: 8 }}
                  lg={{ span: 8 }}
                  sm={{ span: 12 }}
                  xs={{ span: 24 }}
                  className={'pt-24-max-xs'}
                >
                  <InvoicesOverview data={dailySales} />
                </Col>
                <Col
                  xxl={{ span: 8 }}
                  xl={{ span: 8 }}
                  lg={{ span: 8 }}
                  sm={{ span: 12 }}
                  xs={{ span: 24 }}
                  className={'pt-24-max-sm'}
                >
                  <ExpensesOverview data={dailySales} />
                </Col>
                <Col
                  xxl={{ span: 24 }}
                  xl={{ span: 24 }}
                  lg={{ span: 24 }}
                  sm={{ span: 12 }}
                  xs={{ span: 24 }}
                  className={'pt-24'}
                >
                  <SalesReportGraph />
                </Col>
              </Row>
            </Col>
            <Col
              xxl={{ span: 6 }}
              xl={{ span: 8 }}
              lg={{ span: 24 }}
              sm={{ span: 24 }}
              xs={{ span: 24 }}
            >
              <Row gutter={24}>
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 12 }}
                  lg={{ span: 12 }}
                  xl={{ span: 24 }}
                  xxl={{ span: 24 }}
                  className={'pb-24'}
                >
                  <InvoiceOverview />
                </Col>
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 12 }}
                  lg={{ span: 12 }}
                  xl={{ span: 24 }}
                  xxl={{ span: 24 }}
                >
                  <ProfitAndLossOverview />
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </WrapperDashboardContainer>
  );
};

const WrapperDashboardContainer = styled.div`
  ._custom_col {
    margin: 7px 0;
    max-width: 100%;
  }

  @media only screen and (max-width: 991px) {
    .pt-24-max-sm {
      padding-top: 1.5rem;
    }
  }
  @media only screen and (max-width: 767px) {
    .pt-24-max-xs {
      padding-top: 1.5rem;
    }
  }
`;
