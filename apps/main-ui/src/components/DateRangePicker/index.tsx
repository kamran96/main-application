import { DatePicker, Select } from "antd";
import React, { FC, useState } from "react";
import styled from "styled-components";

const { Option } = Select;

const { RangePicker } = DatePicker;

const dateFormat = "YYYY/MM/DD";

interface IDateRangePicker {
  size?: "small" | "middle" | "larget";
  onChange?: (payload: any) => void;
}

function PickerWithType({ type, onChange }) {
  if (type === "custom")
    return (
      <RangePicker
        onChange={onChange}
        style={{ width: "100%" }}
        size="large"
        format={dateFormat}
      />
    );
  if (type === "date") return <DatePicker onChange={onChange} />;
  return (
    <DatePicker style={{ width: "100%" }} picker={type} onChange={onChange} />
  );
}

export const CommonDateRangePicker: FC<IDateRangePicker> = () => {
  const [type, setType] = useState("date");

  return (
    <WrapperDateRange>
      <Select value={type} onChange={(val) => setType(val)}>
        <Option value="date">Date</Option>
        <Option value="week">Week</Option>
        <Option value="month">Month</Option>
        <Option value="quarter">Quarter</Option>
        <Option value="year">Year</Option>
        <Option value="custom">Custom</Option>
      </Select>
      <PickerWithType type={type} onChange={(value) => console.log(value)} />
    </WrapperDateRange>
  );
};

const WrapperDateRange = styled.div``;
