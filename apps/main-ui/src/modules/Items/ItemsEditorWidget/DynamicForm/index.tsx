import React, { FC } from "react";
import { Input, Select } from "antd";
import styled from "styled-components";

import { IVariants } from "../../../../modal/categories";
import convertToRem from "../../../../utils/convertToRem";

const { Option } = Select;

interface IProps {
  item: IVariants;
  onChange: (value) => void;
  value?: any;
}

export const DynamicForm: FC<IProps> = ({ item, onChange, value }) => {
  const renderForm = (item: IVariants) => {
    switch (item.valueType) {
      case "INPUT":
        return (
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            size="middle"
          />
        );
      case "DROPDOWN":
        return (
          <Select
            allowClear
            onClear={() => {
              onChange("");
            }}
            value={value}
            size="middle"
            showSearch
            style={{ width: "100%" }}
            placeholder="Select Type"
            optionFilterProp="children"
            onChange={(val) => onChange(val)}
          >
            {item.values &&
              item.values.map((item, index) => {
                return <Option value={item}>{item}</Option>;
              })}
          </Select>
        );
      default:
        return null
        break;
    }
  };

  return <WrapperDynamicForm>{renderForm(item)}</WrapperDynamicForm>;
};
const WrapperDynamicForm = styled.div`
  margin-bottom: ${convertToRem(24)};
`;
