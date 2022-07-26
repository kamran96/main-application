import { Button, Col, Row, Drawer } from 'antd';
import dayjs from 'dayjs';
import React, { FC, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { getItemDetail } from '../../../../api';
import { Card } from '../../../../components/Card';
import { CustomDateRange } from '../../../../components/DateRange';
import { Heading } from '../../../../components/Heading';
import { Seprator } from '../../../../components/Seprator';
import { useGlobalContext } from '../../../../hooks/globalContext/globalContext';
import { ISupportedRoutes } from '../../../../modal';
import { IItemViewResponse } from '../../../../modal/items';
import moneyFormat from '../../../../utils/moneyFormat';
import { SummaryItem } from './SummaryItem';
import graphDown from '@iconify-icons/bi/graph-down';
import graphUp from '@iconify-icons/bi/graph-up';
import bxDollar from '@iconify-icons/bx/bx-dollar';
import fileText from '@iconify-icons/feather/file-text';
import alertOutline from '@iconify-icons/mdi/alert-outline';
import checkboxMultipleBlankOutline from '@iconify-icons/mdi/checkbox-multiple-blank-outline';
import Icon from '@iconify/react';
import { ItemSalesGraph } from './ItemSalesGraph';
import { WrapperItemsView } from './SummaryItem/styles';

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
  const { visibility, itemId } = showItemDetails;
  const { history } = routeHistory;
  const { location } = routeHistory.history;
  const [apiConfig, setApiConfig] = useState({
    id: null,
    start: dayjs(),
    end: dayjs(),
  });
  const { id, start, end } = apiConfig;
  const [{ result, message }, setItemDetails] = useState<IItemViewResponse>({
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

  const { data: itemDetailData, isLoading: itemDetailFetching } = useQuery(
    [
      `item-detail-${id}-startDate=${start}-endDate=${end}`,
      {
        id,
        start,
        end,
      },
    ],
    getItemDetail,
    {
      enabled: !!id,
    }
  );

  useEffect(() => {
    if (itemDetailData && itemDetailData.data && itemDetailData.data.result) {
      setItemDetails(itemDetailData.data);
    }
  }, [itemDetailData]);

  return (
    <Drawer
      title={result?.name}
      placement="right"
      onClose={() => setShowItemsDetails({ visibility: false, id: null })}
      visible={visibility}
      width={600}
      bodyStyle={{
        backgroundColor: "#EFEFEF"
      }}
    >
      <WrapperItemsView>
        {/* <Row gutter={10}>
        <Col
          className="gutter-row"
          xxl={{ span: 3 }}
          xl={{ span: 3 }}
          lg={{ span: 6 }}
          md={{ span: 6 }}
          sm={{ span: 10 }}
          xs={{ span: 10 }}
        >
          <SummaryItem
            footerDesc="Sum of invoice build"
            icon_bg="_color"
            icon={<Icon color="#1f9dff" icon={bxDollar} />}
            amount={(result && result.quantitystock) || 0}
          />
        </Col>
      </Row> */}

        <Row gutter={10}>
          <Col
            xxl={{ span: 12 }}
            xl={{ span: 12 }}
            lg={{ span: 24 }}
            md={{ span: 24 }}
            sm={{ span: 24 }}
            xs={{ span: 24 }}
          >
            <Card className="_itemdetailcard">
              <div className="flex  justifySpaceBetween">
                <h4>Item Details</h4>
                <Button
                  onClick={() => setItemsModalConfig(true, id)}
                  type="link"
                  size="small"
                >
                  Edit Item
                </Button>
              </div>
              <Seprator />
              <Row gutter={16}>
                <Col span={7}>
                  <h3>Title: </h3>
                </Col>
                <Col span={15}>
                  <p>{result && result.name}</p>
                </Col>
                <Col span={7}>
                  <h3>Description: </h3>
                </Col>
                <Col span={15}>
                  <p>{result && result.description}</p>
                </Col>
                <Col span={7}>
                  <h3>Added Date: </h3>
                </Col>
                <Col span={15}>
                  <p>
                    {result &&
                      result.addeddate &&
                      dayjs(result.addeddate).format('DD/MM/YYYY h:mm A')}
                  </p>
                </Col>
                <Col span={7}>
                  <h3>Category: </h3>
                </Col>
                <Col span={15}>
                  <p>{result && result.category_name}</p>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        <Row gutter={10}>
          <Col
            xxl={{ span: 12 }}
            xl={{ span: 12 }}
            lg={{ span: 24 }}
            md={{ span: 24 }}
            sm={{ span: 24 }}
            xs={{ span: 24 }}
          >
            <ItemSalesGraph id={id} />
          </Col>
        </Row>
      </WrapperItemsView>
    </Drawer>
  );
};
