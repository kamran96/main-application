import { IThemeProps } from "./../../../../hooks/useTheme/themeColors";
import styled from "styled-components";

import { Color } from "../../../../modal";
import convertToRem from "../../../../utils/convertToRem";

export const WrapperTransactionEditor = styled.div`
  .card-inner {
    height: max-content;
    min-height: 83vh;
    background: ${(props: IThemeProps) => props?.theme?.colors?.$WHITE};
  }
  .form-wrapper {
    background: ${(props: IThemeProps) =>
      props?.theme?.theme === "dark"
        ? props?.theme?.colors?.layoutBg
        : `#fdfdfd`};
    border: ${convertToRem(1)} solid
      ${(props: IThemeProps) =>
        props?.theme?.theme === "dark"
          ? props?.theme?.colors?.seprator
          : "#eeeeee"};
    box-sizing: border-box;
    border-radius: ${convertToRem(10)};
    padding: ${convertToRem(32)};
  }
  .transaction_card {
    overflow-x: auto;
    min-height: ${convertToRem(300)};
    max-height: ${convertToRem(300)};
    overflow-y: auto;
    table {
      width: 100%;
      border-spacing: 0 ${convertToRem(6)};
      border-collapse: separate;
      thead > tr > th:first-child {
        border-top-left-radius: ${convertToRem(5)};
      }
      thead > tr > th:last-child {
        border-top-right-radius: ${convertToRem(5)};
      }
      thead > tr > th {
        padding: ${convertToRem(7)} ${convertToRem(6)};
        background: ${(props: IThemeProps) =>
          props?.theme?.theme === "dark"
            ? props?.theme?.colors?.bgTh
            : "#dadada"};
        color: ${(props: IThemeProps) =>
          props?.theme?.theme === "dark"
            ? props?.theme?.colors?.$BLACK
            : "#212121"};
        font-weight: 500;
      }

      tbody > tr > td {
        padding: ${convertToRem(5)} ${convertToRem(5)};
        color: ${(props: IThemeProps) => props?.theme?.colors?.textTd};
      }
      tbody > tr.has-error > td {
        background: #d20d0dcc;
        .ant-select-selector {
          background: transparent !important;
        }
      }

      tbody > tr > td:first-child {
        text-align: center;
      }
      tbody > tr:nth-child(odd) {
        background: ${(props: IThemeProps) =>
          props?.theme?.theme === "dark" ? "transparent" : "#f7f7f7"};
      }
    }
  }

  .total {
    display: flex;
    .para {
      flex: 15;
      padding-left: ${convertToRem(45)};
    }
    .debit,
    .credit {
      flex: 3;
    }
    p {
      margin: 0;
      color: #293842;
      font-weight: 500;
      font-size: ${convertToRem(13)};
      color: ${(props: IThemeProps) => props?.theme?.colors?.$BLACK};
    }
  }

  hr {
    border: 0 ${convertToRem(5)} solid #eaeaea;
  }

  .action_buttons {
    text-align: right;
    button {
      padding-left: ${convertToRem(21)};
      padding-right: ${convertToRem(21)};
    }
    /* .cancel {
      background: #bdbdbd;
      &:hover {
        border-color: transparent;
        color: #4f4f4f;
      }
    } */
  }

  .action-icon {
    i {
      cursor: pointer;
      font-size: ${convertToRem(17)};
    }
  }

  .ant-select-selector,
  .ant-input {
    border: ${convertToRem(1)} solid #b0b0b0;
    font-style: normal;
    font-weight: normal;
    font-size: ${convertToRem(13)};
    color: #000000;
  }

  .ant-input-number-input {
    border-radius: ${convertToRem(5)};
  }

  textarea {
    font-size: ${convertToRem(13)};
    padding: ${convertToRem(8)};
    border: ${convertToRem(1)} solid #b0b0b0;
    overflow: hidden;
  }

  /* quick add account */

  .wrapper-account-detail {
    position: relative;
    top: ${convertToRem(59)};
    h3 {
      font-style: normal;
      font-weight: normal;
      font-size: ${convertToRem(15)};
      line-height: ${convertToRem(18)};
      color: #595a5a;
      margin-bottom: ${convertToRem(4)};
    }
  }
  .quick-detail-wrapper {
    background: ${(props: IThemeProps) =>
      props?.theme?.theme === "dark"
        ? props?.theme?.colors?.layoutBg
        : "#fdfdfd"};
    border: ${convertToRem(1)} solid
      ${(props: IThemeProps) =>
        props?.theme?.theme === "dark"
          ? props?.theme?.colors?.seprator
          : `#ededed`};
    box-sizing: border-box;
    border-radius: ${convertToRem(5)};
    min-height: ${convertToRem(287)};
    height: max-content;
    padding: ${convertToRem(21)} 0;
    ul {
      padding: 0;
      margin: 0;
      display: block;
      width: 100%;
    }

    ul > li {
      font-weight: normal;
      font-size: ${convertToRem(17)};
      line-height: ${convertToRem(20)};
      list-style: none;
      padding: ${convertToRem(9)} ${convertToRem(18)};
      display: block;
      background: transparent;
      transition: 0.3s all ease-in-out;
      color: ${(props: IThemeProps) => props?.theme?.colors?.textTd};
    }

    .itemAdded {
      text-decoration: line-through;
      color: #b3b3b3;
    }

    ul > li:hover {
      color: ${Color.$PRIMARY};
      background: #f3f3f3;
      cursor: pointer;
    }
  }

  /* antd form modification */

  .ant-form-item-explain {
    position: absolute;
    right: 0;
    top: -${convertToRem(22)};
  }

  .ant-form-item {
    margin-bottom: ${convertToRem(13)};
  }
`;
