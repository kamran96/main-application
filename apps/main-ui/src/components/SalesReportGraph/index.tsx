import React, { FC, useEffect, useState } from "react";
import styled from "styled-components";

import { Card } from "../Card";
import { Color } from "../../modal";
import * as echarts from "echarts";
import { useWindowSize } from "../../utils/useWindowSize";
import { SalesOverviewGraphAPI } from "../../api/mainDashboard";
import { useQuery } from "react-query";
import dayjs from "dayjs";
import { H4 } from "../Typography";
import { Seprator } from "../Seprator";
import { IThemeProps } from "../../hooks/useTheme/themeColors";

export const SalesReportGraph: FC = () => {
  const [width, height] = useWindowSize();
  const [graphData, setGraphData] = useState({
    labels: [],
    series: [],
  });
  const { data: salesGraphData, isLoading: salesGraphLoading } = useQuery(
    [`sales-graph-report`],
    SalesOverviewGraphAPI
  );

  useEffect(() => {
    if (salesGraphData?.data?.result) {
      const { result } = salesGraphData.data;
      setGraphData({
        labels: result.map((item, index) => {
          return dayjs(item.date).format("ddd");
        }),
        series: result.map((item, index) => {
          return { value: item.todaySale, itemStyle: { color: "#1890FF" } };
        }),
      });
    }
  }, [salesGraphData]);

  useEffect(() => {
    renderChart();
  }, [width, height, graphData]);

  let chartHeight = width <= 1200 && width >= 768 ? "171px" : "250px";

  const renderChart = () => {
    const chartDom: any = document.getElementById(`sales_chart_card`)!;
    if (chartDom) {
      var myChart = echarts.init(chartDom);
      var option;
      option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          top: "5%",
          left: "2%",
          right: "2%",
          bottom: "2%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: graphData.labels,
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "Sales",
            type: "bar",
            barWidth: "20%",
            data: graphData.series,
          },
        ],
      };
      myChart.resize();
      option && myChart.setOption(option);
    }
  };

  // console.log()
  return (
    <WrapperSlaesReportGraph
      heightConfig={chartHeight}
      hasData={salesGraphData?.data?.result.length ? true : false}
    >
      <Card className="chart_card">
        <H4>Sales by Day</H4>
        <Seprator />
        <div className="chart_area">
          <div
            style={{ height: chartHeight, width: "100%" }}
            id={`sales_chart_card`}
          ></div>
        </div>
      </Card>
    </WrapperSlaesReportGraph>
  );
};

const WrapperSlaesReportGraph = styled.div`
  .chart_area {
    max-height: 250px;
  }
  #sales_chart_card {
    position: relative;
    &::after {
      position: absolute;
      content: "No Data Found";
      font-size: 16px;
      font-weight: 400;
      left: 0;
      top: 0;
      display: flex;
      align-items: center;
      width: 100%;
      height: 100%;
      justify-content: center;
      color: #bfbfbf;
      background: ${(props: IThemeProps) => props?.theme?.colors?.sidebarBg};

      z-index: ${(props: any) => (props.hasData ? -1 : 1)};
    }
  }
`;
