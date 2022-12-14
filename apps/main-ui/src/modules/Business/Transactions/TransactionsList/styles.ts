import styled from 'styled-components';
import convertToRem from '../../../../utils/convertToRem';

export const WrapperTransactionsList = styled.div`
  .action-create-transaction {
    padding: 10px 0;
    text-align: right;
  }

  .ant-table-expanded-row {
    td {
      padding: 2rem;
    }

    .ant-table-row {
      td {
        padding: 10px 15px !important;
      }
    }
  }
`;

export const WrapperTransactionCustomBar = styled.div`
  display: flex;
  justify-content: flex-end;
  .search_bar {
    width: ${convertToRem(300)};
  }
`;
