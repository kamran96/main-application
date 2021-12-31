import { Select } from 'antd';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import CSS from 'csstype';
import React, { FC, ReactElement } from 'react';

interface IProps {
  className?: string;
  loading?: boolean;
  size?: SizeType;
  labelInValue?: boolean;
  showSearch?: boolean;
  style?: CSS.Properties;
  placeholder?: string;
  optionFilterProp?: string | 'children';
  onChange?: (value: any, option: any) => void;
  children?: ReactElement<any>;
  onClick?: () => void;
  value?: any;
  [key: string]: any;
}

export const Option = Select.Option;

export const CommonSelect: FC<IProps> = ({
  className,
  loading,
  size,
  labelInValue,
  showSearch,
  style,
  placeholder,
  optionFilterProp,
  onChange,
  children,
  onClick,
  value,
  ...rest
}) => {
  return (
    <Select
      onFocus={onClick}
      className={className}
      loading={loading}
      size={size}
      labelInValue={labelInValue}
      showSearch={showSearch}
      style={style}
      placeholder={placeholder}
      optionFilterProp={optionFilterProp}
      onChange={onChange}
      value={value}
      {...rest}
    >
      {children}
    </Select>
  );
};

export default CommonSelect;
