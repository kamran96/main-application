import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import { BreadCrumbArea, PurchasesView, TableCard } from '@components';
import { useGlobalContext } from '../../../../../hooks/globalContext/globalContext';
import { IInvoiceType, ISupportedRoutes } from '@invyce/shared/types';

export const PurchaseEntryView = () => {
  const { routeHistory } = useGlobalContext();
  const { pathname } = routeHistory.location;
  const invId = pathname.split(`app${ISupportedRoutes.BILLS}/`)[1];

  return (
    <>
      <BreadCrumbArea>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to={`/app${ISupportedRoutes.PURCHASES}`}>Bills</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Bill View</Breadcrumb.Item>
        </Breadcrumb>
      </BreadCrumbArea>
      <TableCard>
        <PurchasesView type={IInvoiceType.BILL} id={invId} />
      </TableCard>
    </>
  );
};
