import { Button } from 'antd';
import React, { FC, ReactElement } from 'react';
import styled from 'styled-components';
import deleteIcon from '@iconify/icons-carbon/delete';
import Icon from '@iconify/react';
import baselineAlternateEmail from '@iconify-icons/ic/baseline-alternate-email';
import editSolid from '@iconify/icons-clarity/edit-solid';
import { PDFICON } from '../../../../../components/Icons';
import printIcon from '@iconify-icons/bytesize/print';
import { IThemeProps } from '../../../../../hooks/useTheme/themeColors';

interface IProps {
  disabled?: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
  onEmail?: () => void;
  onApprove?: () => void;
  isEditable?: boolean;
  isAbleToDelete?: boolean;
  renderSmartFilter?: ReactElement<any>;
  hasApproveButton?: boolean;
}

export const PurchaseTopbar: FC<IProps> = ({
  disabled,
  onDelete,
  onEdit,
  onEmail,
  onApprove,
  isEditable,
  renderSmartFilter,
  hasApproveButton,
  isAbleToDelete = true,
}) => {
  return (
    <WrapperPurchaseTopbar className="flex alignCenter justifySpaceBetween pv-30">
      <div className="flex alignCenter _quick_access">
        {/* <Button className={"_customized_button"}>Submit for approvel</Button> */}
        {hasApproveButton && (
          <Button
            onClick={onApprove}
            disabled={disabled}
            className={`${!disabled ? '_customized_button' : ''}`}
          >
            Approve
          </Button>
        )}
        {isEditable && (
          <Button
            disabled={disabled}
            onClick={onEdit}
            className={` flex alignCenter ${
              !disabled ? '_customized_button' : ''
            }`}
          >
            <i className="flex alignCenter _icon_button">
              <Icon icon={editSolid} />
            </i>
            Edit
          </Button>
        )}
        {isAbleToDelete && (
          <Button
            disabled={disabled}
            onClick={onDelete}
            className={` flex alignCenter  ${
              !disabled ? '_customized_button' : ''
            }`}
          >
            <i className="flex alignCenter _icon_button">
              <Icon icon={deleteIcon} />
            </i>
            Delete
          </Button>
        )}
        <Button
          disabled={disabled}
          onClick={onEmail}
          className={`flex alignCenter ${
            !disabled ? '_customized_button' : ''
          }`}
        >
          <i className="flex alignCenter _icon_button">
            <Icon icon={baselineAlternateEmail} />
          </i>
          Email
        </Button>
      </div>
      <div className={'_print flex alignCenter'}>
        <div className="filter_space">{renderSmartFilter}</div>
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

  ._customized_button {
    background: #e4e4e4;
    color: #333333;
    &:hover {
      background: ${(props: IThemeProps) => props?.theme?.colors?.$Secondary};
      color: ${(props: IThemeProps) => props?.theme?.colors?.$WHITE};
    }
  }

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
