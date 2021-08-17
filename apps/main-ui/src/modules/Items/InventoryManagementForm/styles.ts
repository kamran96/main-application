import styled from "styled-components";
import convertToRem from "../../../utils/convertToRem";

export const WrapperInventoryManagement = styled.div`
  .card_styles {
    height: calc(100vh - 200px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .ant-table-body {
    overflow-y: auto !important;
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
  thead > tr > th:nth-last-child(2) {
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
    padding: 2px 5px !important;
  }

  .has-error td {
    background: #ff4b39 !important;

    .ant-select-selector {
      background: transparent !important;
    }
  }
`;
