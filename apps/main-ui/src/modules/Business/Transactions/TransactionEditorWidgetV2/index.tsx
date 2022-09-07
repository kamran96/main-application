import { EditableTable } from '@invyce/editable-table';
import { Button, Card, Col, Form, Input, Row, Breadcrumb } from 'antd';
import { TransactionManager, useTransaction } from './manager';
import { Wrapper } from './styles';
import bxPlus from '@iconify-icons/bx/bx-plus';
import Icon from '@iconify/react';
import dayjs from 'dayjs';
import { ISupportedRoutes, NOTIFICATIONTYPE } from '@invyce/shared/types';
import { Link, useHistory } from 'react-router-dom';
import { Heading, BoldText, BreadCrumbArea, DatePicker } from '@components';
import TextArea from 'antd/lib/input/TextArea';
import moneyFormat from '../../../../utils/moneyFormat';
import { createTransactionAPI } from '../../../../api';
import { useMutation, useQueryClient } from 'react-query';
import { useGlobalContext } from '../../../../hooks/globalContext/globalContext';
import { ITransactionsList } from './types';
import { Status } from '@sentry/react';

const Editor = () => {
  const queryCache = useQueryClient();
  const history = useHistory();

  // ****** HOOKS IMPLEMENTATION ******
  const {
    columns,
    transactionsList,
    setTransactionsList,
    addRow,
    loading,
    id,
    resetTransactions,
    form,
  } = useTransaction();

  const { notificationCallback } = useGlobalContext();

  const { mutate: mutateCreateTransaction, isLoading: creatingTransaction } =
    useMutation(createTransactionAPI);

  const totalDebits = (transactionsList.length &&
    transactionsList.reduce((a, b) => {
      return { debit: a.debit + b.debit } as any;
    })) || { debit: 0 };
  const totalCredits = (transactionsList.length &&
    transactionsList.reduce((a, b) => {
      return { credit: a.credit + b.credit } as any;
    })) || { credit: 0 };

  const validateRows = (rows: ITransactionsList[]) => {
    const validate = rows.map((row, index) => {
      if (!row.debit && !row.credit && !row.account) {
        return {
          errorIndex: index,
          errors: {
            debitError: 'Debit or Credit is required',
            creditError: 'Debit or Credit is required',
            accountError: 'Account is required',
          },
        };
      }
      if (!row.debit && !row.credit) {
        return {
          errorIndex: index,
          errors: {
            debitError: 'Debit or Credit is required',
            creditError: 'Debit or Credit is required',
          },
        };
      }
      if (!row.account) {
        return {
          errorIndex: index,
          errors: {
            accountError: 'Account is required',
          },
        };
      }
      return {};
    });

    return validate.filter((row, index) => Object.keys(row).length > 0);
  };

  const onFinish = async (values) => {
    const errors = validateRows(transactionsList);

    if (errors.length > 0) {
      errors.forEach((err) => {
        const mutateIndex = err.errorIndex;
        const allRows = [...transactionsList];
        allRows.splice(mutateIndex, 1, {
          ...allRows[mutateIndex],
          ...err.errors,
        });
        setTransactionsList(allRows);
      });
    } else {
      const credits = [];
      const debits = [];

      transactionsList.forEach((tranc, index) => {
        if (tranc && tranc.debit > 0) {
          debits.push({
            amount: tranc.debit,
            accountId: tranc.account,
            description: tranc.description,
          });
        } else if (tranc && tranc.credit > 0) {
          credits.push({
            amount: tranc.credit,
            accountId: tranc.account,
            description: tranc.description,
          });
        }
      });

      const totalDebits = (debits?.length &&
        debits.reduce((a, b) => {
          return { amount: a.amount + b.amount };
        })) || { amount: 0 };
      const totalCredits = (credits?.length &&
        credits.reduce((a, b) => {
          return { amount: a.amount + b.amount };
        })) || { amount: 0 };

      const { amount } = debits.reduce((a, b) => {
        return { amount: a.amount + b.amount };
      });

      let payload = {
        isNewRecord: true,
        ...values,
        entries: {
          credits,
          debits,
        },
        amount,
      };

      if (id) {
        payload = { ...payload, id, isNewRecord: false };
      }

      try {
        if (totalDebits.amount === totalCredits.amount && true) {
          await mutateCreateTransaction(payload, {
            onSuccess: () => {
              resetTransactions();
              form.resetFields();
              if (form.getFieldValue('status') === 2) {
                [`transactions`]?.forEach((key) => {
                  (queryCache?.invalidateQueries as any)((q) =>
                    q?.queryKey[0]?.toString().startsWith(key)
                  );
                });
              } else {
                [
                  'accounts',
                  `transactions`,
                  `report-trialbalance`,
                  `report-balance-sheet`,
                ]?.forEach((key) => {
                  (queryCache?.invalidateQueries as any)((q) =>
                    q?.queryKey[0]?.toString().startsWith(key)
                  );
                });
              }
              notificationCallback(
                NOTIFICATIONTYPE.SUCCESS,
                'Transaction Created'
              );
              history.push(
                `${ISupportedRoutes?.DASHBOARD_LAYOUT}${ISupportedRoutes?.CREATE_TRANSACTION}`
              );
            },
          });
        } else
          throw {
            status: 501,
            message:
              "The Transaction Amount Are Not Seem's Equal Please Take A Look Again",
          };
      } catch (error) {
        if (error.status && error.status === 501) {
          notificationCallback(NOTIFICATIONTYPE.ERROR, error.message);
        }

        console.log(error, 'error');
      }
    }
  };
  const onFinishFailed = (error) => {
    console.log(error, 'check error');
  };

  // JSX RENDER
  return (
    <>
      <div>
        <Heading type="form">Journal Entry</Heading>
      </div>

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

      <Card>
        <Wrapper>
          <Form onFinish={onFinish} layout="vertical" form={form}>
            <Row gutter={24}>
              <Col span={5}>
                <Form.Item
                  name="ref"
                  label="Reference #"
                  rules={[{ required: true, message: 'Required !' }]}
                >
                  <Input size="middle" autoComplete="off" />
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
                loading={loading}
                dragable={(data) => setTransactionsList(data)}
                columns={columns}
                data={transactionsList}
                scrollable={{ offsetY: 400, offsetX: 0 }}
              />
              <table className="table-footer" style={{ width: '100%' }}>
                <colgroup>
                  {columns.map((col, index) => {
                    const { width } = col;
                    return <col key={index} style={{ width }} />;
                  })}
                </colgroup>
                <tbody>
                  <tr>
                    <td colSpan={2}></td>
                    <td colSpan={2}>
                      <BoldText>Total</BoldText>
                    </td>
                    <td>
                      <BoldText>{moneyFormat(totalDebits?.debit)}</BoldText>
                    </td>
                    <td>
                      <BoldText>{moneyFormat(totalCredits?.credit)}</BoldText>
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
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
                  Add Transaction Item
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
            </Row>
            <Row gutter={24}>
              <Col className="flex alignFEnd justifyFlexEnd" span={24}>
                <Form.Item name="status">
                  <Button
                    onClick={() => {
                      form.setFieldsValue({ status: 2 });
                      setTimeout(() => {
                        form.submit();
                      }, 200);
                    }}
                    className="mr-10"
                    type="default"
                  >
                    Save
                  </Button>
                  <Button
                    onClick={() => {
                      form.setFieldsValue({ status: 1 });
                      setTimeout(() => {
                        form.submit();
                      }, 200);
                    }}
                    type="primary"
                  >
                    Approve
                  </Button>
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
  const { routeHistory } = useGlobalContext();
  const { history } = routeHistory;

  const id =
    history &&
    history?.location &&
    history?.location?.pathname?.split('/app/journal-entry/')[1];

  return (
    <TransactionManager id={id}>
      <Editor />
    </TransactionManager>
  );
};
