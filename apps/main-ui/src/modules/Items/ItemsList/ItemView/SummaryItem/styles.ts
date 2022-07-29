import { IThemeProps } from '@invyce/shared/invyce-theme';
import styled from 'styled-components';
import convertToRem from '../../../../../utils/convertToRem';
import { Drawer } from 'antd';

export const WrapperItemsView = styled.div`
  ._itemviewcard {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    margin-bottom: ${convertToRem(16)};
    .item_amount {
      font-size: ${convertToRem(16)};
      line-height: ${convertToRem(24)};
      font-weight: 400;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: ${convertToRem(7)} 0;
      color: ${(props: IThemeProps) => props?.theme?.colors?.$TEXT};
    }
  }

  ._itemdetailcard {
    min-height: ${convertToRem(272)};
    background: ${(props: IThemeProps) => props?.theme?.colors?.cardBg};
    margin-bottom: ${convertToRem(16)};
    h4 {
      // margin-left: ${convertToRem(20)};
      margin-bottom: ${convertToRem(23)};
    }
    p {
      font-size: ${convertToRem(16)};
      margin-bottom: ${convertToRem(23)};
    }
  }
  ._salesitemcard {
    background: ${(props: IThemeProps) => props?.theme?.colors?.cardBg};
    min-height: ${convertToRem(272)};
    margin-bottom: ${convertToRem(16)};
  }
  ._topitemcard {
    margin-bottom: ${convertToRem(16)};
    background: ${(props: IThemeProps) => props?.theme?.colors?.cardBg};
    min-height: ${convertToRem(310)};
  }
  ._otherlinkcard {
    margin-bottom: ${convertToRem(16)};
    min-height: ${convertToRem(310)};
    background: ${(props: IThemeProps) => props?.theme?.colors?.cardBg};
    .datalinkcard {
      margin-bottom: ${convertToRem(26)};
      margin-top: ${convertToRem(26)};
      a {
        margin-left: ${convertToRem(16)};
      }
    }
  }

  ._color {
    background: #00b9ff30;
  }
  ._color1 {
    background: #fbcf323b;
  }
  ._color2 {
    background: rgba(0, 245, 98, 0.233);
  }
  ._color3 {
    background: rgba(38, 0, 255, 0.212);
  }
`;

export const ItemDrawer = styled(Drawer)`
  .ant-drawer-body {
    padding-top: 0px;
  }
`;
