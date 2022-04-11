import styled from 'styled-components';
import convertToRem from '../../utils/convertToRem';

export const SearchWrapper = styled.div`
  font-size: ${convertToRem(12)};
  position: relative;
  width: 100%;
  border: ${convertToRem(1)} solid #ececec;
  box-sizing: border-box;
  border-radius: ${convertToRem(4)};
  padding: ${convertToRem(4)} 2px;
  color: #bdbdbd;
  display: flex;
  align-items: center;
  input {
    border: none;
    outline: none;

    &:visited,
    &:focus,
    &:hover,
    &:active {
      outline: none;
      border: none;
    }
  }

  .search_icon {
    font-size: 17px;
  }
`;
