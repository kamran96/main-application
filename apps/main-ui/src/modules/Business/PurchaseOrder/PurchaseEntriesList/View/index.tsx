import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';

import { BreadCrumbArea } from '../../../../../components/BreadCrumbArea';
import { PurchasesView } from '../../../../../components/PurchasesView';
import { TableCard } from '../../../../../components/TableCard';
import { useGlobalContext } from '../../../../../hooks/globalContext/globalContext';
import { ISupportedRoutes } from '../../../../../modal';

export const PurchaseEntryView = () => {
  const { routeHistory } = useGlobalContext();
  const { pathname } = routeHistory.location;
  const invId = pathname.split('app/purchases/')[1];

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
        <PurchasesView type="PO" id={invId} />
      </TableCard>
    </>
  );
};
