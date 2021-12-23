/* eslint-disable react-hooks/exhaustive-deps */
import dayjs from 'dayjs';
import * as echarts from 'echarts';
import React, { FC, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';

import { invoiceFlowChartAPI } from '../../../api';
import { useWindowSize } from '../../../utils/useWindowSize';

export const DailySalesReportGraph: FC = () => {
  const [width, height] = useWindowSize();
  const [graphFlowData, setGraphFlowData] = useState({
    labels: [],
    series: [],
  });

  console.log(graphFlowData, 'flowgraph');

  const { data: invoicesSummaryData, isLoading: invoicesSummaryFetching } =
    useQuery([], invoiceFlowChartAPI);
  useEffect(() => {
    renderChart();
  }, [graphFlowData, width, height]);
  useEffect(() => {
    if (
      invoicesSummaryData &&
      invoicesSummaryData.data &&
      invoicesSummaryData.data.result
    ) {
      const { result } = invoicesSummaryData.data;

      setGraphFlowData({
        labels: result.map((item) => {
          return dayjs(item.invoicedate).format('DD MMM');
        }),
        series: result.map((item) => {
          return item.todaysale;
        }),
      });
    }
  }, [invoicesSummaryData]);

  const renderChart = () => {
    const chartDom: any = document.getElementById(`invoice_flow_chart`)!;
    if (chartDom) {
      const myChart = echarts.init(chartDom);

      const option = {
        grid: {
          top: '3%',
          left: '0%',
          right: '0%',
          bottom: '0%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: graphFlowData.labels,
        },
        yAxis: {
          type: 'value',
          width: 9,
        },
        series: [
          {
            data: graphFlowData.series,
            type: 'line',
            smooth: true,
            lineStyle: {
              width: 3,
            },
          },
        ],
      };
      myChart.resize();
      option && myChart.setOption(option);
    }
  };

  return (
    <WrapperDailySalesReportGraph>
      <div
        style={{ height: '200px', width: '100%' }}
        id={`invoice_flow_chart`}
      ></div>
    </WrapperDailySalesReportGraph>
  );
};

const WrapperDailySalesReportGraph = styled.div``;
