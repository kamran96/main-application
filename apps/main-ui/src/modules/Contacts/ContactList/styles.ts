import styled from 'styled-components';
import { Color } from '../../../modal';
import convertToRem from '../../../utils/convertToRem';

export const ContactListWrapper: any = styled.div`
  .contacts_search {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .search_sort {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 9;
    padding: 0 ${convertToRem(10)};
  }

  .options_actions {
    display: flex;
    align-items: center;
    flex: 6;

    .edit {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      p {
        margin: 0 5px;
        cursor: pointer;
        transition: 0.3s all ease-in-out;

        &:hover {
          color: ${Color.$PRIMARY};
        }
      }
    }
  }

  .dropdown_sort {
    display: flex;
    align-items: center;
  }
  .sort {
    color: ${Color.$PRIMARY};
    font-size: ${convertToRem(14)};
    text-transform: capitalize;
    margin: 0 5px;
    font-weight: 500;
  }

  /* .contact-name {
    color: #3e3e3c;
  } */
`;

export const ContactMainWrapper = styled.div`
  .actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
`;
