import React, { ReactElement, FC, useState } from "react";
import deleteIcon from "@iconify/icons-carbon/delete";
import editSolid from "@iconify/icons-clarity/edit-solid";
import { Icon } from "@iconify/react";
import { queryCache, useMutation } from "react-query";
import styled from "styled-components";

import { deleteInvoicesAPI } from "../../../api";
import { ConfirmModal } from "../../../components/ConfirmModal";
import { MoreActions, TableActions } from "../../../components/TableActions";
import { useGlobalContext } from "../../../hooks/globalContext/globalContext";
import { Color, NOTIFICATIONTYPE } from "../../../modal";
import convertToRem from "../../../utils/convertToRem";

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
  const [confirmModal, setConfirmModal] = useState(false);

  const [mutateDeleteInvoices, resDeleteInvoices] = useMutation(
    deleteInvoicesAPI
  );
  const { notificationCallback } = useGlobalContext();

  const handleDelete = async () => {
    const payload = {
      ids: [...selectedRow],
    };
    try {
      await mutateDeleteInvoices(payload, {
        onSuccess: () => {
          queryCache.invalidateQueries((q) =>
            q.queryKey[0].toString().startsWith("invoices")
          );
          notificationCallback(
            NOTIFICATIONTYPE.SUCCESS,
            "Invoice Deleted Successfully"
          );
        },
      });
    } catch (error) {}
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
                        color: Color.$GRAY_LIGHT,
                        cursor: "pointer",
                      }}
                      icon={editSolid}
                    />
                  </TableActions>
                )}
                <TableActions onClick={() => setConfirmModal(true)}>
                  <Icon
                    style={{
                      fontSize: convertToRem(16),
                      color: Color.$GRAY_LIGHT,
                      cursor: "pointer",
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
        loading={resDeleteInvoices.isLoading}
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
