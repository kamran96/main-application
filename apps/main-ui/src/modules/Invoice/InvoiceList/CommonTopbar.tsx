import { ReactElement, FC, useState } from 'react';
import deleteIcon from '@iconify/icons-carbon/delete';
import editSolid from '@iconify/icons-clarity/edit-solid';
import { Icon } from '@iconify/react';
import { useQueryClient, useMutation } from 'react-query';
import styled from 'styled-components';

import { deleteInvoicesAPI } from '../../../api';
import { ConfirmModal, MoreActions, TableActions } from '@components';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import { NOTIFICATIONTYPE } from '@invyce/shared/types';
import convertToRem from '../../../utils/convertToRem';
import { IThemeProps } from '../../../hooks/useTheme/themeColors';

interface IProps {
  selectedRow?: number[];
  onDelete?: () => void;
  onEdit?: () => void;
  onSearch?: (value: string) => void;
  onFilterClick?: () => void;
  renderFilter?: ReactElement<any>;
}

export const CommonTopbar: FC<IProps> = ({
  selectedRow,
  onDelete,
  onEdit,
  onSearch,
  onFilterClick,
  renderFilter,
}) => {
  const queryCache = useQueryClient();
  const [confirmModal, setConfirmModal] = useState(false);

  const { mutate: mutateDeleteInvoices, isLoading: deletingInvoice } =
    useMutation(deleteInvoicesAPI);
  const { notificationCallback } = useGlobalContext();

  const handleDelete = async () => {
    const payload = {
      ids: [...selectedRow],
    };

    try {
      await mutateDeleteInvoices(payload, {
        onSuccess: () => {
          (queryCache.invalidateQueries as any)((q) =>
            q.startsWith('invoices')
          );
          notificationCallback(
            NOTIFICATIONTYPE.SUCCESS,
            'Invoice Deleted Successfully'
          );
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <WrapperCommonTopbar>
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
                        color: `${(props: IThemeProps) =>
                          props?.theme?.colors?.$GRAY_LIGHT}`,
                        cursor: 'pointer',
                      }}
                      icon={editSolid}
                    />
                  </TableActions>
                )}
                <TableActions onClick={() => setConfirmModal(true)}>
                  <Icon
                    style={{
                      fontSize: convertToRem(16),
                      color: `${(props: IThemeProps) =>
                        props?.theme?.colors?.$GRAY_LIGHT}`,
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
      <ConfirmModal
        loading={deletingInvoice}
        visible={confirmModal}
        onCancel={() => setConfirmModal(false)}
        onConfirm={handleDelete}
        type="delete"
        text="Are you sure want to delete selected Invoice?"
      />
    </WrapperCommonTopbar>
  );
};

const WrapperCommonTopbar = styled.div`
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
          color: ${(props: IThemeProps) => props?.theme?.colors?.$PRIMARY};
        }
      }
    }
  }

  .dropdown_sort {
    display: flex;
    align-items: center;
  }
  .sort {
    color: ${(props: IThemeProps) => props?.theme?.colors?.$GRAY_LIGHT};
    font-size: ${convertToRem(14)};
    text-transform: capitalize;
    margin: 0 5px;
    font-weight: 500;
  }

  .filter-icon {
    font-size: ${convertToRem(24)};
    display: flex;
    align-items: center;
    color: ${(props: IThemeProps) => props?.theme?.colors?.$GRAY};
    margin-left: ${convertToRem(20)};
  }
`;
