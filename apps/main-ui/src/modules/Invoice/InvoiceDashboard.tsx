import fileText from "@iconify-icons/feather/file-text";
import Icon from "@iconify/react";
import { Button, Col, Row, Select } from "antd";
import { Option } from "antd/lib/mentions";
import React, { FC, useEffect, useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { invoiceDashboardDetailsAPI } from "../../api";

import { Heading } from "../../components/Heading";
import { P } from "../../components/Typography";
import { useGlobalContext } from "../../hooks/globalContext/globalContext";
import { IThemeProps } from "../../hooks/useTheme/themeColors";
import { Color, ISupportedRoutes } from "../../modal";
import { IInvoiceDashboardDetails } from "../../modal/invoice";
import convertToRem from "../../utils/convertToRem";
import { AllInvoices } from "./Allinvoices";
import { DailySalesReportGraph } from "./DailyInvoiceGraph";
import { DraftInvoices } from "./DraftInvoice";
import { SummaryInvoice } from "./SummaryInvoice";
import { Card } from "../../components/Card";

export const InvoiceDashboard: FC = () => {
  const { routeHistory } = useGlobalContext();
  const { history } = routeHistory;
  /* React Hooks Here */
  /* Local States */
  const [detailsResult, setDetailsResult] = useState<IInvoiceDashboardDetails>(
    null
  );

  const {
    data: dashboardDetailsData,
    isLoading: dashboardDetailsFetching,
  } = useQuery(["invoices_dashboard_details"], invoiceDashboardDetailsAPI);

  useEffect(() => {
    if (
      dashboardDetailsData &&
      dashboardDetailsData.data &&
      dashboardDetailsData.data.result
    ) {
      const { result } = dashboardDetailsData.data;
      setDetailsResult(result[0]);
    }
  }, [dashboardDetailsData]);
  console.log(detailsResult);
  return (
    <WrappperInvoiceDashboard>
      <div className="invoice_header">
        <Heading type="table">Invoices</Heading>
      </div>
      <Row gutter={24}>
        <Col
          className="gutter-row"
          xxl={{ span: 6 }}
          xl={{ span: 6 }}
          lg={{ span: 12 }}
          md={{ span: 12 }}
          sm={{ span: 24 }}
          xs={{ span: 24 }}
        >
          <SummaryInvoice
            footerDesc="Today Invoice "
            icon_bg="_color"
            icon={<Icon color="#1f9dff" icon={fileText} />}
            amount={detailsResult ? detailsResult.today_sale : 0}
          />
        </Col>

        <Col
          className="gutter-row"
          xxl={{ span: 6 }}
          xl={{ span: 6 }}
          lg={{ span: 12 }}
          md={{ span: 12 }}
          sm={{ span: 24 }}
          xs={{ span: 24 }}
        >
          <SummaryInvoice
            icon_bg="_color1"
            footerDesc="Draft invoices to process"
            icon={<Icon color="#FFA51F" icon={fileText} />}
            amount={detailsResult && detailsResult.draft_invoices}
          />
        </Col>
        <Col
          className="gutter-row"
          xxl={{ span: 6 }}
          xl={{ span: 6 }}
          lg={{ span: 12 }}
          md={{ span: 12 }}
          sm={{ span: 24 }}
          xs={{ span: 24 }}
        >
          <SummaryInvoice
            icon_bg="_color2"
            footerDesc="Awaiting to approval"
            icon={<Icon color="#1fff79" icon={fileText} />}
            amount={detailsResult && detailsResult.awaiting_to_approve}
          />
        </Col>
        <Col
          className="gutter-row"
          xxl={{ span: 6 }}
          xl={{ span: 6 }}
          lg={{ span: 12 }}
          md={{ span: 12 }}
          sm={{ span: 24 }}
          xs={{ span: 24 }}
        >
          <SummaryInvoice
            icon_bg="_color3"
            footerDesc="yesteday’s invoices"
            icon={<Icon color="#3f1fff" icon={fileText} />}
            amount={detailsResult && detailsResult.yesterday_sale}
          />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col
          xxl={{ span: 12 }}
          xl={{ span: 12 }}
          lg={{ span: 24 }}
          md={{ span: 24 }}
          sm={{ span: 24 }}
          xs={{ span: 24 }}
        >
          <P className="invoiceheader default-text">Invioce Flow</P>
          <Card className="_invoicecard">
            <div className="flex  bottom">
              <Select
                size="small"
                showSearch
                style={{ textAlign: "right" }}
                placeholder="Select Time"
                optionFilterProp="children"
                defaultValue={"current_week"}
              >
                <Option value="today">Today</Option>
                <Option value="current_week">Last 10 days</Option>
                <Option value="current_month">This Month</Option>
                <Option value="current_year">This Year</Option>
              </Select>
            </div>
            <DailySalesReportGraph />
          </Card>
        </Col>
        <Col
          xxl={{ span: 12 }}
          xl={{ span: 12 }}
          lg={{ span: 24 }}
          md={{ span: 24 }}
          sm={{ span: 24 }}
          xs={{ span: 24 }}
        >
          <P className="invoiceheader">Draft invoices to process</P>
          <Card className="_invoicecard">
            <DraftInvoices />
          </Card>
        </Col>
      </Row>
      <P className="invoiceheader">All Invoices</P>
      <Row gutter={24}>
        <Col span={24}>
          <Card className="_invoicecard">
            <AllInvoices />
            <div className="flex aligncenter">
              <Button
                type="link"
                size="small"
                className="btnlast"
                onClick={() => {
                  history.push(`/app${ISupportedRoutes.INVOICES}`);
                }}
              >
                Manage Invoices
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </WrappperInvoiceDashboard>
  );
};

const WrappperInvoiceDashboard = styled.div`
  ._invoicecard {
    min-height: ${convertToRem(286)};
    margin-bottom: ${convertToRem(16)};
    .bottom {
      justify-content: flex-end;
      padding-bottom: ${convertToRem(15)};
    }
    .aligncenter {
      justify-content: center;
    }
    .btnlast {
      border: 1px solid;
      margin-top: ${convertToRem(16)};
    }
  }
  .invoiceheader {
    margin-bottom: 0.3125rem;
    margin-left: 0.625rem;
    color: ${(props: IThemeProps) => props?.theme?.colors?.$LIGHT_BLACK};
    font-size: 15px;
    font-weight: 400;
  }
`;
