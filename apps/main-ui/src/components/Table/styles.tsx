import styled from 'styled-components';
import { IThemeProps } from '../../hooks/useTheme/themeColors';
import { Color } from '../../modal';
import convertToRem from '../../utils/convertToRem';

export const WrapperTable = styled.div`
  overflow-x: auto;
  /* border-left: ${convertToRem(1)} solid #e8e8e8;
 border-right: ${convertToRem(1)} solid #e8e8e8; */

  .footer-border {
    /* border-bottom: ${convertToRem(1)} solid #e8e8e8; */
  }
  .table_top {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    /* padding: 0 ${convertToRem(10)}; */
  }

  .ant-table {
    background-color: transparent !important;
  }

  .ant-table-container table > thead > tr th {
    transition: 0.3s all ease-in-out;
  }
  /* .ant-table-thead th.ant-table-column-has-sorters:hover {
    background-color: #376da9;
  } */

  .ant-table-container table > thead > tr:first-child th:first-child {
    border-top-left-radius: ${convertToRem(0)};
  }
  .ant-table-container table > thead > tr:first-child th:last-child {
    border-top-right-radius: ${convertToRem(0)};
  }
  .ant-table-column-sorters {
    padding: 0;
  }
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
          ${(props: IThemeProps) => props.theme.colors.seprator};
        border-bottom: ${convertToRem(1)} solid
          ${(props: IThemeProps) => props.theme.colors.seprator};
      }
    }
  }
  .ant-table-tbody > tr > td {
    border-bottom: 1px solid
      ${(props: IThemeProps) => props.theme.colors.seprator};
    color: ${(props: IThemeProps) => props.theme.colors.textTd};
    padding: 13px 16px;
    background-color: ${(props: IThemeProps) =>
      props.theme.colors.td} !important;
  }
  /* .ant-table-tbody > tr:nth-child(even) > td {
  }
.ant-table-tbody > tr:nth-child(odd) > td {
  background-color: #f7fcff !important;
} */

  .ant-table-tbody > tr > td {
    font-style: normal;
    font-weight: normal;
    font-size: ${convertToRem(13)};
    line-height: ${convertToRem(15)};
    letter-spacing: 0.04em;
  }

  /* pagination */

  .ant-pagination {
    background: transparent;
    padding: ${convertToRem(20)} ${convertToRem(23)};
    margin: ${convertToRem(4)} 0 !important;
  }

  /* Footer */
  .footer {
    position: ${(props: any) => (props.pagination ? 'absolute' : 'unset')};
    top: ${(props: any) => (props.pagination ? convertToRem(-72) : 'unset')};
    tr > td {
      padding: ${convertToRem(20)} 0;
    }
    .total_count {
      margin: 0;
      letter-spacing: 0.04em;
      text-transform: capitalize;
      font-style: normal;
      font-weight: normal;
      font-size: ${convertToRem(14)};
      color: #bdbdbd;
      padding: 0 ${convertToRem(25)};
    }
  }

  .ant-table-cell-scrollbar {
    display: none;
  }

  ._exportable_button {
    button {
      background: ${(props: IThemeProps) => props?.theme?.colors?.buttonTagBg};
      color: ${(props: IThemeProps) => props?.theme?.colors?.buttonTagColor};
      border: none;
      outline: none;

      &:hover {
        background: ${Color.$Secondary};
        color: ${Color.$WHITE};
        border: none;
        outline: none;
      }
    }
  }
  ._exportable_button.disabled {
    button {
      background: ${(props: IThemeProps) =>
        props?.theme?.colors?.buttonTagBg} !important;
      color: ${(props: IThemeProps) => props?.theme?.colors?.buttonTagColor};
      border: none;
      outline: none;
    }
  }

  ::-webkit-scrollbar {
    width: 10px !important;
    background-color: #f5f5f5;
  }

  ${(props) =>
    props.scrollabletable &&
    ` div.ant-table-body {
    overflow-y: scroll;
    max-height: calc(100vh - 360px) !important;
  }`} /* .ant-table-tbody > tr.ant-table-row:hover > td {
    background: ${(props: IThemeProps) =>
    props.theme.colors.tableRowHover} !important;
  } */

  .ant-skeleton-paragraph {
    margin: 0;
  }
`;

export const DefaultWrapper = styled.div`
  .ant-table-container table > thead > tr th {
    background-color: transparent;
    color: ${(props: IThemeProps) => props?.theme?.colors?.$BLACK};
    font-weight: 500;
  }

  .ant-table table {
    /* width: 100%; */
    text-align: left;
    border-radius: 2px 2px 0 0;
    border-collapse: separate;
    border-spacing: 0;
    border-left: 1px solid
      ${(props: IThemeProps) => props?.theme?.colors?.seprator};
    border-right: 1px solid
      ${(props: IThemeProps) => props?.theme?.colors?.seprator};
  }

  .ant-table-thead {
    tr {
      .ant-table-cell {
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 16px;
        letter-spacing: 0.05em;

        /* text heading color */

        color: #272727;
      }
    }
  }
  .ant-table-thead > tr > th {
    padding: 13px 16px;
    color: ${(props: IThemeProps) =>
      props?.theme?.theme === 'dark' ? '#ffff' : 'unset'};
    background: ${(props: IThemeProps) =>
      props?.theme?.theme === 'dark' ? props?.theme?.colors?.bgTh : ''};
  }
`;
