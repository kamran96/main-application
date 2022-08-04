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
          <p>{result?.code}</p>
        </Col>
        <Col span={7}>
          <h4>Item Name: </h4>
        </Col>
        <Col span={15}>
          <Link to={`/app${ISupportedRoutes.ITEMS}/${id}`}>{result?.name}</Link>
        </Col>
        <Col span={7}>
          <h4>Item Purcahse Price: </h4>
        </Col>
        <Col span={15}>
          <p>{moneyFormat(result?.price?.purchasePrice)}</p>
        </Col>
        <Col span={7}>
          <h4>Item Sale Price: </h4>
        </Col>
        <Col span={15}>
          <p>{moneyFormat(result?.price?.salePrice)}</p>
        </Col>
        <Col span={7}>
          <h4>Description: </h4>
        </Col>
        <Col span={15}>
          <p>
            {result?.description} Lorem, ipsum dolor sit amet consectetur
            adipisicing elit. Reiciendis commodi maiores, id voluptas molestias
            vitae minima quidem quae voluptatibus aperiam fugiat voluptates quos
            officiis nihil praesentium provident laborum explicabo in!
          </p>
        </Col>
        <Col span={7}>
          <h4>Added Date: </h4>
        </Col>
        <Col span={15}>
          <p>{dayjs(result?.createdAt).format('DD/MM/YYYY h:mm A')}</p>
        </Col>
      </Row>
      <Seprator />
    </Card>
  );
};
