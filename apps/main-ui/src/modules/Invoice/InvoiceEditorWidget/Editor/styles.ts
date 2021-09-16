import styled from "styled-components";
import { Color } from "../../../../modal";
import convertToRem from "../../../../utils/convertToRem";

export const WrapperInvoiceForm = styled.div`
  margin: 0 0 ${convertToRem(20)} 0;
  padding-bottom: ${convertToRem(40)};
  border-radius: ${convertToRem(8)};

  /* table {
    border-spacing: 0;
  } */
  .refrence-header {
    /* background: #f8f8f8;
    border: ${convertToRem(1)} solid #e4e4e4;
    border-radius: ${convertToRem(5)} ${convertToRem(5)} 0 0;
    display: flex;
    align-items: center;
    justify-content: center;
    /* padding: ${convertToRem(5)} ${convertToRem(8)} 0 ${convertToRem(8)}; */
    margin-bottom: ${convertToRem(20)};
    ._custom_row_refheader {
      margin: 0 !important;
      ._custom_col_refheader:first-child {
        padding-left: 0 !important;
      }
      ._custom_col_refheader:last-child {
        padding-right: 0 !important;
      }
    }
  }
  .add_item {
    padding: ${convertToRem(18)} 0;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .deleteActionIcon {
      font-size: ${convertToRem(20)};
      color: ${Color.$LIGHT_BLACK};
    }
  }

  .total_invoice {
    padding: ${convertToRem(20)} ${convertToRem(10)};
  }

  p.bold {
    font-style: normal;
    font-weight: 500;
    font-size: ${convertToRem(14)};
    line-height: ${convertToRem(21)};
    /* identical to box height */

    letter-spacing: 0.08em;
    text-transform: capitalize;
    color: #3e3e3c;
  }

  p.light {
    font-style: normal;
    font-size: ${convertToRem(14)};
    line-height: ${convertToRem(25)};
    /* identical to box height */

    letter-spacing: 0.05em;
    text-transform: capitalize;

    /* text label */

    color: #3e3e3c;
  }

  ._total_aggragate {
    margin-top: ${convertToRem(10)};
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: ${convertToRem(32)};
    button {
      margin: ${convertToRem(0)} ${convertToRem(5)};
    }
  }

  .description {
    margin: ${convertToRem(20)} ${convertToRem(15)};
  }

 

  tbody > tr > td {
    padding: ${convertToRem(4)} ${convertToRem(2)};
  }
  thead > tr > th {
    padding: ${convertToRem(11)} ${convertToRem(2)};
    white-space: nowrap;
  }
  @media (max-width: 1365px) {
    thead > tr > th,
    tbody > tr > td {
      font-size: ${convertToRem(10)} !important;
    }
  }
  thead > tr > th:first-child {
    border-top-left-radius: 5px !important;
  }
  thead > tr > th:last-child {
    border-top-right-radius: 5px !important;
  }

  .ant-form-item-explain {
    position: absolute;
    right: 0;
    top: -${convertToRem(22)};
  }

  .ant-form-item {
    margin-bottom: ${convertToRem(13)};
  }

  .ant-table-tbody > tr > td {
    padding: 0px 5px;
  }

  td.select-column {
    padding: 0px 0px;
    cursor: pointer;
    border-left: 1px solid transparent;
    border-right: 1px solid transparent;
    transition: 0.3s all ease-in-out;
    .ant-select-selector {
      cursor: pointer !important;
    }
    &:hover {
      border-left: 1px solid #efefef;
      border-right: 1px solid #efefef;
    }
  }
  .border-less-select {
  }
  .border-less-select > .ant-select-selector {
    border: none;
  }

  .row_warning {
    td {
      background: #f09b0063 !important;
    }
  }

  .ant-select:not(.ant-select-customize-input) .ant-select-selector {
    background: transparent !important;
  }

  .actions_control {
    .ant-form-item-control-input-content {
      display: flex;
      align-items: center;
    }
  }

  .ant-skeleton.ant-skeleton-active{
    padding: 12px 0;
  }
`;
