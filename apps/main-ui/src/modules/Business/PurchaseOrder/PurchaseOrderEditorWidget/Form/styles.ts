import { IThemeProps } from './../../../../../hooks/useTheme/themeColors';
import styled from 'styled-components';

import convertToRem from '../../../../../utils/convertToRem';

export const WrapperPurchaseOrderForm = styled.div`
  .row-dragging {
    background: #fafafa;
    border: 1px solid #ccc;
  }

  .row-dragging td {
    padding: 16px;
    visibility: hidden;
  }

  .row-dragging .drag-visible {
    visibility: visible;
  }
  .ref_header {
    /* padding: ${convertToRem(19)} ${convertToRem(26)}; */
    border-bottom: ${convertToRem(0)};
    box-sizing: border-box;
    border-radius: ${convertToRem(5)} ${convertToRem(5)} 0 0;
  }

  .custom_col {
    padding: 0 ${convertToRem(6)} !important;
  }

  .ant-form-item-explain {
    position: absolute;
    right: 0;
    top: -${convertToRem(22)};
  }

  .ant-form-item {
    margin-bottom: ${convertToRem(13)};
  }

  .quick_access {
    position: relative;
    top: ${convertToRem(2)};
  }
  .quick_access_head {
    font-style: normal;
    font-weight: normal;
    font-size: ${convertToRem(16)};
    line-height: ${convertToRem(19)};
    letter-spacing: 0.04em;
    color: #2e2d2d;
    padding: ${convertToRem(13)} 0;
  }
  .quick_item_wrapper {
    border: ${convertToRem(1)} solid
      ${(props: IThemeProps) => props?.theme?.colors?.seprator};
    box-sizing: border-box;
    border-radius: ${convertToRem(6)};
    min-height: ${convertToRem(378)};
    background-color: ${(props: IThemeProps) =>
      props?.theme?.colors?.sidebarBg};
    padding: ${convertToRem(2)} 0;
  }

  p {
    margin-bottom: 0;
    color: ${(props: IThemeProps) => props?.theme?.colors?.sidebarDefaultText};
  }

  .actions {
    button {
      padding: 0 ${convertToRem(25)};
    }
  }

  ._col_border_lft {
    border-left: 1px solid #e4e4e4;
  }
`;
