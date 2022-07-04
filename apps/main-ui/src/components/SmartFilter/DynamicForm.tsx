import React from 'react';
import { FilterType } from '../../modal';
import { FormLabel } from '../FormLabel';
import { Input, Radio, Select } from 'antd';
import styled from 'styled-components';
import convertToRem from '../../utils/convertToRem';
import { DatePicker } from '../DatePicker';
import dayjs from 'dayjs';
import { CustomDateRange } from '../DateRange';

const { Option } = Select;

const dateFormat = 'YYYY/MM/DD';

export default function (item, initialState, change) {
  switch (item.type) {
    case FilterType.SEARCH:
      return (
        <WrapperDyFrom>
          <FormLabel className="label">{item.label}</FormLabel>
          <Input
            value={initialState}
            onChange={(e) => change(e.target.value)}
            placeholder={`Search with ${item.label}`}
            autoComplete="off"
          />
        </WrapperDyFrom>
      );
    case FilterType.JOIN:
      return (
        <WrapperDyFrom>
          <FormLabel className="label">{item.label}</FormLabel>
          <Input
            value={initialState}
            onChange={(e) => change(e.target.value)}
            placeholder={`Search with ${item.label}`}
            autoComplete="off"
          />
        </WrapperDyFrom>
      );
    case FilterType.EQUALSTO:
      return (
        <WrapperDyFrom>
          <FormLabel className="label">{item.label}</FormLabel>
          <Input
            value={initialState}
            onChange={(e) => change(e.target.value)}
            placeholder={`Search with ${item.label}`}
            autoComplete="off"
          />
        </WrapperDyFrom>
      );
    case FilterType.DATE_BETWEEN:
      return (
        <WrapperDyFrom>
          <FormLabel className="label">{item.label}</FormLabel>
          <CustomDateRange
            // value={initialState}
            onChange={(val) => {
              if (val?.length) {
                const payload = val.map((date) => {
                  return dayjs(date).format('YYYY-MM-DD');
                });
                change(payload);
              } else {
                change('');
              }
            }}
            style={{ width: '100%' }}
            size="middle"
            format={dateFormat}
          />
        </WrapperDyFrom>
      );
    case FilterType.DATE_IN:
      return (
        <WrapperDyFrom>
          <FormLabel className="label">{item.label}</FormLabel>
          <DatePicker
            size={'middle'}
            value={initialState && dayjs(initialState)}
            onChange={(value) => {
              if (value) {
                change(value);
              } else {
                change('');
              }
            }}
            style={{ width: '100%' }}
            format={dateFormat}
          />
        </WrapperDyFrom>
      );
    case FilterType.COMPARE:
      const allValues = item.value.map((child, index) => {
        return child.value;
      });
      return (
        <WrapperDyFrom>
          <FormLabel className="label">{item.label}</FormLabel>

          <Radio.Group
            value={initialState ? initialState : ''}
            onChange={(e) => change(e.target.value)}
            name="radiogroup"
          >
            {item.value.map((child, index) => {
              return (
                <Radio key={index} value={child.value}>
                  {child.name}
                </Radio>
              );
            })}
            {allValues.length && (
              <Radio value={`${allValues}`}>
                {allValues.length < 2 ? 'All' : 'both'}
              </Radio>
            )}
          </Radio.Group>
        </WrapperDyFrom>
      );
    case FilterType.LIST_IDS:
      return (
        <WrapperDyFrom>
          <FormLabel>{item.label}</FormLabel>
          <Select
            showSearch
            value={initialState}
            onChange={(val) => change(val)}
            style={{ width: `100%` }}
            optionFilterProp="children"
          >
            {item.value.map((option, index) => {
              return (
                <Option key={index} value={option.id}>
                  {option.name}
                </Option>
              );
            })}
          </Select>
        </WrapperDyFrom>
      );
    default:
      return null;
      break;
  }
}

export const WrapperDyFrom = styled.div`
  margin: 10px 0;
  .label {
    margin: ${convertToRem(10)} 0 ${convertToRem(2)} 0;
  }
`;
