import userRole from '@iconify-icons/carbon/user-role';
import arrowDown from '@iconify-icons/feather/arrow-down';
import arrowUp from '@iconify-icons/feather/arrow-up';
import lockIcon from '@iconify-icons/feather/lock';
import usersIcon from '@iconify-icons/feather/users';
import Icon from '@iconify/react';
import { ILoginActions } from '../../../hooks/globalContext/globalManager';
import CommandPalette from 'react-command-palette';
import styled from 'styled-components';
import { PERMISSIONS } from '../../../components/Rbac/permissions';
import { useRbac } from '../../../components/Rbac/useRbac';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import { IThemeProps } from '../../../hooks/useTheme/themeColors';
import { DivProps, ISupportedRoutes } from '@invyce/shared/types';
import CommandPlatteGlobalStyles from './commandPaletteGlobalStyles';
import LogOut from '@iconify-icons/feather/log-out';
import Sun from '@iconify-icons/feather/sun';
import Moon from '@iconify-icons/feather/moon';
import {
  DraftInvoice,
  CreateInvoice,
  CreatePo,
  CreateBill,
  CreateQuote,
  Payments,
  Accounting,
  Contacts,
  Setting,
  Items,
  JournalEntry,
} from '../../../../src/assets/icons';
import { useEffect, useState } from 'react';

