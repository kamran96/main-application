/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ISupportedRoutes } from '../../modal';
import { Card } from '../Card';
import { Seprator } from '../Seprator';
import { H4 } from '../Typography';

import { useGlobalContext } from '../../hooks/globalContext/globalContext';
import Icon from '@iconify/react';
import bxPlus from '@iconify-icons/bx/bx-plus';
import * as echarts from 'echarts';
import { useWindowSize } from '../../utils/useWindowSize';
import { useQuery } from 'react-query';
import { InvoicePIEchartAPI } from '../../api';
import { IThemeProps } from '../../hooks/useTheme/themeColors';

export const InvoiceOverview: FC = () => {
  const { routeHistory, theme } = useGlobalContext();
  const { history } = routeHistory;
  const [graphData, setGraphData] = useState([]);
  const [width, height] = useWindowSize();
  const pieWidth = width >= 1200 && width <= 1320 ? '297px' : '333px';

  const { data: responseData, isLoading: isFetching } = useQuery<any>(
    [`pie-chart-maindashboard`],
    InvoicePIEchartAPI
  );

  useEffect(() => {
    if (responseData?.data?.result) {
      const { result } = responseData.data;
      setGraphData(() => {
        return [
          { accessor: 'draftinvoice', label: 'Draft Invoices' },
          {
            accessor: 'awaiting_invoice',
            label: 'Awaiting Payments',
          },
          {
            accessor: 'overdue',
            label: 'Overdue',
          },
        ].map((item, index) => {
          return { value: result[item.accessor], name: item.label };
        });
      });
    }
  }, [responseData]);

  useEffect(() => {
    renderChart();
  }, [width, height, pieWidth, graphData]);
  const renderChart = () => {
    const chartDom: any = document.getElementById(`_invoice_doughnut`)!;

    if (chartDom) {
      const myChart = echarts.init(chartDom);
      const colorPalette = [' #143C69', '#1890FF', '#F5222D'];
      const option = {
        title: [
          {
            text: `Total Invoices \n ${responseData?.data?.result?.total}`,

            textStyle: {
              fontSize: '12',
              fontWeight: 'bold',
              color: theme === 'dark' ? '#C2C2C2' : '#7B7B7B',
            },
            left: '24%',
            top: '42%',
            textAlign: 'center',
          },
        ],
        tooltip: {
          trigger: 'item',
        },
        legend: {
          orient: 'vertical',
          top: 'center',
          right: '0%',
          itemWidth: 8,
          itemHeight: 8,
          textStyle: {
            color: theme === 'dark' ? '#C2C2C2' : '#7B7B7B',
          },
        },
        series: [
          {
            // name: '访问来源',
            type: 'pie',
            radius: ['65%', '90%'],
            avoidLabelOverlap: false,
            // top:'center',
            right: '50%',
            color: colorPalette,
            // width: '100%',
            // height: '145px',

            label: {
              show: false,
              position: 'center',
            },
            emphasis: {
              label: {
                show: false,
                fontSize: '10',
                fontWeight: 'bold',
              },
            },
            labelLine: {
              show: false,
            },
            data: graphData,
          },
        ],
      };
      option && myChart.setOption(option);
    }
  };

  return (
    <WrapperInvoiceOverview>
      <Card className="_invoice_card">
        <div className="flex alignCenter justifySpaceBetween">
          <H4>Invoice details</H4>
          <Button
            onClick={() =>
              history.push({
                pathname: `/app${ISupportedRoutes.CREATE_INVOICE}`,
                state: {
                  from: history.location.pathname,
                },
              })
            }
            type="link"
            size="middle"
            className="flex alignCenter justifySpaceBetween"
          >
            <span className="icon-left flex alignCenter">
              <Icon style={{ fontSize: 18 }} icon={bxPlus} />
            </span>{' '}
            Create new
          </Button>
        </div>
        <Seprator />
        <div className="chartWrapper">
          <div
            style={{ height: '146px', width: pieWidth }}
            id={'_invoice_doughnut'}
          ></div>
          {/* <ul id="data-results-chart-legends" /> */}
        </div>
        <div className="footer flex alignCenter justifyCenter mt-10">
          <Button type="link" size="middle">
            View Details
          </Button>
        </div>
      </Card>
    </WrapperInvoiceOverview>
  );
};

const WrapperInvoiceOverview = styled.div`
  .chartjs-legend {
    list-style-type: none;
    font-size: 0.875rem;
    width: fit-content;
    margin: 0.5rem auto;
  }
  .chartjs-legend li {
    padding: 0.25rem;
  }
  .chartjs-legend .legend-item {
    height: 1.5rem;
    display: flex;
  }
  .chartjs-legend .legend-item .label {
    width: auto;
  }
  .chartjs-legend .legend-item span {
    cursor: pointer;
    margin-right: 0.75rem;
    border-radius: 1.25rem;
    width: 12px;
    height: 12px;
    line-height: 12px;
  }

  .chartWrapper {
    position: relative;

    width: 100%;
    height: 146px;
    /* z-index: 5; */
  }
  .chartWrapper ul {
    position: relative;
    left: 29px;
    top: 4px;
    li {
      color: ${(props: IThemeProps) => props?.theme?.colors?.textTd};
    }
  }

  ._custom_col {
    width: 100%;
  }
  #_invoice_doughnut {
    width: 100%;
  }
`;
