import { IThemeProps } from './../../../shared/invyce-theme/src/types/index';
import { convertToRem } from '@invyce/pixels-to-rem';
import styled from 'styled-components';
import { Scrollable } from './editable-table';

type DivProps = JSX.IntrinsicElements['div'];
interface IWrapperProps extends DivProps {
  scrollable: any;
}

export const EditableTableWrapper = styled.table<IWrapperProps>`
  width: 100%;

  ${(props: IWrapperProps) =>
    props?.scrollable &&
    `
    overflow-y: scroll;
    max-height: ${convertToRem(props?.scrollable?.offsetY)};
    display: block;

    thead{
        position: sticky !important;
    top: -1px;
    z-index: 222;
    }


`}

.ant-table-thead > tr > th {
    padding: 9px 16px;
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
    background-color: ${(props: IThemeProps) =>
      props?.theme?.colors?.td} !important;
  }



  .ant-table-thead > tr > th, .ant-table-tbody > tr > td, .ant-table tfoot > tr > th, .ant-table tfoot > tr > td {
    padding: 9px 16px;
  }
`;
