import graphDown from '@iconify-icons/bi/graph-down';
import graphUp from '@iconify-icons/bi/graph-up';
import bxDollar from '@iconify-icons/bx/bx-dollar';
import fileText from '@iconify-icons/feather/file-text';
import alertOutline from '@iconify-icons/mdi/alert-outline';
import checkboxMultipleBlankOutline from '@iconify-icons/mdi/checkbox-multiple-blank-outline';
import Icon from '@iconify/react';
import { Button, Col, Row } from 'antd';
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
import { ItemSalesGraph } from './ItemSalesGraph';
import { SummaryItem } from './SummaryItem';
import { WrapperItemsView } from './SummaryItem/styles';
import { TopItemsOverview } from './TopItemOverview';

export const ItemsViewContainer: FC = () => {
  /* HOOKS HERE */
  const { routeHistory, setItemsModalConfig } = useGlobalContext();
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

  function truncate(source, size) {
    return source.length > size ? source.slice(0, size - 1) + '…' : source;
  }

  return (
    <WrapperItemsView>
      <div className="flex justifySpaceBetween">
        <Heading type="table">{result && result.name}</Heading>
        <div className="_filter textRight mb-10">
          <CustomDateRange
            size="small"
            onChange={(dates) => {
              if (dates && dates.length) {
                setApiConfig({ ...apiConfig, start: dates[0], end: dates[1] });
              } else {
                setApiConfig({ ...apiConfig, start: dayjs(), end: dayjs() });
              }
            }}
          />
        </div>
      </div>
      <Row gutter={24}>
        <Col
          className="gutter-row"
          xxl={{ span: 6 }}
          xl={{ span: 6 }}
          lg={{ span: 12 }}
          md={{ span: 12 }}
          sm={{ span: 24 }}
          xs={{ span: 24 }}
        >
          <SummaryItem
            footerDesc="Sum of invoice build"
            icon_bg="_color"
            icon={<Icon color="#1f9dff" icon={bxDollar} />}
            amount={(result.quantitystock && result.quantitystock) || 0}
          />
        </Col>

        <Col
          className="gutter-row"
          xxl={{ span: 6 }}
          xl={{ span: 6 }}
          lg={{ span: 12 }}
          md={{ span: 12 }}
          sm={{ span: 24 }}
          xs={{ span: 24 }}
        >
          <SummaryItem
            icon_bg="_color1"
            footerDesc="Sum of Purchase made"
            icon={<Icon color="#fbce30" icon={bxDollar} />}
            amount={moneyFormat(
              result.purchaseamount ? result.purchaseamount : 0
            )}
          />
        </Col>
        <Col
          className="gutter-row"
          xxl={{ span: 6 }}
          xl={{ span: 6 }}
          lg={{ span: 12 }}
          md={{ span: 12 }}
          sm={{ span: 24 }}
          xs={{ span: 24 }}
        >
          <SummaryItem
            icon_bg="_color2"
            footerDesc="Sum of Invoice created"
            icon={<Icon color="#1fff79" icon={fileText} />}
            amount={(result && result.salecount) || 0}
          />
        </Col>
        <Col
          className="gutter-row"
          xxl={{ span: 6 }}
          xl={{ span: 6 }}
          lg={{ span: 12 }}
          md={{ span: 12 }}
          sm={{ span: 24 }}
          xs={{ span: 24 }}
        >
          <SummaryItem
            icon_bg="_color3"
            footerDesc="Total Sales"
            icon={<Icon color="#3f1fff" icon={bxDollar} />}
            amount={moneyFormat(result.saleamount ? result.saleamount : 0)}
          />
        </Col>
      </Row>
      <Row gutter={25}>
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
                <p>
                  {result?.description && truncate(result.description, 120)}
                </p>
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
      <Row gutter={24}>
        <Col
          xxl={{ span: 16 }}
          xl={{ span: 24 }}
          lg={{ span: 24 }}
          md={{ span: 24 }}
          sm={{ span: 24 }}
          xs={{ span: 24 }}
        >
          <Card className="_topitemcard">
            <div className="flex  justifySpaceBetween">
              <h4>Top 5 Items</h4>
              <Button
                onClick={() => history.push(`/app${ISupportedRoutes.ITEMS}`)}
                type="link"
                size="small"
              >
                View all
              </Button>
            </div>
            <Seprator />
            <TopItemsOverview />
          </Card>
        </Col>
        <Col
          xxl={{ span: 8 }}
          xl={{ span: 8 }}
          lg={{ span: 24 }}
          md={{ span: 24 }}
          sm={{ span: 24 }}
          xs={{ span: 24 }}
        >
          <Card className="_otherlinkcard ">
            <div className="flex justifySpaceBetween">
              <h4>Other Links</h4>
            </div>
            <Seprator />
            <div className="flex datalinkcard">
              <Icon icon={graphDown} />
              <Link to="">Slowly moving items</Link>
            </div>
            <div className="flex datalinkcard">
              <Icon icon={graphUp} />
              <Link to="">Fast moving items</Link>
            </div>
            <div className="flex datalinkcard">
              <Icon icon={alertOutline} />
              <Link to="">Expiring soon items</Link>
            </div>
            <div className="flex datalinkcard">
              <Icon icon={checkboxMultipleBlankOutline} />
              <Link to="">Suggested items for purchase order</Link>
            </div>
          </Card>
        </Col>
      </Row>
    </WrapperItemsView>
  );
};
