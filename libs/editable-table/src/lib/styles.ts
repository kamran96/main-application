import { IThemeProps } from '@invyce/shared/invyce-theme';
import { convertToRem } from '@invyce/pixels-to-rem';
import styled from 'styled-components';

type DivProps = JSX.IntrinsicElements['div'];
interface IWrapperProps extends DivProps {
  scrollable: any;
}

export const EditableTableWrapper = styled.div<IWrapperProps>`
  ${(props: IWrapperProps) =>
    props?.scrollable &&
    `
      overflow-y: auto;
      max-height: ${convertToRem(props?.scrollable?.offsetY)};
      // display: block;
  
      table thead{
          position: sticky !important;
      top: -2px;
      z-index: 222;
      }


`}

  table {
    width: 100%;
    display: table;

    .ant-table-thead > tr > th {
      padding: 9px 16px;
      background: ${(props: IThemeProps) =>
        props?.theme?.theme === 'dark' ? props?.theme?.colors?.bgTh : ''};
    }
    .ant-table-thead {
      tr {
        .ant-table-cell {
          font-style: normal;
          font-weight: normal;
          font-size: ${convertToRem(13)};
          line-height: ${convertToRem(16)};
          letter-spacing: 0.04em;
          text-transform: capitalize;
          border-top: ${convertToRem(1)} solid
            ${(props: IThemeProps) => props?.theme?.colors?.seprator};
          border-bottom: ${convertToRem(1)} solid
            ${(props: IThemeProps) => props?.theme?.colors?.seprator};
        }
      }
    }
    .ant-table-tbody > tr > td {
      border-bottom: 1px solid
        ${(props: IThemeProps) => props?.theme?.colors?.seprator};
      color: ${(props: IThemeProps) => props?.theme?.colors?.textTd};
      padding: 13px 16px;
      background-color: ${(props: IThemeProps) => props?.theme?.colors?.td};
    }

    .ant-table-thead > tr > th,
    .ant-table-tbody > tr > td,
    .ant-table tfoot > tr > th,
    .ant-table tfoot > tr > td {
      padding: 9px 16px;
    }
  }
`;
