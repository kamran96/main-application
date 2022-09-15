import { FC, useEffect, useState } from 'react';
import { useMutation } from 'react-query';

import { CsvImportAPi, updateThemeAPI } from '../../api';
// import { Inconvinience } from '../../components/ErrorBoundries/Inconvinience';
import { InvoiceImportManager } from '../../modules/Invoice/InvoiceImportManager';
import {
  Document,
  PDFViewer,
  PDFDownloadLink,
  renderToString,
} from '@react-pdf/renderer';
import { InvoicePDF } from '../../components/PDFs';
import { EditableTable } from '@invyce/editable-table';
import { Editable } from '../../components/Editable';
import { moneyFormatJs } from '@invyce/common';
import { InyvceLightTextIcon, InyvceDarkTextIcon } from '../../assets/icons';
import { useGlobalContext } from '../../hooks/globalContext/globalContext';
import { IRoutesSchema, ISupportedRoutes } from '@invyce/shared/types';
import { RoutingSchema } from '../../Schema/routingSchema';
import { useRbac } from '../../components/Rbac/useRbac';
import { ILoginActions } from '../../hooks/globalContext/globalManager';
import { SidebarUi } from '@invyce/sidebar-ui-v2';

const columns = [
  {
    title: 'item',
    dataIndex: 'item',
  },
  {
    title: 'item code',
    dataIndex: 'code',
  },
  {
    title: 'quantity',
    dataIndex: 'quantity',
  },
  {
    title: 'unit price',
    dataIndex: 'unitPrice',
  },
  {
    title: 'Total',
    dataIndex: 'total',
  },
];

const data = [
  {
    item: 'Gloss Enamel',
    code: '3289',
    unitPrice: '734984',
    quantity: '7',
    total: '379834',
  },
  {
    item: 'Gloss Enamel',
    code: '3289',
    unitPrice: '734984',
    quantity: '7',
    total: '379834',
  },
  {
    item: 'Gloss Enamel',
    code: '3289',
    unitPrice: '734984',
    quantity: '7',
    total: '379834',
  },
  {
    item: 'Gloss Enamel',
    code: '3289',
    unitPrice: '734984',
    quantity: '7',
    total: '379834',
  },
  {
    item: 'Gloss Enamel',
    code: '3289',
    unitPrice: '734984',
    quantity: '7',
    total: '379834',
  },
];

export const TestComponents: FC = () => {
  const { rbac } = useRbac(null);
  const { mutate: mutateCsv } = useMutation(CsvImportAPi);
  const { mutate: muateTheme } = useMutation(updateThemeAPI);
  const {
    userDetails,
    theme,
    handleLogin,
    isOnline,
    setTheme,
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

  const [data, setData] = useState([
    {
      id: '1',
      description: 'sdfjafdiosaf',
    },
  ]);

  const cols: any = [
    {
      title: 'item id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (_data, row, index) => {
        console.log(data, row, index);
        return (
          <Editable
            onChange={(e) => {
              console.log(e, 'event');
            }}
          />
        );
      },
    },
  ];



  return (
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
  )
};
