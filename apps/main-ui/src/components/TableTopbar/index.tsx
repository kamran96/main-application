import React, { ReactElement, SFC } from 'react';
import styled from 'styled-components';
import { Icon } from '@iconify/react';
import editSolid from '@iconify/icons-clarity/edit-solid';
import deleteIcon from '@iconify/icons-carbon/delete';
import { MoreActions, TableActions } from '../TableActions';
import convertToRem from '../../utils/convertToRem';
import { Color } from '../../modal';

interface IProps {
  selectedRow?: number[];
  onDelete?: () => void;
  onEdit?: () => void;
  onSearch?: (value: string) => void;
  onFilterClick?: () => void;
  renderFilter?: ReactElement<any>;
}

export const TableTopbar: SFC<IProps> = ({
  selectedRow,
  onDelete,
  onEdit,
  onSearch,
  onFilterClick,
  renderFilter,
}) => {
  return (
    <WrapperTableTopbar>
      <div className="contacts_search flex alignCenter justifySpaceBetween">
        <div className="options_actions">
          <div className="edit">
            {selectedRow && selectedRow.length > 0 && (
              <div className="flex alignCenter">
                {selectedRow && selectedRow.length === 1 && (
                  <TableActions onClick={onEdit}>
                    <Icon
                      style={{
                        fontSize: convertToRem(16),
                        color: Color.$GRAY_LIGHT,
                        cursor: 'pointer',
                      }}
                      icon={editSolid}
                    />
                  </TableActions>
                )}
                <TableActions onClick={onDelete}>
                  <Icon
                    style={{
                      fontSize: convertToRem(16),
                      color: Color.$GRAY_LIGHT,
                      cursor: 'pointer',
                    }}
                    icon={deleteIcon}
                  />
                </TableActions>
                <MoreActions />
              </div>
            )}
          </div>
        </div>
        <div className="search_sort flex justifyFlexEnd">
          <div className="search flex alignCenter ">{renderFilter}</div>
        </div>
      </div>
    </WrapperTableTopbar>
  );
};

const WrapperTableTopbar = styled.div`
  padding: ${convertToRem(15)} 0;
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

  .filter-icon {
    font-size: ${convertToRem(24)};
    display: flex;
    align-items: center;
    color: ${Color.$GRAY};
    margin-left: ${convertToRem(20)};
  }
`;
