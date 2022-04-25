import { Button } from 'antd';
import React, { FC, ReactElement } from 'react';
import styled from 'styled-components';
import deleteIcon from '@iconify/icons-carbon/delete';
import Icon from '@iconify/react';
import baselineAlternateEmail from '@iconify-icons/ic/baseline-alternate-email';
import editSolid from '@iconify/icons-clarity/edit-solid';
import printIcon from '@iconify-icons/bytesize/print';
import { PDFICON } from '../Icons';
import { Color } from '../../modal';
import { ButtonTag } from '../ButtonTags';

interface IProps {
  disabled?: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
  onEmail?: () => void;
  onApprove?: () => void;
  isEditable?: boolean;
  renderSmartFilter?: ReactElement<any>;
  hasApproveButton?: boolean;
  hideDeleteButton?: boolean;
  loading?: boolean;
  hasDownloadPdf?: boolean;
}

export const PurchaseListTopbar: FC<IProps> = ({
  disabled,
  onDelete,
  onEdit,
  onEmail,
  onApprove,
  isEditable,
  hasApproveButton,
  hideDeleteButton,
  loading,
  hasDownloadPdf
}) => {
  return (
    <WrapperPurchaseTopbar className="flex alignCenter justifySpaceBetween">
      <div className="flex alignCenter _quick_access">
        {/* <Button className={"_customized_button"}>Submit for approvel</Button> */}
        {hasApproveButton && (
          <ButtonTag
            className="mr-10"
            onClick={onApprove}
            disabled={disabled}
            title="Approve"
            size="middle"
            loading={loading}
            // icon={printIcon}
          />
          // <ButtonTag
          //   onClick={onApprove}
          //   disabled={disabled}
          //   className={`${!disabled ? "_customized_button" : ""}`}
          // >
          //   Approve
          // </ButtonTag>
        )}
        {isEditable && (
          <ButtonTag
            disabled={disabled}
            className="mr-10"
            onClick={onEdit}
            title="Edit"
            size="middle"
            icon={editSolid}
            
          />
          // <Button
          //   disabled={disabled}
          //   onClick={onEdit}
          //   className={` flex alignCenter ${
          //     !disabled ? "_customized_button" : ""
          //   }`}
          // >
          //   <i className="flex alignCenter _icon_button">
          //     <Icon icon={editSolid} />
          //   </i>
          //   Edit
          // </Button>
        )}
        {!hideDeleteButton && (
          <ButtonTag
            className="mr-10"
            onClick={onDelete}
            disabled={disabled}
            title="Delete"
            size="middle"
            icon={deleteIcon}
          />
          // <Button
          //   disabled={disabled}
          //   onClick={onDelete}
          //   className={` flex alignCenter  ${
          //     !disabled ? "_customized_button" : ""
          //   }`}
          // >
          //   <i className="flex alignCenter _icon_button">
          //     <Icon icon={deleteIcon} />
          //   </i>
          //   Delete
          // </Button>
        )}
        
        {/* <Button
          disabled={disabled}
          onClick={onEmail}
          className={`flex alignCenter ${
            !disabled ? "_customized_button" : ""
          }`}
        >
          <i className="flex alignCenter _icon_button">
            <Icon icon={baselineAlternateEmail} />
          </i>
          Email
        </Button> */}
      </div>
    </WrapperPurchaseTopbar>
  );
};
const WrapperPurchaseTopbar = styled.div`
  padding: 10px 0;

  ._quick_access {
    button {
      margin-right: 7px;
      border-radius: 4px;
      border: none;
      ._icon_button {
        position: relative;
        top: -2px;
        margin-right: 5px;
      }
    }
  }

  /* ._customized_button {
    background: #e4e4e4;
    color: #333333;
    &:hover {
      background: ${Color.$Secondary};
      color: ${Color.$WHITE};
    }
  } */

  .filter_space {
    position: relative;
    top: -5px;
  }
  ._print {
    ._print_button {
      border: none;
    }
  }
`;
