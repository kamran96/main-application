/* eslint-disable array-callback-return */
/* eslint-disable no-throw-literal */
import React, { FC, useCallback, useEffect, useState } from "react";
import { TableCard } from "../../../../components/TableCard";
import { Heading } from "../../../../components/Heading";
import { Button, Col, Form, Input, Row, Select, Spin } from "antd";
import { FormLabel } from "../../../../components/FormLabel";
import { ListItem } from "./ListItem";
import update from "immutability-helper";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { queryCache, useMutation, useQuery } from "react-query";
import { getAllAccounts, getRecentAccounts } from "../../../../api/accounts";
import { createTransactionAPI } from "../../../../api";
import { IAccountsResult } from "../../../../modal/accounts";
import { Editable } from "../../../../components/Editable";
import moneyFormat from "../../../../utils/moneyFormat";
import { NOTIFICATIONTYPE } from "../../../../modal";
import { useGlobalContext } from "../../../../hooks/globalContext/globalContext";
import { Icon } from "@iconify/react";
import deleteIcon from "@iconify/icons-carbon/delete";
import { WrapperTransactionEditor } from "./styles";
import TextArea from "antd/lib/input/TextArea";
import addLine from "@iconify/icons-ri/add-line";
import { DatePicker } from "../../../../components/DatePicker";
import dayjs from "dayjs";
import { LoadingOutlined } from "@ant-design/icons";

const { Option } = Select;

const antIcon = <LoadingOutlined style={{ fontSize: 30 }} spin />;

interface ITransactionItems {
  account: string | number;
  debit: number;
  credit: number;
  description: string;
  key?: number;
  error?: boolean;
}

