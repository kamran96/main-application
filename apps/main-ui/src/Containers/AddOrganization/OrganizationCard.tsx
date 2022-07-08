import React, { FC } from 'react';
import styled from 'styled-components';
import { ThreeDotsIcon } from '../../components/Icons';
import quickbook from '../../assets/quickbook.png';
import { ButtonTag } from '../../components/ButtonTags';
import deleteIcon from '@iconify/icons-carbon/delete';
import editSolid from '@iconify/icons-clarity/edit-solid';
import { Dropdown, Menu } from 'antd';
import Icon from '@iconify/react';
import { H4 } from '../../../src/components/Typography';
import { IThemeProps } from '../../hooks/useTheme/themeColors';

interface IProps {
  organization: any;
  handleDelete: (payload: any) => void;
  handleEdit: (payload: any) => void;
}

export const OrganizationCard: FC<IProps> = ({
  organization,
  handleDelete,
  handleEdit,
}) => {
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
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item
                key="0"
                disabled={organization?.isActive}
                onClick={handleDelete}
              >
                <Icon icon={deleteIcon} /> Delete
              </Menu.Item>
              <Menu.Item key="1" onClick={handleEdit}>
                <Icon icon={editSolid} /> Edit
              </Menu.Item>
              <Menu.Item key="2">
                <Icon icon={editSolid} /> Active
              </Menu.Item>
            </Menu>
          }
          trigger={['click']}
        >
          <div className="icon">
            <ThreeDotsIcon />
          </div>
        </Dropdown>
      </div>
      <div className="ImageArea">
        <img
          src={organization?.logo ? organization?.logo : quickbook}
          alt="Organization Logo"
        />
      </div>
      <div className="OrganizationTypo">
        <H4 className="title">{organization?.name}</H4>
        <p className="SubTitle">{organization.organizationType}</p>
        <p className="Financial">Financial End year </p>
        <p className="Date">{organization.createdAt}</p>
      </div>
    </CardWrapper>
  );
};

const CardWrapper = styled.div`
  min-width: 290px;
  background: ${(props: IThemeProps) => props.theme.colors.cardBg};
  border: 1px solid #dff0ff;
  border-radius: 8px;
  margin: 12px;
  padding: 6px 16px;

  .header {
    display: flex;
    justify-content: space-between;
  }
  .activeOrg {
    display: flex;
    align-items: center;
    position: relative;
  }

  .icon {
    cursor: pointer;
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
    }
  }
  .OrganizationTypo {
    padding: 8px 0 0 4px;
  }

  .title {
    color: #000000;
    font-size: 1rem;
  }
  .SubTitle {
    font-size: 12px;
    font-weight: 400;
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
