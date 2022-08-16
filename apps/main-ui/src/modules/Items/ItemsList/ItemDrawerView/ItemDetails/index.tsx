import React, { FC } from 'react';
import { Col, Row } from 'antd';
import { Seprator } from '../../../../../components/Seprator';
import dayjs from 'dayjs';
import { Card } from '../../../../../components/Card';
import { ISupportedRoutes } from '../../../../../modal';
import { Link } from 'react-router-dom';
import moneyFormat from '../../../../../utils/moneyFormat';

interface IProps {
  result: any;
  id: number | string;
}

export const ItemDetails: FC<IProps> = ({ result, id }) => {
  const TruncateString = (str: string, length: number) => {
    if (str.length > length) {
      return str.substring(0, length) + '...';
    }
    return str + '.';
  };

  return (
    <Card className="_itemdetailcard">
      <div className="flex">
        <h3>Item Details</h3>
      </div>
      <Seprator />
      <Row gutter={16}>
        <Col span={7}>
          <h4>Item Code: </h4>
        </Col>
        <Col span={15}>
          <h4>{result?.code}</h4>
        </Col>
        <Col span={7}>
          <h4>Item Name: </h4>
        </Col>
        <Col span={15} className="capitalize">
          <h4> {result?.name}</h4>
        </Col>
        <Col span={7}>
          <h4>Item Purcahse Price: </h4>
        </Col>
        <Col span={15}>
          <h4>{moneyFormat(result?.price?.purchasePrice)}</h4>
        </Col>
        <Col span={7}>
          <h4>Item Sale Price: </h4>
        </Col>
        <Col span={15}>
          <h4>{moneyFormat(result?.price?.salePrice)}</h4>
        </Col>
        <Col span={7}>
          <h4>Description: </h4>
        </Col>
        <Col span={15}>
          <h4>{TruncateString(result?.description, 70)}</h4>
        </Col>
        <Col span={7}>
          <h4>Added Date: </h4>
        </Col>
        <Col span={15}>
          <h4>{dayjs(result?.createdAt).format('DD/MM/YYYY h:mm A')}</h4>
        </Col>
      </Row>
      <Seprator />
    </Card>
  );
};
