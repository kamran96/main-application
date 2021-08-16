import React, { FC, ReactElement } from "react";
import styled from "styled-components";
import { Tabs } from "antd";
import { useGlobalContext } from "../../hooks/globalContext/globalContext";
import convertToRem from "../../utils/convertToRem";
import { Color } from "../../modal";
import { IThemeProps } from "../../hooks/useTheme/themeColors";

const { TabPane } = Tabs;

interface IProps {
  children?: React.ReactElement<any>;
  onChange?: (key: string | number) => void;
  size?: "small" | "default" | "large";
  defaultkey?: string;
  ref?: any;
  tabBarExtraContent?: ReactElement<any>;
}

const defaultProps: IProps = {
  size: "small",
  defaultkey: "draft",
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
    let location = routeHistory.location.pathname;
    routeHistory.history.push(`${location}?tabIndex=${key}`);
  };

  return (
    <WrapperTabs ref={ref}>
      {/* <button onClick={()=> setDefaultKey(`awating_aproval`)}>check</button> */}
      <Tabs
        tabBarExtraContent={tabBarExtraContent}
        onChange={(key) => onChangeTab(key)}
        activeKey={defaultkey}
        type="card"
        size={"small"}
        key={"awating_payment"}
      >
        {children}
      </Tabs>
    </WrapperTabs>
  );
};

const WrapperTabs: any = styled.div`
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
    background: #ffffff;
    border: none;
    box-sizing: border-box;
    border-radius: 5px;
    margin-right: 8px !important;
    border-radius: 5px !important;
    padding: ${convertToRem(10)} ${convertToRem(28)};
    transition: 0.3s all ease-in-out;
    .ant-tabs-tab-btn {
      font-style: normal;
      font-weight: normal;
      font-size: ${convertToRem(13)};
      color: ${Color.$BLACK};
    }
    &:hover {
      background: #aeaeae !important;
      .ant-tabs-tab-btn {
        color: ${Color.$WHITE};
      }
    }
  }

  .ant-tabs-tab-active {
    background: #aeaeae !important;
    .ant-tabs-tab-btn {
      color: ${Color.$WHITE};
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
