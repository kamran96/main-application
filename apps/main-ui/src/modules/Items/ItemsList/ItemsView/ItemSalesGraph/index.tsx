import React, { FC, useEffect, useState } from "react";
import styled from "styled-components";

import { Card } from "../../../../../components/Card";
import { Seprator } from "../../../../../components/Seprator";
import dayjs from "dayjs";
import { useQuery } from "react-query";
import { getSalesSummaryDataAPI } from "../../../../../api";
import { useWindowSize } from "../../../../../utils/useWindowSize";

/* Echarts */
import * as echarts from "echarts";
import { P } from "../../../../../components/Typography";

interface IProps {
  id?: number;
}

export const ItemSalesGraph: FC<IProps> = ({ id }) => {
  const [graphData, setGraphData] = useState({
    labels: [],
    series: [],
  });

  const [width, height] = useWindowSize();

  const { data: salesSummaryData, isLoading: salesSummaryFetching } = useQuery(
    [
      `item-sales-summay-${id}`,
      {
        id,
      },
    ],
    getSalesSummaryDataAPI,
    {
      enabled: id,
      cacheTime: Infinity,
    }
  );

  useEffect(() => {
    if (
      salesSummaryData &&
      salesSummaryData.data &&
      salesSummaryData.data.result
    ) {
      const { result } = salesSummaryData.data;

      setGraphData({
        labels: result.map((item) => {
          return dayjs(item.saledate).format("DD MMM");
        }),
        series: result.map((item) => {
          return { value: item.saleamount, itemStyle: { color: "#1890FF" } };
        }),
      });
    }
  }, [salesSummaryData]);

  const renderChart = () => {
    let chartDom: any = document.getElementById("sales_chart")!;

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
          bottom: "0%",
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
            barWidth: "10%",
            data: graphData.series,
          },
        ],
      };

      myChart.resize();
      option && myChart.setOption(option);
    }
  };

  useEffect(() => {
    renderChart();
  }, [graphData, width, height]);

  return (
    <WrapperItemSalesGraph hasNoData={!graphData.series.length}>
      <Card className="_salesitemcard">
        <div className="flex justifySpaceBetween">
          <h4>Sales by Item</h4>
          <P style={{ color: `#6e6e6d` }}>Last 7 days</P>
          {/* <CustomDateRange
            size="small"
            onChange={(dates) => {
              if (dates && dates.length) {
                setAPIConfig({ ...apiConfig, start: dates[0], end: dates[1] });
              } else {
                setAPIConfig({
                  ...apiConfig,
                  start: dayjs().startOf("week"),
                  end: dayjs(),
                });
              }
            }}
          /> */}
        </div>
        <Seprator />
        <div style={{ minHeight: "200px", width: "100%" }} id={`sales_chart`}>
          <div>No data found</div>
        </div>
      </Card>
    </WrapperItemSalesGraph>
  );
};
type DivProps = JSX.IntrinsicElements['div']

interface WrapperItemsSalesGraph extends DivProps {
  hasNoData?: boolean;
}

const WrapperItemSalesGraph = styled.div<WrapperItemsSalesGraph>`
  #sales_chart {
    position: relative;
  }
  #sales_chart::after {
    position: absolute;
    content: "No Record Found";
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: white;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #6e6e6d;
    display: flex;
    transition: 0.4s all ease-in-out;
    visibility: ${(props: any) => (props.hasNoData ? "visible" : "hidden")};
  }
`;
