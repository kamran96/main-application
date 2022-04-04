import bxUser from '@iconify-icons/bx/bx-user';
import userRole from '@iconify-icons/carbon/user-role';
import shoppingBag from '@iconify-icons/fe/shopping-bag';
import arrowDown from '@iconify-icons/feather/arrow-down';
import arrowUp from '@iconify-icons/feather/arrow-up';
import bookOpen from '@iconify-icons/feather/book-open';
import dollarSign from '@iconify-icons/feather/dollar-sign';
import filePlus from '@iconify-icons/feather/file-plus';
import fileText from '@iconify-icons/feather/file-text';
import lockIcon from '@iconify-icons/feather/lock';
import powerIcon from '@iconify-icons/feather/power';
import settingsIcon from '@iconify-icons/feather/settings';
import usersIcon from '@iconify-icons/feather/users';
import shoppingCart from '@iconify-icons/icons8/shopping-cart';
import fileInvoiceDollar from '@iconify-icons/la/file-invoice-dollar';
import analyticsIcon from '@iconify-icons/uil/analytics';
import Icon from '@iconify/react';
import { ILoginActions } from '../../../hooks/globalContext/globalManager';
import CommandPalette from 'react-command-palette';
import styled from 'styled-components';
import { PERMISSIONS } from '../../../components/Rbac/permissions';
import { useRbac } from '../../../components/Rbac/useRbac';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import { IThemeProps } from '../../../hooks/useTheme/themeColors';
import { DivProps, ISupportedRoutes } from '../../../modal';
import CommandPlatteGlobalStyles from './commandPaletteGlobalStyles';
import { useEffect } from 'react';

