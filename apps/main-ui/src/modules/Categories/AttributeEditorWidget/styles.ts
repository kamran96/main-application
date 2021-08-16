import styled from "styled-components";
import convertToRem from "../../../utils/convertToRem";

export const WrapperAttributeWidget = styled.div`
  padding-bottom: ${convertToRem(24)};
  .form-wrapper {
    min-height: ${convertToRem(500)};
    max-height: ${convertToRem(500)};
    overflow-y: auto;
    padding: 0 ${convertToRem(30)};
  }

  .form-group {
    border: ${convertToRem(1)} solid #d9d9d9;
    padding: 1.4375rem 1.375rem 0.125rem 1.375rem;
    margin-bottom: ${convertToRem(10)};
  }

  .delete-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    position: relative;
    top: -${convertToRem(12)};
  }

  .loader-area {
    min-height: ${convertToRem(500)};
  }
`;
