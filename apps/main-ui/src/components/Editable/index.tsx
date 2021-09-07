import React, { FC, useEffect, useState, ReactElement } from "react";
import { Input, InputNumber } from "antd";
import { SizeType } from "antd/lib/config-provider/SizeContext";
import { ClickOutSide } from "./../../utils/clickoutside";
import { LiteralUnion } from "antd/lib/_util/type";
import styled from "styled-components";
import { P } from "../Typography";
import CommonSelect from "../CommonSelect";
import { Select } from "antd";
import CSS from "csstype";
import { isString } from "../../utils/helperFunctions";
interface IProps {
  onChange?: (e: any) => void;
  size?: SizeType;
  defaultValue?: string | number;
  type?: LiteralUnion<
    | "button"
    | "checkbox"
    | "color"
    | "date"
    | "datetime-local"
    | "email"
    | "file"
    | "hidden"
    | "image"
    | "month"
    | "number"
    | "password"
    | "radio"
    | "range"
    | "reset"
    | "search"
    | "submit"
    | "tel"
    | "text"
    | "time"
    | "url"
    | "week",
    string
  >;
  placeholder?: string;
  disabled?: boolean;
  value?: any;
  onClick?: () => void;
  reg?: any;
}

export const Editable: FC<IProps> = ({
  onChange,
  size,
  defaultValue,
  type,
  placeholder,
  disabled,
  value,
  onClick,
  reg,
}) => {
  const [isEditable, setIsEditable] = useState(false);
  const [inputVal, setInputValue] = useState(value);

  useEffect(() => {
    if (value !== inputVal) {
      setInputValue(value);
    }
  }, [value]);

  let styles = {
    border: isEditable ? "1px solid transparent" : "1px solid transparent",
    background: isEditable ? "#fff" : "transparent",
    cursor: "pointer",
  };

  const inputRef = React.useRef<any>(null);

  return (
    <ClickOutSide
      initialVal={isEditable}
      notEffectingClass={`rendered-text`}
      onClickOutSide={() => {
        if (isEditable === true) {
          setIsEditable(false);
        }
      }}
    >
      <WrapperEditable>
        <>
          {type === "number" ? (
            isEditable ? (
              <InputNumber
                ref={inputRef}
                onChange={(val) => {
                  setInputValue(val);
                  onChange(val);
                }}
                placeholder={placeholder}
                type={type}
                style={styles}
                size={size}
                autoFocus
                disabled={disabled}
                value={
                  type === "number"
                    ? typeof value === "string"
                      ? parseFloat(inputVal)
                      : inputVal
                    : inputVal
                }
              />
            ) : (
              <span
                className="rendered-text"
                onClick={() => setIsEditable(true)}
              >
                {inputVal ? inputVal : placeholder ? placeholder : 0} 
              </span>
            )
          ) : isEditable ? (
            <Input
              ref={inputRef}
              disabled={disabled}
              onChange={(e) => {
                let val = e.target.value;
                setInputValue(val);
                onChange(e);
              }}
              placeholder={placeholder}
              type={type}
              style={styles}
              size={size}
              value={inputVal}
              autoFocus
            />
          ) : (
            <span className="rendered-text" onClick={() => setIsEditable(true)}>
              {inputVal ? inputVal : placeholder} 
            </span>
          )}
        </>
      </WrapperEditable>
    </ClickOutSide>
  );
};

export const WrapperEditable = styled.div`
  overflow: hidden;
  input {
    border: 1px solid transparent;
  }
  &:hover {
    .input-para {
      border: 1px solid #d9d9d9 !important;
    }
  }
  input:hover {
    border: 1px solid #d9d9d9 !important;
  }

  .input-para {
    width: 100%;
    height: 100%;
    border: 1px solid transparent;
    border-radius: 5px;
    padding: 7px 12px;
    min-height: 31px;
    p {
      margin: 0;
      font-size: 15px;
      font-weight: 400;
    }
  }
  .ant-input-number {
    width: 100% !important;
    border-radius: 5px;
  }
  .rendered-text {
    height: 100%;
    color: #626262;
    padding: 8px 11px;
    display: block;
    border: 1px solid transparent;
    -webkit-transition: 0.3s all ease-in-out;
    transition: 0.3s all ease-in-out;
    border-radius: 5px;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-height: 32px;
  }

  &:hover {
    .rendered-text {
      border: 1px solid #d9d9d9 !important;
    }
  }
`;

interface IEditableSelectProps {
  className?: string;
  loading?: boolean;
  size?: SizeType;
  labelInValue?: boolean;
  showSearch?: boolean;
  style?: CSS.Properties;
  placeholder?: string;
  optionFilterProp?: string | "children";
  onChange?: (payload: any) => void;
  children?: ReactElement<any>;
  onClick?: () => void;
  value?: any;
}

export const Option = Select.Option;

export const EditableSelect: FC<IEditableSelectProps> = ({
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
}) => {
  const [isEditable, setIsEditable] = useState(false);
  const [selectValue, setSelectValue] = useState(value);

  useEffect(() => {
    setSelectValue(value);
  }, [value]);

  const renderValue = () => {
    if (isString(selectValue)) {
      return selectValue;
    } else if (selectValue?.children) {
      return selectValue?.children;
    } else if (selectValue?.label) {
      return selectValue?.label;
    } else {
      return placeholder ? placeholder : "Select from dropdown";
    }
  };

  return (
    <ClickOutSide
      initialVal={isEditable}
      onClickOutSide={() => setIsEditable(false)}
      notEffectingClass={`rendered-text`}
      timeout={100}
    >
      <WrapperEditableSelect>
        {isEditable ? (
          <Select
            open={isEditable}
            onFocus={onClick}
            onClick={onClick}
            className={className}
            loading={loading}
            size={size}
            labelInValue={labelInValue}
            showSearch={showSearch}
            style={style}
            placeholder={placeholder}
            optionFilterProp={optionFilterProp}
            onChange={(val: any, option: any) => {
              setSelectValue(option);
              console.log({ val, option }, "value");
              if (onChange) {
                onChange(option);
              }
              setIsEditable(false);
            }}
            value={labelInValue ? selectValue : selectValue?.value}
            autoFocus
          >
            {children}
          </Select>
        ) : (
          <span onClick={() => setIsEditable(true)} className="rendered-text">
            {renderValue()} 
          </span>
        )}
      </WrapperEditableSelect>
    </ClickOutSide>
  );
};

const WrapperEditableSelect = styled.div`
  overflow: hidden;
  .rendered-text {
    font-size: 14px;
    color: #626262;
    padding: 8px 11px;
    display: block;
    border: 1px solid transparent;
    transition: 0.3s all ease-in-out;
    border-radius: 5px;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
  }

  &:hover {
    .rendered-text {
      border: 1px solid #d9d9d9 !important;
    }
  }
`;

export default CommonSelect;
