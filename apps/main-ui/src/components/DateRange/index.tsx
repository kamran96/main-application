import dayjs from "dayjs";
import React, { FC } from "react";
import styled from "styled-components";
import { DatePicker } from "../DatePicker";

const { RangePicker } = DatePicker;
interface IProps {
  onChange?: (paylod?: any) => void;
  size?: "large" | "middle" | "small";
  value?: any;
  style?: any;
  format?: string;
}

export const CustomDateRange: FC<IProps> = ({
  onChange,
  size = "middle",
  value,
  style,
  format = "YYYY/MM/DD",
}) => {
  // const days = function (month, year) {
  //   return new Date(year, month, 0).getDate();
  // };

  // const getDate = () => {
  //   let date = new Date();
  //   let currentMonth = date.getMonth() + 1;
  //   let currentYear = date.getFullYear();
  //   let daysInCurrentMonth = days(currentMonth, currentYear);
  //   let daysFromStartMonth = daysInCurrentMonth - date.getDay();

  //   let everyMonthDaysArray = [];

  //   for (let i = 1; i <= currentMonth; i++) {
  //     everyMonthDaysArray.push(days(i, currentYear));
  //   }

  //   let daysFromStartOfCurrYear =
  //     everyMonthDaysArray.length &&
  //     everyMonthDaysArray.reduce((a, b) => a + b) - date.getDay();

  //   return {
  //     daysLeft: date.getDay(),
  //     month: currentMonth,
  //     year: currentYear,
  //     daysInCurrentMonth,
  //     daysFromStartMonth,
  //     daysFromStartOfCurrYear,
  //   };
  // };

  // const getDateValue = (days) => {
  //   let endDate = new Date();

  //   let startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);

  //   return {
  //     startDate,
  //     endDate,
  //   };
  // };

  console.log(value, "check value")

  return (
    <WrapperParent>
      <RangePicker
        // value={value}
        style={style}
        format={format}
        dropdownClassName="customized-dropdown"
        onChange={onChange}
        ranges={{
          Today: [dayjs(), dayjs()],
          "This Week": [dayjs().startOf("week"), dayjs()],
          "Last 10 Days": [dayjs().subtract(9, "day"), dayjs()],
          "This Month": [dayjs().startOf("month"), dayjs()],
          "Last Month": [
            dayjs().subtract(1, "month").startOf("month"),
            dayjs().subtract(1, "month").endOf("month"),
          ],
          "This Year": [dayjs().startOf("year"), dayjs()],
          "Last Year": [
            dayjs().subtract(1, "year").startOf("year"),
            dayjs().subtract(1, "year").endOf("year"),
          ],
        }}
        size={size}
      />
    </WrapperParent>
  );
};

const WrapperParent = styled.div`
  padding: 0 5px;
`;
