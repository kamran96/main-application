import { EditableTable } from '@invyce/editable-table';
import { Button, Card, Col, Form, Input, Row, Breadcrumb } from 'antd';
import { TransactionManager, useTransaction } from './manager';
import { Wrapper } from './styles';
import bxPlus from '@iconify-icons/bx/bx-plus';
import Icon from '@iconify/react';
import { DatePicker } from '../../../../components/DatePicker';
import dayjs from 'dayjs';
import { BreadCrumbArea } from '../../../../components/BreadCrumbArea';
import { ISupportedRoutes } from '../../../../modal/routing';
import { Link } from 'react-router-dom';
import { Heading } from '../../../../components/Heading';
import TextArea from 'antd/lib/input/TextArea';
const Editor = () => {
  // ****** HOOKS IMPLEMENTATION ******
  const { columns, transactionsList, setTransactionsList, addRow } =
    useTransaction();
  const [form] = Form.useForm();

  // JSX RENDER
  return (
    <>
      <BreadCrumbArea>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to={`/app${ISupportedRoutes.TRANSACTIONS}`}>
              Journal Entries
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Journal Entry</Breadcrumb.Item>
        </Breadcrumb>
      </BreadCrumbArea>

      <div className="mb-10">
        <Heading type="table">Journal Entry</Heading>
      </div>
      <Card>
        <Wrapper>
          <Form layout="vertical" form={form}>
            <Row gutter={24}>
              <Col span={5}>
                <Form.Item
                  name="ref"
                  label="Reference #"
                  rules={[{ required: true, message: 'Required !' }]}
                >
                  <Input size="middle" />
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item
                  name="date"
                  label="Date"
                  rules={[{ required: true, message: 'Required !' }]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    size="middle"
                    disabledDate={(current) => {
                      return current > dayjs().endOf('day');
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <div className="table-wrapper mb-20">
              <EditableTable
                loading={false}
                dragable={(data) => setTransactionsList(data)}
                columns={columns}
                data={transactionsList}
                scrollable={{ offsetY: 400, offsetX: 0 }}
              />
              <div className="add_item mt-10">
                <Button
                  className="flex alignCenter"
                  onClick={addRow}
                  type="primary"
                  ghost
                >
                  <span className="flex alignCenter mr-10">
                    <Icon icon={bxPlus} />
                  </span>
                  Add line item
                </Button>
              </div>
            </div>
            <Row gutter={24}>
              <Col span={9}>
                <Form.Item required={true} label="Narration" name="narration">
                  <TextArea size="small" className="mh-10" rows={3} />
                </Form.Item>
              </Col>
              <Col span={9}>
                <Form.Item required={true} label="Notes" name="notes">
                  <TextArea size="small" className="mh-10" rows={3} />
                </Form.Item>
              </Col>
              <Col className="flex alignFEnd justifyFlexEnd" span={6}>
                <Form.Item>
                  <Button className="mr-10" type="default">
                    Save
                  </Button>
                  <Button type="primary">Approve</Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Wrapper>
      </Card>
    </>
  );
};

export const TransactionsWidget = () => {
  return (
    <TransactionManager>
      <Editor />
    </TransactionManager>
  );
};