export const InvyceCmdPalette = () => {
  const { rbac } = useRbac(null);
  const [showClear, setShowClear] = useState(false);

  const {
    routeHistory,
    setItemsModalConfig,
    setUserInviteModal,
    handleLogin,
    setPaymentsModalConfig,
    setRbacConfigModal,
    setAccountsModalConfig,
    setTheme,
  } = useGlobalContext();
  const { history } = routeHistory;

  const commands = [
    {
      name: 'Invoice > Create',
      command: () => {
        history.push(`/app${ISupportedRoutes.CREATE_INVOICE}`);
      },
      shortcut: '',
      permission: PERMISSIONS.INVOICES_CREATE,
      icon: <CreateInvoice width={15} height={15} />,
      type: 'bussiness',
    },
    {
      name: 'Invoice > Approved',
      command: () => {
        history.push(`/app${ISupportedRoutes.INVOICES}?tabIndex=all`);
      },
      shortcut: '',
      permission: PERMISSIONS.INVOICES_INDEX,
      icon: <CreateInvoice width={15} height={15} />,
      type: 'bussiness',
    },
    {
      name: 'Invoice > Draft',
      command: () => {
        history.push(`/app${ISupportedRoutes.INVOICES}?tabIndex=draft`);
      },
      shortcut: '',
      permission: PERMISSIONS.INVOICES_INDEX,
      icon: <DraftInvoice width={15} height={15} />,
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
      icon: <DraftInvoice width={15} height={15} />,
      type: 'bussiness',
    },
    {
      name: 'Invoice > Paid',
      command: () => {
        history.push(`/app${ISupportedRoutes.INVOICES}?tabIndex=paid`);
      },
      shortcut: '',
      permission: PERMISSIONS.INVOICES_INDEX,
      icon: <DraftInvoice width={15} height={15} />,
      type: 'bussiness',
    },
    {
      name: 'Purchase Order > Create',
      command: () => {
        history.push(`/app${ISupportedRoutes.CREATE_PURCHASE_ORDER}`);
      },
      permission: PERMISSIONS.PURCHASE_ORDERS_CREATE,
      icon: <CreatePo width={15} height={15} />,
      type: 'bussiness',
    },
    {
      name: 'Purchase Order > Approved List',
      command: () => {
        history.push(`/app${ISupportedRoutes.PURCHASE_ORDER}?tabIndex=all`);
      },
      permission: PERMISSIONS.PURCHASE_ORDERS_INDEX,
      icon: <CreatePo width={15} height={15} />,
      type: 'bussiness',
    },
    {
      name: 'Purchase Order > Draft List',
      command: () => {
        history.push(`/app${ISupportedRoutes.PURCHASE_ORDER}?tabIndex=draft`);
      },
      permission: PERMISSIONS.PURCHASE_ORDERS_INDEX,
      icon: <CreatePo width={15} height={15} />,
      type: 'bussiness',
    },
    {
      name: 'Bills > Create',
      command: () => {
        history.push(`/app${ISupportedRoutes.CREATE_PURCHASE_Entry}`);
      },
      permission: PERMISSIONS.PURCHASES_CREATE,
      icon: <CreateBill width={15} height={15} />,
      type: 'bussiness',
    },
    {
      name: 'Bills > Approved List',
      command: () => {
        history.push(`/app${ISupportedRoutes.PURCHASES}?tabIndex=all`);
      },
      permission: PERMISSIONS.PURCHASES_INDEX,
      icon: <CreateBill width={15} height={15} />,
      type: 'bussiness',
    },
    {
      name: 'Bills > Draft List',
      command: () => {
        history.push(`/app${ISupportedRoutes.PURCHASES}?tabIndex=draft`);
      },
      permission: PERMISSIONS.PURCHASES_INDEX,
      icon: <CreateBill width={15} height={15} />,
      type: 'bussiness',
    },

    {
      name: 'Quotation > Create',
      command: () => {
        history.push(`/app${ISupportedRoutes.CREATE_QUOTE}`);
      },
      permission: PERMISSIONS.QUOTATIONS_CREATE,
      icon: <CreateQuote width={15} height={15} />,
      type: 'bussiness',
    },
    {
      name: 'Payments > Create',
      command: () => {
        setPaymentsModalConfig(true);
      },
      permission: PERMISSIONS.PAYMENTS_CREATE,
      icon: <Payments width={15} height={15} />,
      type: 'bussiness',
    },
    {
      name: 'Payments > Paid List',
      command: () => {
        history.push(`/app${ISupportedRoutes.PAYMENTS}?tabIndex=paid`);
      },
      permission: PERMISSIONS.PAYMENTS_INDEX,
      icon: <Payments width={15} height={15} />,
      type: 'bussiness',
    },
    {
      name: 'Payments > Recieved List',
      command: () => {
        history.push(`/app${ISupportedRoutes.PAYMENTS}?tabIndex=received`);
      },
      permission: PERMISSIONS.PAYMENTS_INDEX,
      icon: <Payments width={15} height={15} />,
      type: 'bussiness',
    },
    {
      name: 'Roles > Create',
      command: () => {
        setRbacConfigModal(true);
      },
      permission: PERMISSIONS.PAYMENTS_CREATE,
      icon: userRole,
      type: 'organization',
      iconify: true,
    },
    {
      name: 'Roles > List',
      command: () => {
        history.push(`/app${ISupportedRoutes.RBAC}`);
      },
      permission: PERMISSIONS.RBAC_ROLE_INDEX,
      icon: userRole,
      type: 'organization',
      iconify: true,
    },
    {
      name: 'Permissions > List',
      command: () => {
        history.push(`/app${ISupportedRoutes.PERMISSIONS}`);
      },
      permission: PERMISSIONS.RBAC_ROLE_PERMISSION_UPDATE,
      icon: lockIcon,
      type: 'organization',
      iconify: true,
    },
    {
      name: 'Chart of Accounts > List',
      command: () => {
        history.push(`/app${ISupportedRoutes.ACCOUNTS}`);
      },
      permission: PERMISSIONS.ACCOUNTS_INDEX,
      icon: <Accounting height={15} width={15} />,
      type: 'accounting',
    },
    {
      name: 'Chart of Accounts > Create',
      command: () => {
        setAccountsModalConfig({ visibility: true, id: null });
      },
      permission: PERMISSIONS.ACCOUNTS_CREATE,
      icon: <Accounting height={15} width={15} />,
      type: 'accounting',
    },
    {
      name: 'Transactions > List',
      command: () => {
        history.push(`/app${ISupportedRoutes.TRANSACTIONS}`);
      },
      permission: PERMISSIONS.TRANSACTIONS_INDEX,
      icon: <JournalEntry height={15} width={15} />,
      type: 'accounting',
    },
    {
      name: 'Transactions > Create',
      command: () => {
        history.push(`/app${ISupportedRoutes.CREATE_TRANSACTION}`);
      },
      permission: PERMISSIONS.TRANSACTIONS_CREATE,
      icon: <JournalEntry height={15} width={15} />,
      type: 'accounting',
    },

    {
      name: 'Contacts  > Customers List',
      command: () => {
        history.push(`/app${ISupportedRoutes.CONTACTS}?tabIndex=customers`);
      },
      permission: PERMISSIONS.CONTACTS_INDEX,
      icon: <Contacts width={15} height={15} />,
      type: 'contacts',
    },
    {
      name: 'Contacts  > Suppliers List',
      command: () => {
        history.push(`/app${ISupportedRoutes.CONTACTS}?tabIndex=suppliers`);
      },
      permission: PERMISSIONS.CONTACTS_INDEX,
      icon: <Contacts width={15} height={15} />,
      type: 'contacts',
    },
    {
      name: 'Contacts > Create',
      command: () => {
        history.push(`/app${ISupportedRoutes.CREATE_CONTACT}`);
      },
      permission: PERMISSIONS.CONTACTS_CREATE,
      icon: <Contacts width={15} height={15} />,
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
      iconify: true,
    },
    {
      name: 'Users > Create',
      command: () => {
        setUserInviteModal(true);
      },
      permission: PERMISSIONS.USERS_CREATE,
      icon: usersIcon,
      type: 'users',
      iconify: true,
    },
    {
      name: 'Items > Create',
      command: () => {
        setItemsModalConfig(true);
      },
      permission: PERMISSIONS.ITEMS_CREATE,
      icon: <Items width={15} height={15} />,
      type: 'bussiness',
    },
    {
      name: 'Items > Items List',
      command: () => {
        history.push(`/app${ISupportedRoutes.ITEMS}`);
      },
      permission: PERMISSIONS.ITEMS_INDEX,
      icon: <Items width={15} height={15} />,
      type: 'bussiness',
    },
    {
      name: 'Settings > Profile Settings',
      command: () => {
        history.push(`/app${ISupportedRoutes.PROFILE_SETTING}`);
      },
      icon: <Setting width={15} height={15} />,
      type: 'zsettings',
    },
    {
      name: 'Settings > Account Setting',
      command: () => {
        history.push(`/app${ISupportedRoutes.ACCOUNT_SETTING}`);
      },
      icon: <Setting width={15} height={15} />,
      type: 'zsettings',
    },
    {
      name: 'Logout',
      command: () => {
        handleLogin({ type: ILoginActions.LOGOUT });
      },
      icon: LogOut,
      type: 'zz',
      iconify: true,
    },
    {
      name: 'Light Mode',
      command: () => {
        setTheme('light');
      },
      icon: Sun,
      type: 'zz',
      iconify: true,
    },
    {
      name: 'Dark Mode',
      command: () => {
        setTheme('dark');
      },
      icon: Moon,
      type: 'zz',
      iconify: true,
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
        {/* <h3 className="mr-20">Search for a Command</h3> */}
        <div className="flex alignCenter ">
          <i className="label icon mr-10">
            <Icon icon={arrowUp} />
            <Icon icon={arrowDown} />
          </i>
          <h5>To navigate</h5>
        </div>

        <div className="flex alignCenter">
          <div className="label mr-10 itm">Enter</div>
          <h5>To select</h5>
        </div>
        <div className="flex alignCenter">
          <div className="label mr-10 itm">Esc</div>
          <h5>To dismiss</h5>
        </div>
      </Wrapperheader>
    );
  };

  const RenderCommand = (suggestion) => {
    const ele = document?.querySelector('.invyce-modal');

    useEffect(() => {
      if (ele && ele !== null) {
        ele?.children[0].classList.add('wrapper-palate');
        ele.append();
      }
    }, [ele]);

    const inputEleParent = document.querySelector('.invyce-container');
    const invyceSuggestionsContainer = document.querySelector(
      '.invyce-suggestionsContainer'
    );

    useEffect(() => {
      if (
        invyceSuggestionsContainer &&
        invyceSuggestionsContainer !== null &&
        !invyceSuggestionsContainer.children[0].classList.contains(
          'SearchHeader'
        )
      ) {
        const heading = document.createElement('p');
        heading.innerHTML = 'Recent Searches';
        heading.classList.add('SearchHeader');
        invyceSuggestionsContainer.insertBefore(
          heading,
          invyceSuggestionsContainer.children[0]
        );
      }
    }, [invyceSuggestionsContainer]);

    //invyce Container
    useEffect(() => {
      if (showClear && !inputEleParent.children[2]) {
        const Iele = document.createElement('i');
        Iele.classList.add('crossBtn');
        Iele.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.0637 8.31567C16.0637 8.21255 15.9793 8.12817 15.8762 8.12817L14.3293 8.13521L11.9996 10.9125L9.67227 8.13755L8.12305 8.13052C8.01992 8.13052 7.93555 8.21255 7.93555 8.31802C7.93555 8.36255 7.95195 8.40474 7.98008 8.43989L11.0293 12.0727L7.98008 15.7032C7.95176 15.7375 7.93604 15.7805 7.93555 15.8251C7.93555 15.9282 8.01992 16.0126 8.12305 16.0126L9.67227 16.0055L11.9996 13.2282L14.327 16.0032L15.8738 16.0102C15.977 16.0102 16.0613 15.9282 16.0613 15.8227C16.0613 15.7782 16.0449 15.736 16.0168 15.7008L12.9723 12.0704L16.0215 8.43755C16.0496 8.40474 16.0637 8.36021 16.0637 8.31567Z" fill="white"/>
        <path d="M12 1.52344C6.20156 1.52344 1.5 6.225 1.5 12.0234C1.5 17.8219 6.20156 22.5234 12 22.5234C17.7984 22.5234 22.5 17.8219 22.5 12.0234C22.5 6.225 17.7984 1.52344 12 1.52344ZM12 20.7422C7.18594 20.7422 3.28125 16.8375 3.28125 12.0234C3.28125 7.20938 7.18594 3.30469 12 3.30469C16.8141 3.30469 20.7188 7.20938 20.7188 12.0234C20.7188 16.8375 16.8141 20.7422 12 20.7422Z" fill="white"/>
        </svg>        
        `;
        inputEleParent.appendChild(Iele);
      } else if (showClear && inputEleParent.children[2]) {
        inputEleParent.children[2].classList.remove('hide');
      } else if (!showClear && inputEleParent.children[2]) {
        inputEleParent.children[2].classList.add('hide');
      }
    }, [inputEleParent]);

    const { icon, name, highlight, type, lastIndex, iconify } = suggestion;

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
        <span className="flex icons alignCenter mr-10">
          {/* <Icon icon={icon} /> */}
          {iconify ? <Icon icon={icon} /> : icon}
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
        hotKeys={['ctrl+k', 'command+k']}
        showSpinnerOnSelect={false}
        closeOnSelect
        resetInputOnClose
        theme={theme}
        placeholder="Search in Invyce"
        filterSearchQuery={(inputVal) => {
          return inputVal;
        }}
        onChange={(newValue) => {
          newValue ? setShowClear(true) : setShowClear(false);
        }}
      />
    </>
  );
};

const Wrapperheader = styled.div`
  padding: 10px 24px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-top: 1px solid
    ${(props: IThemeProps) => props?.theme?.colors?.paletteBorder};

  h3,
  h5 {
    margin: 0 5px;
    color: ${(props: IThemeProps) => props?.theme?.colors?.itmText};
    font-size: 16px;
    padding-left: 2px;
  }
  .itm {
    background-color: ${(props: IThemeProps) =>
      props?.theme?.colors?.paletteBtn};
    border-radius: 5px;
    padding: 6px 10px;
  }

  i,
  .label {
    display: flex;
    align-items: center;
    justify-content: space-around;
    font-size: 14px;
    height: 100%;
  }
  .icon {
    width: 46px;
    height: 32px;
    background-color: ${(props: IThemeProps) =>
      props?.theme?.colors?.paletteBtn};
    border-radius: 5px;
  }
`;

interface IWrapperCommandsProps extends DivProps {
  isLastindex: boolean;
}

const WrapperCommands = styled.div<IWrapperCommandsProps>`
  svg {
    path {
      stroke: ${(props: IThemeProps) =>
        props?.theme?.colors?.sidebarDefaultText};
    }

    .ItemsIconsColor {
      fill: ${(props: IThemeProps) =>
        props?.theme?.theme === 'dark' ? 'transparent' : 'transparent'};
    }

    .itemStroke {
      stroke: none;
    }
    .ItemsFill {
      fill: ${(props: IThemeProps) =>
        props?.theme?.theme === 'dark' ? '#C2C2C2' : ''};
    }
  }
`;