export const TransactionWidget: FC = () => {
  const [transactionItems, setTransactionItems] = useState<
    ITransactionItems[] | any
  >([
    {
      account: null,
      debit: 0,
      credit: 0,
      description: "",
      key: 1,
      error: false,
    },
  ]);

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({ date: dayjs() });
  }, [form]);

  const { notificationCallback } = useGlobalContext();

  /*Query hook for  Fetching all accounts against ID */
  const { isLoading: recentAccountsLoading, data: recentAccountsData } =
    useQuery([`recent-accounts`, "ALL"], getRecentAccounts);
  const { isLoading: accountsLoading, data: accountsData } = useQuery(
    [`all-accounts`, "ALL"],
    getAllAccounts
  );

  const accounts: IAccountsResult[] =
    (accountsData && accountsData.data && accountsData.data.result) || [];
  const recentAccounts: IAccountsResult[] =
    (recentAccountsData &&
      recentAccountsData.data &&
      recentAccountsData.data.result) ||
    [];

  const [mutateCreateTransaction, respCreateTransaction] =
    useMutation(createTransactionAPI);

  const moveCard = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const dragCard = transactionItems[dragIndex];
      setTransactionItems(
        update(transactionItems, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragCard],
          ],
        })
      );
    },
    [transactionItems]
  );

  const totalDebits = (transactionItems.length &&
    transactionItems.reduce((a, b) => {
      return { debit: a.debit + b.debit };
    })) || { debit: 0 };
  const totalCredits = (transactionItems.length &&
    transactionItems.reduce((a, b) => {
      return { credit: a.credit + b.credit };
    })) || { credit: 0 };

  const onFinish = async (values) => {
    let errorsLength = 0;

    setTransactionItems((prev) => {
      return prev?.map((item) => {
        if (!item?.account) {
          errorsLength = errorsLength + 1;
          return { ...item, error: true };
        } else {
          return { ...item, error: false };
        }
      });
    });

    let credits = [];
    let debits = [];

    transactionItems.forEach((tranc, index) => {
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
      ...values,
      entries: {
        credits,
        debits,
      },
      amount,
    };

    try {
      if (totalDebits.amount === totalCredits.amount && errorsLength === 0) {
        await mutateCreateTransaction(payload, {
          onSuccess: () => {
            setTransactionItems([
              {
                account: "",
                debit: 0,
                credit: 0,
                description: "",
              },
            ]);
            form.resetFields();
            queryCache.invalidateQueries(
              `transactions?page=${1}&query=${""}&sort=${"id"}`
            );

            notificationCallback(
              NOTIFICATIONTYPE.SUCCESS,
              "Transaction Created"
            );
          },
        });
      } else throw { status: 501, message: "Transaction Not Matched" };
    } catch (error) {
      if (error.status && error.status === 501) {
        notificationCallback(NOTIFICATIONTYPE.ERROR, error.message);
      }

      console.log(error, "error");
    }
  };
  const onFinishFailed = (error) => {
    console.log(error, "check error");
  };

  const onTableInputChange = (value, index, accessor) => {
    let allItems = [...transactionItems];
    allItems[index] = { ...allItems[index], [accessor]: value, error: false };
    setTransactionItems(allItems);
  };

  const renderTransactionItems = (list: ITransactionItems, index: number) => {
    return (
      <ListItem
        key={list.key}
        index={index}
        id={list.key}
        moveCard={moveCard}
        className={list?.error ? `has-error` : ``}
        children={
          <>
            <td>{index + 1}</td>
            <td style={{ maxWidth: "170px", minWidth: "140px" }}>
              <Select
                loading={accountsLoading}
                size={"middle"}
                value={list.account}
                showSearch
                style={{ width: "100%" }}
                placeholder="Select Account"
                optionFilterProp="children"
                onChange={(val) => {
                  onTableInputChange(val, index, "account");
                }}
              >
                {accounts.map((item: IAccountsResult, index: number) => {
                  return <Option value={item.id}>{item.name}</Option>;
                })}
              </Select>
            </td>
            <td>
              <Editable
                value={list.description}
                onChange={(e) => {
                  let val = e.target.value;
                  onTableInputChange(val, index, "description");
                }}
                placeholder="Description"
                size={"middle"}
                type="text"
              />
            </td>
            <td>
              <Editable
                disabled={list.credit > 0}
                value={list.debit}
                onChange={(value) => {
                  onTableInputChange(value, index, "debit");
                }}
                placeholder="debit"
                size={"middle"}
                type="number"
              />
            </td>
            <td>
              <Editable
                disabled={list.debit > 0}
                value={list.credit}
                onChange={(value) => {
                  onTableInputChange(value, index, "credit");
                }}
                placeholder="credit"
                size={"middle"}
                type="number"
              />
            </td>
            <td className="action-icon">
              <i
                onClick={() => {
                  let cloneItems = [...transactionItems];
                  cloneItems.splice(index, 1);
                  setTransactionItems(cloneItems);
                }}
                className="flex alginCenter justifyCenter"
              >
                <Icon icon={deleteIcon} />
              </i>
            </td>
          </>
        }
      />
    );
  };

  const handleQuickBar = (acc) => {
    const allitems = [...transactionItems];
    let lastIndex = allitems.length === 0 ? 0 : allitems.length - 1;
    if (allitems.length === 0) {
      handleAddRow(acc.id);
    } else if (allitems[lastIndex].account) {
      handleAddRow(acc.id);
    } else {
      allitems[lastIndex].account = acc.id;
      setTransactionItems(allitems);
    }
  };

  const handleAddRow = (acc?: number) => {
    let allItems = [...transactionItems];
    allItems.push({
      account: acc ? acc : null,
      debit: 0,
      credit: 0,
      description: "",
      key: allItems.length + 1,
    });
    setTransactionItems(allItems);
  };

  return (
    <WrapperTransactionEditor>
      <TableCard>
        <Row gutter={24}>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 24 }}
            lg={{ span: 24 }}
            xl={{ span: 24 }}
            xxl={{ span: 24 }}
          >
            <div className="card-inner">
              <Row gutter={24}>
                <Col
                  xs={{ span: 18 }}
                  sm={{ span: 18 }}
                  md={{ span: 18 }}
                  lg={{ span: 18 }}
                  xl={{ span: 17, offset: 1 }}
                  xxl={{ span: 17, offset: 1 }}
                >
                  <Heading type="table">Journal Entry</Heading>

                  <div className="form-wrapper mt-20">
                    <Form
                      form={form}
                      onFinish={onFinish}
                      onFinishFailed={onFinishFailed}
                    >
                      <Row gutter={24}>
                        <Col span={6}>
                          <FormLabel>Reference #</FormLabel>
                          <Form.Item
                            name="ref"
                            rules={[{ required: true, message: "Required !" }]}
                          >
                            <Input size="middle" />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <FormLabel>Date</FormLabel>
                          <Form.Item
                            name="date"
                            rules={[{ required: true, message: "Required !" }]}
                          >
                            <DatePicker
                              style={{ width: "100%" }}
                              size="middle"
                              disabledDate={(current) => {
                                return current > dayjs().endOf("day");
                              }}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item>
                            <div className="action_buttons">
                              <Button
                                type="default"
                                className="mr-10 cancel"
                                onClick={() => {
                                  form.resetFields();
                                }}
                              >
                                Save
                              </Button>
                              <Button
                                loading={respCreateTransaction.isLoading}
                                type="primary"
                                htmlType="submit"
                              >
                                Approve
                              </Button>
                            </div>
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={24}>
                        <Col span={24}>
                          <div className="transaction_card">
                            <table>
                              <thead>
                                <tr>
                                  {[
                                    "",
                                    "#",
                                    "Particular",
                                    "Description",
                                    "Debit",
                                    "Credit",
                                    "",
                                  ].map((head, index) => {
                                    if (index === 0 || index === 1) {
                                      return (
                                        <th
                                          style={{ width: "10px" }}
                                          key={index}
                                        >
                                          {head}
                                        </th>
                                      );
                                    } else {
                                      return <th key={index}>{head}</th>;
                                    }
                                  })}
                                </tr>
                              </thead>
                              <tbody>
                                <DndProvider backend={HTML5Backend}>
                                  {transactionItems.map((list, index) =>
                                    renderTransactionItems(list, index)
                                  )}
                                  <Button
                                    className="flex alignCenter fs-12"
                                    onClick={() => handleAddRow()}
                                    type="link"
                                    size="small"
                                  >
                                    <Icon icon={addLine} />
                                    Add a row
                                  </Button>
                                </DndProvider>
                              </tbody>
                            </table>
                          </div>
                          <hr />
                          <div className="total">
                            <p className="para">Total</p>
                            <p className="debit">
                              {moneyFormat(totalDebits.debit)}
                            </p>
                            <p className="credit">
                              {moneyFormat(totalCredits.credit)}
                            </p>
                          </div>
                          <hr />
                        </Col>
                        <Col span={8}>
                          <div className="mt-20">
                            <FormLabel>Narration</FormLabel>
                            <Form.Item
                              name="narration"
                              rules={[
                                {
                                  required: true,
                                  message: "Field is required !",
                                },
                              ]}
                            >
                              <TextArea
                                placeholder={
                                  "narration will be added in the transaction"
                                }
                                rows={2}
                              />
                            </Form.Item>
                          </div>
                        </Col>
                        <Col span={8} offset={8} pull={8}>
                          <div className="mt-20">
                            <FormLabel>Notes</FormLabel>
                            <Form.Item
                              name="notes"
                              rules={[
                                {
                                  required: true,
                                  message: "Field is required !",
                                },
                              ]}
                            >
                              <TextArea
                                rows={2}
                                placeholder="Need to remember anything about this transaction? add it here."
                              />
                            </Form.Item>
                          </div>
                        </Col>
                        <Col span={24}>
                          <Form.Item>
                            <div className="action_buttons">
                              <Button
                                type="default"
                                className="mr-10 cancel"
                                onClick={() => {
                                  form.resetFields();
                                }}
                              >
                                Save
                              </Button>
                              <Button
                                loading={respCreateTransaction.isLoading}
                                type="primary"
                                htmlType="submit"
                              >
                                Approve
                              </Button>
                            </div>
                          </Form.Item>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </Col>
                <Col
                  xs={{ span: 6 }}
                  sm={{ span: 6 }}
                  md={{ span: 6 }}
                  lg={{ span: 6 }}
                  xl={{ span: 5, offset: 1, pull: 1 }}
                  xxl={{ span: 5, offset: 1, pull: 1 }}
                >
                  <div className="wrapper-account-detail">
                    <h3>Most used accounts</h3>
                    <div
                      className={`quick-detail-wrapper ${
                        recentAccountsLoading
                          ? "flex alignCenter justifyCenter"
                          : ""
                      }`}
                    >
                      {recentAccountsLoading ? (
                        <div className="flex alignItems justifyCenter">
                          <Spin indicator={antIcon} />
                        </div>
                      ) : (
                        <div className="flex alignCenter justifySpaceBetween">
                          <ul>
                            {accounts.length > 0 &&
                              accounts.map((acc, index) => {
                                if (index <= 5) {
                                  let isIncluded = transactionItems.findIndex(
                                    (a) => a.account === acc.id
                                  );
                                  let classname =
                                    isIncluded !== -1 ? "itemAdded" : "";
                                  return (
                                    <li
                                      className={`${classname}`}
                                      onClick={() => {
                                        if (classname !== "itemAdded") {
                                          handleQuickBar(acc);
                                        }else{
                                          return null
                                        }
                                      }}
                                    >
                                      {acc.name}
                                    </li>
                                  );
                                }else{
                                  return null
                                }
                              })}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="wrapper-account-detail mt-20">
                    <h3>Recently added accounts.</h3>
                    <div
                      className={`quick-detail-wrapper ${
                        recentAccountsLoading
                          ? "flex alignCenter justifyCenter"
                          : ""
                      }`}
                    >
                      {recentAccountsLoading ? (
                        <div className="flex alignItems justifyCenter">
                          <Spin indicator={antIcon} />
                        </div>
                      ) : (
                        <div className="flex alignCenter justifySpaceBetween">
                          <ul>
                            {recentAccounts.length > 0 &&
                              recentAccounts?.map((acc, index) => {
                                if (index <= 5) {
                                  let isIncluded = transactionItems.findIndex(
                                    (a) => a.account === acc.id
                                  );

                                  let classname =
                                    isIncluded !== -1 ? "itemAdded" : "";
                                  return (
                                    <li
                                      className={`${classname}`}
                                      onClick={() => {
                                        if (classname !== "itemAdded") {
                                          handleQuickBar(acc);
                                        }else{
                                          return null
                                        }
                                      }}
                                    >
                                      {acc.name}
                                    </li>
                                  );
                                }else{
                                  return null
                                }
                              })}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </TableCard>
    </WrapperTransactionEditor>
  );
};
