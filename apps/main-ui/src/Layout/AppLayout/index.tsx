import brightnessContrast from '@iconify-icons/carbon/brightness-contrast';
import Moon from '@iconify-icons/feather/moon';
import Icon from '@iconify/react';
import { IRoutesSchema, ISupportedRoutes } from '@invyce/shared/types';
import { SidebarUi } from '@invyce/sidebar-ui-v2';
import { Button } from 'antd';
import { ReactNode, useEffect } from 'react';
import { FC } from 'react';
import { useMutation } from 'react-query';
import { updateThemeAPI } from '../../api';
import { InyvceDarkTextIcon, InyvceLightTextIcon } from '../../assets/icons';
import { useRbac } from '../../components/Rbac/useRbac';
import { useGlobalContext } from '../../hooks/globalContext/globalContext';
import { ILoginActions } from '../../hooks/globalContext/globalManager';
import { RoutingSchema } from '../../Schema/routingSchema';
import { InvyceCmdPalette } from './CommandPalette';
import { ContentArea, NewUserContentArea, WrapperApplayout } from './styles';
import { ErrorBoundary } from '@invyce/error-boundry';
import { Inconvinience } from '../../components/ErrorBoundries/Inconvinience';

interface IProps {
  children: ReactNode;
}

export const AppLayout: FC<IProps> = ({ children }) => {
  const { rbac } = useRbac(null);
  const { mutate: muateTheme } = useMutation(updateThemeAPI);
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

  const _filteredRoutes = () => {
    const obj = {};

    Object?.keys(RoutingSchema)?.forEach((_routeSchema, routeIndex) => {
      const parents = [];

      RoutingSchema[_routeSchema].forEach((parent: IRoutesSchema) => {
        if (parent?.children?.length) {
          const _children = parent?.children?.filter((child: IRoutesSchema) => {
            if (!child?.permission || rbac?.can(child?.permission)) {
              const a = rbac.can(child?.permission);
              return child;
            } else {
              return null;
            }
          });

          parents.push({ ...parent, children: _children });
        } else if (!parent?.permission || rbac?.can(parent?.permission)) {
          parents.push(parent);
        } else {
          return null;
        }
      });

      obj[_routeSchema] = parents;
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
            appLogo={
              theme === 'dark' ? (
                <InyvceLightTextIcon />
              ) : (
                <InyvceDarkTextIcon />
              )
            }
            activeUserInfo={{
              userEmail: userDetails?.profile?.email,
              username: userDetails?.username,
              userImage: userDetails?.profile?.attachment?.path,
              userRole: userDetails?.role?.name,
              theme: theme === 'light' ? 'light' : 'dark',
              link: `${ISupportedRoutes.DASHBOARD_LAYOUT}${ISupportedRoutes.SETTINGS}${ISupportedRoutes.PROFILE_SETTING}`,
            }}
            routes={_filteredRoutes() as any}
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
            <ErrorBoundary
              errorComponent={
                <div className="ph-20 pv-20">
                  <Inconvinience />
                </div>
              }
            >
              <main className="content">{children}</main>
            </ErrorBoundary>
          </ContentArea>
        </section>
      ) : (
        <NewUserContentArea
          layoutChanged={userDetails?.organizationId ? true : false}
        >
          <div className="content">{children}</div>
        </NewUserContentArea>
      )}
    </WrapperApplayout>
  );
};
