import { Button } from 'antd';
import React, { FC } from 'react';
import { useGlobalContext } from '../../hooks/globalContext/globalContext';
import { WrapperTopbar, WrapperUnverified } from './styled';
import { UserAccountArea } from './UserAccountArea';
import InvyceLog from '../../assets/invyceLogo.png';
import { InvyceLogo } from '../../assets/icons';

export const Topbar: FC = () => {
  const { userDetails, setVerifiedModal } = useGlobalContext();

  return (
    <>
      {!userDetails?.isVerified && userDetails?.organizationId && (
        <WrapperUnverified>
          <p className="textCenter">
            You have 20 days to verify your account if not your account will be
            block.
            <Button onClick={() => setVerifiedModal(true)} type="link">
              Verify your Account
            </Button>
          </p>
        </WrapperUnverified>
      )}
      <WrapperTopbar>
        <div className="logo">
          <span className="flex alignCenter">
            <InvyceLogo />
          </span>
        </div>
        <UserAccountArea />
      </WrapperTopbar>
    </>
  );
};
