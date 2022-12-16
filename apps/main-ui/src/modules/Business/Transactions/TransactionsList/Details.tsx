import { FC } from 'react';
import styled from 'styled-components';
import { Drawer, Col, Row } from 'antd';
import printIcon from '@iconify-icons/bytesize/print';
import {
  ArrowButton,
  TransactionApprovePdf,
  PDFICON,
  CommonTable,
} from '@components';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ButtonTag } from '../../../../components/ButtonTags';
import dayJs from 'dayjs';
import { moneyFormatJs } from '@invyce/common';
import { TransactionsType } from '@invyce/shared/types';
import { ColumnsType } from 'antd/lib/table';

interface DataType {
  key: string;
  account: string;
  description: string;
  debit: string;
  credit: string;
}

const columns: ColumnsType<any> = [
  {
    title: 'Account',
    dataIndex: 'account',
    key: 'account',
    render: (data, row, index) => data?.name,
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'Debit',
    dataIndex: 'amount',
    key: 'amount',
    render: (data, row, index) =>
      row?.transactionType === TransactionsType.DEBIT ? data : '-',
  },
  {
    title: 'Credit',
    dataIndex: 'amount',
    key: 'amount',
    render: (data, row, index) =>
      row?.transactionType === TransactionsType.CREDIT ? data : '-',
  },
];

interface IProps {
  onClose: () => void;
  visible: boolean;
  data: any;
}

const headerprops = {
  organizationName: '',
  city: '',
  country: '',
  title: 'Journal Entries',
  organizationContact: '',
  organizationEmail: '',
  address: '',
  code: '',
  logo: '',
  website: '',
};

export const TransactionDetail: FC<IProps> = ({ onClose, visible, data }) => {
  console.log(data, 'data');
  const renderTitleArea = () => {
    return (
      <div className="flex alignCenter justifySpaceBetween">
        <div className="flex alignCenter">
          <ArrowButton className="mr-10" onClick={() => null} iconType="left" />
          <ArrowButton onClick={() => null} iconType="right" />
        </div>
        <div className="flex alignCenter mr-30">
          <ButtonTag
            className="mr-10"
            onClick={() => console.log('')}
            title="Print"
            size="middle"
            icon={printIcon}
          />
          <PDFDownloadLinkWrapper
            document={
              <TransactionApprovePdf
                resultData={[] as any}
                header={headerprops}
              />
            }
          >
            <div className="flex alignCenter">
              <PDFICON className="flex alignCenter mr-5" />
              <span> Download PDF</span>
            </div>
          </PDFDownloadLinkWrapper>
        </div>
      </div>
    );
  };
  return (
    <CustomDrawer
      title={renderTitleArea()}
      placement="right"
      onClose={onClose}
      visible={visible}
      getContainer={false}
      mask={false}
      maskClosable={false}
      width={1000}
    >
      <WrapperTransactionDetails>
        <div className="title">Transaction details</div>
        <div className="drawerBody">
          <Row gutter={[0, 38]}>
            <Col
              xxl={{ span: 24 }}
              xl={{ span: 24 }}
              lg={{ span: 24 }}
              md={{ span: 24 }}
              sm={{ span: 24 }}
              xs={{ span: 24 }}
            >
              <Row gutter={[0, 38]}>
                <Col xs={{ span: 2 }} lg={{ span: 2 }}>
                  <h3>Date: </h3>
                </Col>
                <Col span={4}>
                  <p>{dayJs(data?.createdAt).format('D MMMM, YYYY')}</p>
                </Col>
                <Col xs={{ span: 2 }} lg={{ span: 2 }}>
                  <h3>Ref: </h3>
                </Col>
                <Col span={6}>
                  <p>{data?.ref}</p>
                </Col>
                <Col xs={{ span: 2 }} lg={{ span: 3 }}>
                  <h3>Amount: </h3>
                </Col>
                <Col span={5}>
                  <p>{moneyFormatJs(data?.amount)} </p>
                </Col>
                <Col xs={{ span: 4 }} lg={{ span: 4 }}>
                  <h3>Narration: </h3>
                </Col>
                <Col span={10}>
                  <p>{data?.narration} </p>
                </Col>
                <Col span={2}>
                  <h3>ID: </h3>
                </Col>
                <Col span={4}>
                  <p>{data?.id}</p>
                </Col>
              </Row>
            </Col>
          </Row>
          <div className="tableArea">
            <CommonTable
              columns={columns}
              dataSource={data?.transactionItems}
              pagination={false}
            />
          </div>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      </WrapperTransactionDetails>
    </CustomDrawer>
  );
};

const WrapperTransactionDetails = styled.div`
  padding: 0;
  .title {
    background: #f5f5f5;
    padding: 12px 20px;
  }
  .drawerBody {
    padding: 30px;
  }
  .tableArea {
    padding: 15px 0;
  }
`;

const CustomDrawer = styled(Drawer)`
  .ant-drawer-body {
    padding: 0 !important;
  }
`;

const PDFDownloadLinkWrapper = styled(PDFDownloadLink)`
  border: 1px solid #f5f5f5;
  padding: 5px;
  border-radius: 5px;
  cursor: pointer;
  color: #585858;
`;
