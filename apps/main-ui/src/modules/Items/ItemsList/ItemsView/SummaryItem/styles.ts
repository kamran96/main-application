import styled from "styled-components";
import { Color } from "../../../../../modal";
import convertToRem from "../../../../../utils/convertToRem";

export const WrapperItemsView = styled.div`
  ._itemviewcard {
    background: ${Color.$WHITE};
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    margin-bottom: ${convertToRem(16)};
    .item_amount {
      font-size: ${convertToRem(24)};
      line-height: ${convertToRem(28)};
      font-weight: 500;
      display: flex;
      justify-content: center;
    }
  }
  ._itemdetailcard {
    min-height: ${convertToRem(272)};
    background: ${Color.$WHITE};
    margin-bottom: ${convertToRem(16)};
    h3 {
      margin-left: ${convertToRem(20)};
      margin-bottom: ${convertToRem(23)};
    }
    p {
      font-size: ${convertToRem(17)};
      margin-bottom: ${convertToRem(23)};
    }
  }
  ._salesitemcard {
    background: ${Color.$WHITE};
    min-height: ${convertToRem(272)};
    margin-bottom: ${convertToRem(16)};
  }
  ._topitemcard {
    margin-bottom: ${convertToRem(16)};
    background: ${Color.$WHITE};
    min-height: ${convertToRem(310)};
  }
  ._otherlinkcard {
    margin-bottom: ${convertToRem(16)};
    min-height: ${convertToRem(310)};
    background: ${Color.$WHITE};
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
