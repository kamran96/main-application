import styled from 'styled-components';
import convertToRem from '../../../utils/convertToRem';
export const AccountsWrapper = styled.div`
  /* .account_name{
  color: #3e3e3c;
} */
  .custom_topbar {
    display: flex;
    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
    -ms-flex-pack: justify;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
  }

  .edit {
    display: flex;
    align-items: center;
    .label {
      margin: ${convertToRem(10)};
    }
  }
`;
export const ListWrapper = styled.div``;
export const TableWrapper = styled.div`
  margin-top: 30px;
`;
export const SearchBar = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-right: 20px;
  .search {
    width: ${convertToRem(350)};
  }
`;

export const AccountName = styled.div`
  h3 {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    line-height: 15px;
    letter-spacing: 0.04em;
    text-transform: capitalize;
    color: #3e3e3c;
    margin-top: 0;
    margin-bottom: 2px;
  }
  p {
    margin: 0;
    font-family: 'Roboto';
    font-style: normal;
    font-weight: normal;
    font-size: 11px;
    line-height: 13px;
    letter-spacing: 0.04em;
    text-transform: capitalize;
    color: #3e3e3c;
  }
`;
