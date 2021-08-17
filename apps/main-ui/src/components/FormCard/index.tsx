import styled from "styled-components";
import convertToRem from "../../utils/convertToRem";

export const FormCard = styled.div`
  background: #ffffff;
  border: ${convertToRem(1)} solid #eeeeee;
  box-sizing: border-box;
  border-radius: ${convertToRem(15)};
  padding: ${convertToRem(33)} ${convertToRem(31)};
  margin: ${convertToRem(20)} 0;
  width: 100%;
  height: max-content;
`;
