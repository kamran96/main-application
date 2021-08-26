import React, { FC, useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Topbar } from '../../components/Topbar';
import { useGlobalContext } from '../../hooks/globalContext/globalContext';
import { InvyceCmdPalette } from './CommandPalette';
import { ContentArea, NewUserContentArea, WrapperApplayout } from './styles';
import brightnessContrast from '@iconify-icons/carbon/brightness-contrast';
import Icon from '@iconify/react';
import { SidebarUi } from '@invyce/sidebar-ui';
import { RoutingSchema } from '../../Schema/routingSchema';
import {InyvceDarkTextIcon} from "../../assets/icons";

interface IProps {
  children: React.ReactElement<any>;
}

export const AppLayout: FC<IProps> = ({ children }) => {
  const { userDetails, theme, darkModeLoading } = useGlobalContext();

  return (
    <WrapperApplayout darkModeLoading={darkModeLoading}>
      <div className="dark-mode-loading">
        <span className="icon-darkmode">
          <Icon icon={brightnessContrast} />
        </span>
      </div>
      <InvyceCmdPalette />
      <Topbar />
      {userDetails && userDetails.organizationId && userDetails.branchId ? (
        <section className="layout">
          {/* <Sidebar/> */}
          <SidebarUi
          appLogo={<InyvceDarkTextIcon/>}
            activeUserInfo={{
              userEmail: userDetails?.profile?.email,
              username: userDetails?.username,
              userImage: userDetails?.profile?.attachment?.path,
            }}
            routes={RoutingSchema}
          />

          {/* <ContentArea toggle={toggle}> */}
          <ContentArea>
            <main className="content">{children}</main>
          </ContentArea>
        </section>
      ) : (
        <NewUserContentArea layoutChanged={userDetails?.organizationId}>
          <div className="content">{children}</div>
        </NewUserContentArea>
      )}
    </WrapperApplayout>
  );
};
