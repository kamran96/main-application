import { Button, Col, Row, Drawer, Space } from 'antd';
import dayjs from 'dayjs';
import React, { FC, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { getItemDetail, getItemByIDAPI } from '../../../../api';
import { Card, Seprator } from '@components';
import { useGlobalContext } from '../../../../hooks/globalContext/globalContext';
import {
  ISupportedRoutes,
  IItemViewResult,
  IItemViewResponse,
} from '@invyce/shared/types';
import moneyFormat from '../../../../utils/moneyFormat';
import { SummaryItem } from './SummaryItem';
import view from '@iconify-icons/carbon/view';
import boxes from '@iconify-icons/bi/boxes';
import fileText from '@iconify-icons/feather/file-text';
import InvoiceIcon from '@iconify-icons/mdi/file-document-box-plus';
import Icon from '@iconify/react';
import { ItemSalesGraph } from '../ItemsView/ItemSalesGraph';
import { WrapperItemsView, ItemDrawer } from './SummaryItem/styles';
import { ItemDetails } from './ItemDetails';

interface Iprops {
  showItemDetails: any;
  setShowItemsDetails: (payload: any) => void;
}

export const ItemsViewContainer: FC<Iprops> = ({
  showItemDetails,
  setShowItemsDetails,
}) => {
  /* HOOKS HERE */
  const { routeHistory, setItemsModalConfig } = useGlobalContext();
  const { visibility } = showItemDetails;
  const { location } = routeHistory.history;
  const [apiConfig, setApiConfig] = useState({
    id: null,
    start: dayjs(),
    end: dayjs(),
  });

  const [{ result, message }, setItemDetails] = useState<IItemViewResult>({
    result: null,
    message: '',
  });

  useEffect(() => {
    const routeId = location.pathname.split(
      `${ISupportedRoutes.DASHBOARD_LAYOUT}${ISupportedRoutes.ITEMS}/`
    )[1];
    setApiConfig({ ...apiConfig, id: routeId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const { data: itemViewResponse } = useQuery(
    [`item-details-${showItemDetails?.id}`, showItemDetails?.id],
    getItemByIDAPI,
    {
      enabled: !!showItemDetails?.id,
    }
  );

  useEffect(() => {
    if (itemViewResponse?.data?.result) {
      setItemDetails(itemViewResponse?.data);
    }
  }, [itemViewResponse]);

  return (
    <ItemDrawer
      title={<span className="capitalize">{result?.name}</span> || ''}
      placement="right"
      size={'large'}
      onClose={() => setShowItemsDetails({ visibility: false, id: null })}
      visible={visibility}
      // closable={false}
      extra={
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            position: 'absolute',
            top: '15px',
            right: '4rem',
            cursor: 'pointer',
          }}
        >
          {/* <Link to={`/app${ISupportedRoutes.ITEMS}/${showItemDetails.id}`}>
            <Icon icon={view} style={{ color: '#1E75F1' }} /> View More Details
          </Link> */}
        </div>
      }
    >
      <WrapperItemsView>
        <Row gutter={10}>
          <Col
            xxl={{ span: 24 }}
            xl={{ span: 24 }}
            lg={{ span: 24 }}
            md={{ span: 24 }}
            sm={{ span: 24 }}
            xs={{ span: 24 }}
          >
            <Card className="_itemdetailcard">
              <div className="flex  justifySpaceBetween ml-10">
                <h3>Overview</h3>
                <Button
                  onClick={() => setItemsModalConfig(true, showItemDetails.id)}
                  type="link"
                  size="small"
                >
                  Edit Item
                </Button>
              </div>
              <Seprator />
              <Row gutter={12}>
                <Col
                  className="gutter-row"
                  xxl={{ span: 8 }}
                  xl={{ span: 8 }}
                  lg={{ span: 8 }}
                  md={{ span: 8 }}
                  sm={{ span: 8 }}
                  xs={{ span: 8 }}
                >
                  <SummaryItem
                    footerDesc="Total Stock"
                    icon_bg="_color"
                    icon={<Icon color="#1f9dff" icon={boxes} />}
                    amount={(result && result.stock) || 0}
                    card={'#EAF6FF'}
                  />
                </Col>
                <Col
                  className="gutter-row"
                  xxl={{ span: 8 }}
                  xl={{ span: 8 }}
                  lg={{ span: 8 }}
                  md={{ span: 8 }}
                  sm={{ span: 8 }}
                  xs={{ span: 8 }}
                >
                  <SummaryItem
                    footerDesc="Total Purchases"
                    icon_bg="_color3"
                    icon={<Icon color="#F19700" icon={InvoiceIcon} />}
                    amount={moneyFormat(
                      result?.totalBillsAmount ? result?.totalBillsAmount : 0
                    )}
                    card={'#FFF4E2'}
                  />
                </Col>
                <Col
                  className="gutter-row"
                  xxl={{ span: 8 }}
                  xl={{ span: 8 }}
                  lg={{ span: 8 }}
                  md={{ span: 8 }}
                  sm={{ span: 8 }}
                  xs={{ span: 8 }}
                >
                  <SummaryItem
                    footerDesc="Total Sales"
                    icon_bg="_color2"
                    icon={<Icon color="#43C175" icon={fileText} />}
                    amount={moneyFormat(
                      result?.totalInvoicesAmount
                        ? result?.totalInvoicesAmount
                        : 0
                    )}
                    card={'#E3FFEE'}
                  />
                </Col>
              </Row>
              <ItemDetails result={result} id={showItemDetails.id} />
              {/* <ItemSalesGraph id={showItemDetails?.id} /> */}
            </Card>
          </Col>
        </Row>
      </WrapperItemsView>
    </ItemDrawer>
  );
};
