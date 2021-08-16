import { IThemeProps } from "./../../../hooks/useTheme/themeColors";
import styled from "styled-components";

export const WrapperCashActivity = styled.div`
  .cash_flow_table {
    table {
      width: 100%;
      thead tr {
        background: #143c69;
        th {
          color: ${(props: IThemeProps) => props?.theme?.colors?.$WHITE};
          padding: 11px;
          text-transform: capitalize;
        }
      }
      tbody {
        tr {
          td {
            color: ${(props: IThemeProps) => props?.theme?.colors?.textTd};
            padding: 15px 10px;
          }
          td:first-child {
            padding-left: 50px;
          }
          td:last-child {
            text-align: right;
            width: 230px;
            min-width: 230px;
          }
        }
        tr:last-child {
          td:last-child {
            padding-top: 30px;
            p {
              padding-top: 10px;
              border-top: 1px solid #e1e1e1;
            }
          }
        }
      }
    }
  }
`;
