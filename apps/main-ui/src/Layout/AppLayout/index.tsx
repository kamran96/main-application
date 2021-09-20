import brightnessContrast from '@iconify-icons/carbon/brightness-contrast';
import Moon from '@iconify-icons/feather/moon';
import Icon from '@iconify/react';
import { IRoutesSchema, ISupportedRoutes } from '@invyce/shared/types';
import { SidebarUi } from '@invyce/sidebar-ui';
import { Button } from 'antd';
import React, { FC } from 'react';
import { useMutation } from 'react-query';
import { updateThemeAPI } from '../../api';
import { InyvceDarkTextIcon } from '../../assets/icons';
import { useRbac } from '../../components/Rbac/useRbac';
import { useGlobalContext } from '../../hooks/globalContext/globalContext';
import { ILoginActions } from '../../hooks/globalContext/globalManager';
import { RoutingSchema } from '../../Schema/routingSchema';
import { InvyceCmdPalette } from './CommandPalette';
import { ContentArea, NewUserContentArea, WrapperApplayout } from './styles';

interface IProps {
  children: React.ReactElement<any>;
}

export const AppLayout: FC<IProps> = ({ children }) => {
  const { rbac } = useRbac(null);
  const [muateTheme, resMutateTheme] = useMutation(updateThemeAPI);
  const {
    userDetails,
    theme,
    darkModeLoading,
    handleLogin,
    setTheme,
    setVerifiedModal,
    isOnline,
  } = useGlobalContext();
  const handleThemeSwitch = async (theme) => {
    setTheme(theme);
    const payload = {
      theme,
    };
    await muateTheme(payload);
  };

  const routes = () => {
    let obj = {};
    
    Object?.keys(RoutingSchema)?.forEach((_routeSchema, routeIndex) => {
      let filter = RoutingSchema[_routeSchema]?.filter(
        (item: IRoutesSchema) => {
          if (!item?.permission || rbac?.can(item?.permission)) {
            let children: IRoutesSchema[] = [];
            let routeItem = { ...item, children };
            if (item?.children?.length) {
              item?.children?.forEach((subRoute) => {
                if (!subRoute?.permission || rbac?.can(subRoute?.permission)) {
                  children?.push(subRoute);
                }
              });
            }
            return routeItem;
          } else {
            return null;
          }
        }
      );

      obj[_routeSchema] = filter;
    });

    return obj;
  };


  return (
      <WrapperApplayout darkModeLoading={darkModeLoading}>
        <div className="dark-mode-loading">
          <span className="icon-darkmode">
            <Icon icon={theme === 'dark' ? Moon : brightnessContrast} />
          </span>
        </div>
        <InvyceCmdPalette />
        {/* <Topbar /> */}
        {userDetails && userDetails.organizationId && userDetails.branchId ? (
          <section className="layout">
            {/* <Sidebar/> */}
            <SidebarUi
              appLogo={<InyvceDarkTextIcon />}
              activeUserInfo={{
                userEmail: userDetails?.profile?.email,
                username: userDetails?.username,
                userImage: userDetails?.profile?.attachment?.path,
                theme: theme,
                link: `${ISupportedRoutes.DASHBOARD_LAYOUT}${ISupportedRoutes.SETTINGS}${ISupportedRoutes.PROFILE_SETTING}`
              }}
              routes={routes() as any}
              onLogOut={() => {
                handleLogin({ type: ILoginActions.LOGOUT });
              }}
              onThemeButtonClick={() => {
                handleThemeSwitch(theme === 'dark' ? 'light' : 'dark');
              }}
              userOnline={isOnline}
            />

            {/* <ContentArea toggle={toggle}> */}
            <ContentArea>
              {!userDetails?.isVerified && userDetails?.organizationId && (
                <div className="unverified_topbar">
                  <p className="textCenter">
                    You have 20 days to verify your account if not your account
                    will be block.
                    <Button onClick={() => setVerifiedModal(true)} type="link">
                      Verify your Account
                    </Button>
                  </p>
                </div>
              )}
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
