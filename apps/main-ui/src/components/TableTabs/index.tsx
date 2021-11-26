import React, { FC, ReactElement } from 'react';
import styled from 'styled-components';
import { Tabs } from 'antd';
import { useGlobalContext } from '../../hooks/globalContext/globalContext';
import convertToRem from '../../utils/convertToRem';
import { Color } from '../../modal';
import { IThemeProps } from '../../hooks/useTheme/themeColors';

const { TabPane } = Tabs;

interface IProps {
  children?: React.ReactElement<any>;
  onChange?: (key: string | number) => void;
  size?: 'small' | 'default' | 'large';
  defaultkey?: string;
  ref?: any;
  tabBarExtraContent?: ReactElement<any>;
}

const defaultProps: IProps = {
  size: 'small',
  defaultkey: 'draft',
};

export const TableTabs: FC<IProps> = ({
  children,
  onChange,
  size,
  ref,
  tabBarExtraContent,
  defaultkey,
} = defaultProps) => {
  const { routeHistory } = useGlobalContext();
  const onChangeTab = (key) => {
    const location = routeHistory.location.pathname;
    routeHistory.history.push(`${location}?tabIndex=${key}`);
  };

  return (
    <CustomizedTabs
      tabBarExtraContent={tabBarExtraContent}
      onChange={(key) => onChangeTab(key)}
      activeKey={defaultkey}
      type="card"
      size={'small'}
      key={'awating_payment'}
    >
      {children}
    </CustomizedTabs>
  );
};

const CustomizedTabs: any = styled(Tabs)`
  .ant-tabs-nav {
    /* border-bottom: 2px dashed #e4e4e4; */
    padding-bottom: 12px;
  }

  .ant-tabs-top > .ant-tabs-nav::before,
  .ant-tabs-bottom > .ant-tabs-nav::before,
  .ant-tabs-top > div > .ant-tabs-nav::before,
  .ant-tabs-bottom > div > .ant-tabs-nav::before {
    border-bottom: 2px dashed
      ${(props: IThemeProps) => props?.theme?.colors?.buttonTagBg};
  }

  .ant-tabs-tab {
    margin: 0 !important;
    font-style: normal;
    font-weight: normal;
    font-size: 0.8125rem;
    text-transform: uppercase;
    border: none;
    box-sizing: border-box;
    border: 1px solid ${({ theme }: IThemeProps) => theme?.colors?.stroke} !important;
    margin-right: 8px !important;
    padding: ${convertToRem(10)} ${convertToRem(28)};
    transition: 0.3s all ease-in-out;
    .ant-tabs-tab-btn {
      font-style: normal;
      font-weight: normal;
      font-size: ${convertToRem(13)};
      color: ${(props: IThemeProps) => props?.theme?.colors?.$BLACK};
    }
    &:hover {
      border: 1px solid transparent !important;
      background: ${(props: IThemeProps) =>
        props?.theme?.colors?.bgTh} !important;
      .ant-tabs-tab-btn {
        color: ${Color.$WHITE};
      }
    }
  }

  .ant-tabs-tab-active {
    background: ${(props: IThemeProps) =>
      props?.theme?.colors?.bgTh} !important;
    .ant-tabs-tab-btn {
      color: white !important;
    }
  }
`;

interface ITabsContentProps {
  children: React.ReactElement<any> | string | number;
  tab: string;
  key: string | number;
}

export const TableTabsContent: FC<ITabsContentProps> = (props) => {
  return <WrapperTabsContent {...props}>{props.children}</WrapperTabsContent>;
};

const WrapperTabsContent: any = styled(TabPane)``;