export const InvyceCmdPalette = () => {
  const { rbac } = useRbac(null);
  
  const {
    routeHistory,
    setItemsModalConfig,
    setUserInviteModal,
    handleLogin,
    setPaymentsModalConfig,
    setRbacConfigModal,
    setAccountsModalConfig,
  } = useGlobalContext();
  const { history } = routeHistory;

  const commands = [
    {
      name: 'Create Invoice',
      command: () => {
        history.push(`/app${ISupportedRoutes.CREATE_INVOICE}`);
      },
      shortcut: '',
      permission: PERMISSIONS.INVOICES_CREATE,
      icon: fileText,
      type: 'bussiness',
    },
    {
      name: 'Invoice > Approved',
      command: () => {
        history.push(`/app${ISupportedRoutes.INVOICES}?tabIndex=all`);
      },
      shortcut: '',
      permission: PERMISSIONS.INVOICES_INDEX,
      icon: fileText,
      type: 'bussiness',
    },
    {
      name: 'Invoice > Draft',
      command: () => {
        history.push(`/app${ISupportedRoutes.INVOICES}?tabIndex=draft`);
      },
      shortcut: '',
      permission: PERMISSIONS.INVOICES_INDEX,
      icon: fileText,
      type: 'bussiness',
    },
    {
      name: 'Invoice > Awaiting Payments',
      command: () => {
        history.push(
          `/app${ISupportedRoutes.INVOICES}?tabIndex=awating_payment`
        );
      },
      shortcut: '',
      permission: PERMISSIONS.INVOICES_INDEX,
      icon: fileText,
      type: 'bussiness',
    },
    {
      name: 'Invoice > Paid',
      command: () => {
        history.push(`/app${ISupportedRoutes.INVOICES}?tabIndex=paid`);
      },
      shortcut: '',
      permission: PERMISSIONS.INVOICES_INDEX,
      icon: fileText,
      type: 'bussiness',
    },
    {
      name: 'Create Purchase Order',
      command: () => {
        history.push(`/app${ISupportedRoutes.CREATE_PURCHASE_ORDER}`);
      },
      permission: PERMISSIONS.PURCHASE_ORDERS_CREATE,
      icon: bookOpen,
      type: 'bussiness',
    },
    {
      name: 'Purchase Order List > Approved',
      command: () => {
        history.push(`/app${ISupportedRoutes.PURCHASE_ORDER}?tabIndex=all`);
      },
      permission: PERMISSIONS.PURCHASE_ORDERS_INDEX,
      icon: bookOpen,
      type: 'bussiness',
    },
    {
      name: 'Purchase Order List > Draft',
      command: () => {
        history.push(`/app${ISupportedRoutes.PURCHASE_ORDER}?tabIndex=draft`);
      },
      permission: PERMISSIONS.PURCHASE_ORDERS_INDEX,
      icon: bookOpen,
      type: 'bussiness',
    },
    {
      name: 'Create Purchase Entry',
      command: () => {
        history.push(`/app${ISupportedRoutes.CREATE_PURCHASE_Entry}`);
      },
      permission: PERMISSIONS.PURCHASES_CREATE,
      icon: shoppingBag,
      type: 'bussiness',
    },
    {
      name: 'Purchases List > Approved',
      command: () => {
        history.push(`/app${ISupportedRoutes.PURCHASES}?tabIndex=all`);
      },
      permission: PERMISSIONS.PURCHASES_INDEX,
      icon: shoppingBag,
      type: 'bussiness',
    },
    {
      name: 'Purchases List > Draft',
      command: () => {
        history.push(`/app${ISupportedRoutes.PURCHASES}?tabIndex=draft`);
      },
      permission: PERMISSIONS.PURCHASES_INDEX,
      icon: shoppingBag,
      type: 'bussiness',
    },

    {
      name: 'Create Quotation',
      command: () => {
        history.push(`/app${ISupportedRoutes.CREATE_QUOTE}`);
      },
      permission: PERMISSIONS.QUOTATIONS_CREATE,
      icon: fileInvoiceDollar,
      type: 'bussiness',
    },
    {
      name: 'Create Payment',
      command: () => {
        setPaymentsModalConfig(true);
      },
      permission: PERMISSIONS.PAYMENTS_CREATE,
      icon: dollarSign,
      type: 'bussiness',
    },
    {
      name: 'Create Role',
      command: () => {
        setRbacConfigModal(true);
      },
      permission: PERMISSIONS.PAYMENTS_CREATE,
      icon: userRole,
      type: 'organization',
    },
    {
      name: 'Roles',
      command: () => {
        history.push(`/app${ISupportedRoutes.RBAC}`);
      },
      permission: PERMISSIONS.RBAC_ROLE_INDEX,
      icon: userRole,
      type: 'organization',
    },
    {
      name: 'Permissions',
      command: () => {
        history.push(`/app${ISupportedRoutes.PERMISSIONS}`);
      },
      permission: PERMISSIONS.RBAC_ROLE_PERMISSION_UPDATE,
      icon: lockIcon,
      type: 'organization',
    },
    {
      name: 'Chart of Accounts > List',
      command: () => {
        history.push(`/app${ISupportedRoutes.ACCOUNTS}`);
      },
      permission: PERMISSIONS.ACCOUNTS_INDEX,
      icon: analyticsIcon,
      type: 'accounting',
    },
    {
      name: 'Create Account',
      command: () => {
        setAccountsModalConfig({ visibility: true, id: null });
      },
      permission: PERMISSIONS.ACCOUNTS_CREATE,
      icon: analyticsIcon,
      type: 'accounting',
    },
    {
      name: 'Transaction > List',
      command: () => {
        history.push(`/app${ISupportedRoutes.TRANSACTIONS}`);
      },
      permission: PERMISSIONS.TRANSACTIONS_INDEX,
      icon: filePlus,
      type: 'accounting',
    },
    {
      name: 'Create Transaction',
      command: () => {
        history.push(`/app${ISupportedRoutes.CREATE_TRANSACTION}`);
      },
      permission: PERMISSIONS.TRANSACTIONS_CREATE,
      icon: filePlus,
      type: 'accounting',
    },

    {
      name: 'Contacts List  > Customers',
      command: () => {
        history.push(`/app${ISupportedRoutes.CONTACTS}?tabIndex=customers`);
      },
      permission: PERMISSIONS.CONTACTS_INDEX,
      icon: bxUser,
      type: 'contacts',
    },
    {
      name: 'Contacts List  > Suppliers',
      command: () => {
        history.push(`/app${ISupportedRoutes.CONTACTS}?tabIndex=suppliers`);
      },
      permission: PERMISSIONS.CONTACTS_INDEX,
      icon: bxUser,
      type: 'contacts',
    },
    {
      name: 'Create Contacts',
      command: () => {
        history.push(`/app${ISupportedRoutes.CREATE_CONTACT}`);
      },
      permission: PERMISSIONS.CONTACTS_CREATE,
      icon: bxUser,
      type: 'contacts',
    },
    {
      name: 'Users > List',
      command: () => {
        history.push(`/app${ISupportedRoutes.USERS}`);
      },
      permission: PERMISSIONS.USERS_LIST,
      icon: usersIcon,
      type: 'users',
    },
    {
      name: 'Create User',
      command: () => {
        setUserInviteModal(true);
      },
      permission: PERMISSIONS.USERS_CREATE,
      icon: usersIcon,
      type: 'users',
    },
    {
      name: 'Create Item',
      command: () => {
        setItemsModalConfig(true);
      },
      permission: PERMISSIONS.ITEMS_CREATE,
      icon: shoppingCart,
      type: 'bussiness',
    },
    {
      name: 'Items > List',
      command: () => {
        history.push(`/app${ISupportedRoutes.ITEMS}`);
      },
      permission: PERMISSIONS.ITEMS_INDEX,
      icon: shoppingCart,
      type: 'bussiness',
    },
    {
      name: 'User > Profile Settings',
      command: () => {
        history.push(`/app${ISupportedRoutes.PROFILE_SETTING}`);
      },
      icon: settingsIcon,
      type: 'zsettings',
    },
    {
      name: 'User > Account Setting',
      command: () => {
        history.push(`/app${ISupportedRoutes.ACCOUNT_SETTING}`);
      },
      icon: settingsIcon,
      type: 'zsettings',
    },
    {
      name: 'Logout',
      command: () => {
        handleLogin({ type: ILoginActions.LOGOUT });
      },
      icon: powerIcon,
      type: 'zz',
    },
  ];

  const theme = {
    container: 'invyce-container', // invyce-container
    containerOpen: 'invyce-containerOpen', // invyce-containerOpen
    content: 'invyce-content', // invyce-content
    header: 'invyce-header', // invyce-header
    input: 'invyce-input', // invyce-input
    inputFocused: 'invyce-inputFocused', // invyce-inputFocused
    inputOpen: 'invyce-inputOpen', // invyce-inputOpen
    modal: 'invyce-modal', // invyce-modal
    overlay: 'invyce-overlay', // invyce-overlay
    spinner: 'invyce-spinner', // invyce-spinner
    suggestion: 'invyce-suggestion', // invyce-suggestion
    suggestionFirst: 'invyce-suggestionFirst', // invyce-suggestionFirst
    suggestionHighlighted: 'invyce-suggestionHighlighted', // invyce-suggestionHighlighted
    suggestionsContainer: 'invyce-suggestionsContainer', // invyce-suggestionsContainer
    suggestionsContainerOpen: 'invyce-suggestionsContainerOpen', // invyce-suggestionsContainerOpen
    suggestionsList: 'invyce-suggestionsList', // invyce-suggestionsList
    trigger: 'invyce-trigger', // invyce-trigger
  };

  const renderHeader = () => {

    return (
      <Wrapperheader>
        <h3 className="mr-20">Search for a Command</h3>
        <div className="flex alignCenter">
          <i className="icon">
            <Icon icon={arrowUp} />
            <Icon icon={arrowDown} />
          </i>
        </div>
        <h5>To navigate</h5>
        <div className="flex alignCenter">
          <div className="label mr-10">Enter</div>
          <h5>To select</h5>
        </div>
        <div className="flex alignCenter">
          <div className="label mr-10">Esc</div>
          <h5>To dismiss</h5>
        </div>
      </Wrapperheader>
    );
  };

  
  const RenderCommand = (suggestion) => {

    const ele = document?.querySelector('.invyce-modal');

    useEffect(()=>{
      if(ele && ele!==null){
        ele?.children[0].classList.add('wrapper-palate');
        ele.append();
      }
    },[ele])

    const { icon, name, highlight, type, lastIndex } = suggestion;
    const highlitedWord = () => {
      return {
        __html: highlight,
      };
    };
    return (
      <WrapperCommands
        isLastindex={lastIndex}
        className={`item flex alignCenter`}
      >
        <span className="flex alignCenter mr-10">
          <Icon icon={icon} />
        </span>
        {highlight ? (
          <span dangerouslySetInnerHTML={highlitedWord()}></span>
        ) : (
          <span>{name}</span>
        )}
        <span></span>
      </WrapperCommands>
    );
  };

  const commandsList = () => {
    const sortedCommands = commands
      .filter((c) => !c.permission || rbac.can(c.permission))
      .sort((a, b) => {
        if (a.type < b.type) return -1;
        if (a.type > b.type) return 1;

        return 0;
      });

    const _commands = [];

    const types = [];
    sortedCommands.forEach((ty, ti) => {
      if (!types.includes(ty.type)) {
        types.push(ty.type);
      }
    });

    types.forEach((type, typeIndex) => {
      const filtered = sortedCommands.filter((scItem) => scItem.type === type);

      const cmdGroup = filtered.map((item, index) => {
        if (filtered.length - 1 === index) {
          return { ...item, lastIndex: true };
        } else {
          return { ...item, lastIndex: false };
        }
      });

      _commands.push(...cmdGroup);
    });

    return _commands;
  };

  return (
    <>
      <CommandPlatteGlobalStyles />
      <CommandPalette
        renderCommand={RenderCommand}
        header={renderHeader()}
        maxDisplayed={
          commands.filter((c) => !c.permission || rbac.can(c.permission)).length
        }
        defaultInputValue=""
        commands={commandsList()}
        hotKeys={['ctrl+shift+p', 'command+shift+p']}
        showSpinnerOnSelect={false}
        closeOnSelect
        resetInputOnClose
        theme={theme}
      />
    </>
  );
};

const Wrapperheader = styled.div`
  padding: 13px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  h3,
  h5 {
    margin: 0;
    color: #454545;
    font-size: 16px;
  }

  i,
  .label {
    backgorund: ${(props: IThemeProps) => props?.theme?.colors?.paletteBtn}
    display: flex;
    align-items: center;
    padding: 11px 12px;
    border-radius: 5px;
    justify-content: center;
    font-size: 10px;
    font-weight: 400;
    color: #FFFFFF
  }
  .icon {
    padding: 11px 12px;
  }
`;

interface IWrapperCommandsProps extends DivProps {
  isLastindex: boolean;
}

const WrapperCommands = styled.div<IWrapperCommandsProps>`
border-bottom: ${(props) =>
  props.isLastindex ? `1.5px solid #cbcccd` : `none`};

`;
