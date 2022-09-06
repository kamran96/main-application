import React, { FC } from 'react';
import { Dropdown, Menu } from 'antd';
import styled from 'styled-components';
import { ButtonTag, H4, ThreeDotsIcon } from '@components';
import deleteIcon from '@iconify/icons-carbon/delete';
import noImage from '@iconify/icons-carbon/no-image';
import editSolid from '@iconify/icons-clarity/edit-solid';
import checkMark from '@iconify/icons-carbon/checkmark-outline';
import Icon from '@iconify/react';
import { IThemeProps } from '../../hooks/useTheme/themeColors';

interface IProps {
  organization: any;
  handleDelete: (payload: any) => void;
  handleEdit: (payload: any) => void;
  handleActive: (payload: any) => void;
}

export const OrganizationCard: FC<IProps> = ({
  organization,
  handleDelete,
  handleEdit,
  handleActive,
}) => {
  const OverlayItems = (
    <Menu style={{ maxWidth: '130px' }}>
      <Menu.Item
        key="0"
        disabled={organization?.isActive}
        onClick={handleDelete}
      >
        <Icon icon={deleteIcon} />
        <span style={{ padding: '12px' }}>Delete</span>
      </Menu.Item>

      <Menu.Item key="1" onClick={handleEdit}>
        <Icon icon={editSolid} />
        <span style={{ padding: '12px' }}>Edit</span>
      </Menu.Item>
      <Menu.Item
        key="2"
        disabled={organization?.isActive}
        onClick={handleActive}
      >
        <Icon icon={checkMark} />
        <span style={{ padding: '12px' }}>Active</span>
      </Menu.Item>
    </Menu>
  );

  return (
    <CardWrapper>
      <div className="header">
        <div className="activeOrg">
          {organization?.isActive ? (
            <>
              <div className="activeStatus" />
              <p className="para">Active</p>
            </>
          ) : (
            <>
              <div className="inactiveStatus" />
              <p className="para">Inactive</p>
            </>
          )}
        </div>
        <Dropdown overlay={OverlayItems} trigger={['click']}>
          <div className="icon">
            <ThreeDotsIcon />
          </div>
        </Dropdown>
      </div>
      <div className="ImageArea">
        {organization?.attachmentId ? (
          <img
            src={organization?.attachmentId && organization?.attachment?.path}
            alt="Organization Logo"
          />
        ) : (
          <Icon icon={noImage} />
        )}
      </div>
      <div className="OrganizationTypo">
        <H4 className="title">{organization?.name}</H4>
        <p className="SubTitle">{organization?.niche}</p>
        <p className="Financial">Financial End year </p>
        <p className="Date">{organization?.financialEnding}</p>
      </div>
    </CardWrapper>
  );
};

const CardWrapper = styled.div`
  min-width: 290px;
  height: 260px;
  background: ${(props: IThemeProps) => props.theme.colors.cardBg};
  border: 1px solid
    ${(props: IThemeProps) => props.theme.colors.organizationCard};
  border-radius: 8px;
  margin: 12px;
  padding: 6px 16px;
  height: 260px;

  .header {
    display: flex;
    justify-content: space-between;
    position: relative;
  }

  .activeOrg {
    display: flex;
    align-items: center;
    position: relative;
  }

  .icon {
    cursor: pointer;
    width: 1rem;
    height: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .activeStatus {
    width: 9px;
    height: 9px;
    background: #81f50c;
    border-radius: 50%;
    position: absolute;
    top: 0.3rem;
    left: 0.5rem;
  }
  .inactiveStatus {
    width: 9px;
    height: 9px;
    background: #f5c20c;
    border-radius: 50%;
    position: absolute;
    top: 0.3rem;
    left: 0.5rem;
  }
  .para {
    margin-left: 1.5rem;
    font-weight: 400;
    font-size: 12px;
  }

  .ImageArea {
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #f5f5f5;
    padding-bottom: 1rem;

    img {
      height: 5rem;
      width: 5rem;
      border-radius: 50%;
    }

    svg {
      height: 5rem;
      width: 5rem;
    }
  }
  .OrganizationTypo {
    padding: 8px 0 0 4px;
  }

  .title {
    font-size: 1rem;
  }
  .SubTitle {
    font-size: 12px;
    font-weight: 400;
    margin: 3px 0;
  }

  .Financial {
    color: #909090;
    font-weight: 400;
  }
  .Date {
    font-weight: 500;
    font-size: 12px;
  }
`;
