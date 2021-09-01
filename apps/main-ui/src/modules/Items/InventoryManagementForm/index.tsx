import Icon from "@iconify/react";
import { Button, Col, Row, Select } from "antd";
import { ColumnsType } from "antd/lib/table";
import React, { FC, useEffect, useState } from "react";
import { queryCache, useMutation, useQuery } from "react-query";
import { getAllItems, StockUpdateAPI } from "../../../api";
import CommonSelect from "../../../components/CommonSelect";
import { Editable } from "../../../components/Editable";
import { Heading } from "../../../components/Heading";
import { CommonTable } from "../../../components/Table";
import { TableCard } from "../../../components/TableCard";
import { IItemsResult } from "../../../modal/items";
import { WrapperInventoryManagement } from "./styles";
import bxPlus from "@iconify-icons/bx/bx-plus";
import convertToRem from "../../../utils/convertToRem";
import { Color, NOTIFICATIONTYPE } from "../../../modal";
import deleteIcon from "@iconify/icons-carbon/delete";
import { P } from "../../../components/Typography";
import { useGlobalContext } from "../../../hooks/globalContext/globalContext";

const { Option } = Select;

const defaultState = {
  itemId: null,
  quantity: 1,
  active: false,
  code: null,
  description: null,
  stock: null,
  error: false,
  purchasePrice: null,
};

let setStateTimeOut: any;

export const ManageInventoryForm: FC = ({}) => {
  const [inventoryList, setInventoryList] = useState([]);
  const [
    mutateStockUpdate,
    { data: StockUpdateRes, isLoading: stockUpdating },
  ] = useMutation(StockUpdateAPI);
  const { notificationCallback } = useGlobalContext();

  useEffect(() => {
    if (defaultState) {
      let state = [];
      for (let index = 0; index < 3; index++) {
        state.push(defaultState);
      }
      setInventoryList(state);
    }
  }, []);

  const resetForm = () => {
    if (defaultState) {
      let state = [];
      for (let index = 0; index < 3; index++) {
        state.push(defaultState);
      }
      setInventoryList(state);
    }
  };

  /*Query hook for  Fetching all items against ID */
  const { data: itemsData, isLoading: itemsLoading } = useQuery(
    [`all-items`, "ALL"],
    getAllItems,
    {
      cacheTime: Infinity,
      staleTime: Infinity,
    }
  );

  let itemsList: IItemsResult[] = itemsData?.data?.result || [];

  const getItemWithItemId = (id:number|string) => {
    if (itemsList && itemsList.length) {
      let [filtered] = itemsList.filter((item) => item.id === id);

      return filtered;
    }else{
      return null
    }
  };

  const columns: ColumnsType<any> = [
    {
      title: "Item",
      dataIndex: "itemId",
      key: "itemId",
      render: (data, row, index) => {
        return (
          <CommonSelect
            labelInValue
            showSearch
            value={{
              value: data !== null ? data : "",
              label:
                data !== null
                  ? itemsList
                    ? `${getItemWithItemId(data)?.code} / ${
                        getItemWithItemId(data).name
                      }`
                    : ""
                  : "Select Item",
            }}
            size="middle"
            onClick={() => {
              let _list = [...inventoryList];
              _list[index] = { ...inventoryList[index], active: true };
              setInventoryList(_list);
            }}
            style={{ width: "100%", minWidth: "180px" }}
            placeholder="Select Item"
            optionFilterProp="children"
            onChange={(val) => {
              let [filtered] = itemsList?.filter(
                (item) => item?.id === val?.value
              );

              setInventoryList((prev) => {
                return [
                  ...prev,
                  prev?.splice(index, 1, {
                    ...prev[index],
                    itemId: val?.value,
                    description: filtered?.description,
                    stock: filtered?.stock,
                    code: filtered?.code,
                    error: false,
                    purchasePrice: filtered?.price?.purchasePrice,
                  }),
                ];
              });
            }}
          >
            <>
              {inventoryList[index]?.active &&
                itemsList?.map((item, index) => {
                  return (
                    <Option value={item?.id}>
                      {item?.code} / {item?.name}
                    </Option>
                  );
                })}
            </>
          </CommonSelect>
        );
      },
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: 150,
      render: (data, record, index) => {
        return (
          <Editable
            size="middle"
            disabled={!record.itemId}
            onChange={(value) => {
              clearTimeout(setStateTimeOut);
              setStateTimeOut = setTimeout(() => {
                if (value) {
                  let allItems = [...inventoryList];
                  allItems[index] = { ...allItems[index], quantity: value };
                  setInventoryList(allItems);
                }
              }, 500);
            }}
            type="number"
            value={data}
          />
        );
      },
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Current Stock",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "",
      dataIndex: "",
      key: "action",
      width: 50,
      render: (data, row, index) => {
        return (
          <i
            onClick={() => {
              let _list = [...inventoryList];
              _list?.splice(index, 1);
              setInventoryList(_list);
            }}
          >
            {" "}
            <Icon
              style={{
                fontSize: convertToRem(20),
                color: Color.$GRAY,
                cursor: "pointer",
              }}
              icon={deleteIcon}
            />
          </i>
        );
      },
    },
  ];

  const handleSaveInventory = async () => {
    let errorIndexes = [];
    setInventoryList((prev) => {
      return prev?.map((item, index) => {
        if (!item?.itemId || !item?.quantity) {
          errorIndexes?.push(index);
          return { ...item, error: true };
        } else {
          return { ...item, error: false };
        }
      });
    });

    if (!errorIndexes?.length) {
      await mutateStockUpdate(
        {
          items: inventoryList?.map((item) => {
            return {
              id: item?.itemId,
              stock: `${item?.quantity}`,
              purchasePrice: `${item?.purchasePrice}`,
            };
          }),
        },
        {
          onSuccess: () => {
            notificationCallback(
              NOTIFICATIONTYPE?.SUCCESS,
              "Updated Stocks Successfully"
            );
            [`all-items`, "items?page", `transactions?page`]?.forEach((key) => {
              queryCache?.invalidateQueries((q) =>
                q?.queryKey[0]?.toString()?.startsWith(key)
              );
            });
            resetForm();
          },
        }
      );
    }
  };

  return (
    <WrapperInventoryManagement>
      <Row gutter={24}>
        <Col span={18} offset={3}>
          <TableCard className="card_styles">
            <div className="form_wrappper">
              <div className="mb-10">
                <Heading type="table">Inventory Mangement</Heading>
              </div>
              <CommonTable
                rowClassName={(record, index) =>
                  `${record?.error ? "has-error" : ``}`
                }
                columns={columns}
                dataSource={inventoryList}
                pagination={false}
                size="small"
                scroll={{ y: 350 }}
              />

              <div className="add_item mt-20">
                <Button
                  className="flex alignCenter"
                  onClick={() => {
                    if (inventoryList?.length <= 15) {
                      let all = [...inventoryList];
                      all?.push({ ...defaultState });
                      setInventoryList(all);
                    } else {
                      notificationCallback(
                        NOTIFICATIONTYPE?.WARNING,
                        "Your can only add 15 items only !"
                      );
                    }
                  }}
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
            <div className="actions textRight">
              <Button
                onClick={resetForm}
                className="mr-10"
                size={"middle"}
                type="default"
              >
                Cancel
              </Button>
              <Button
                disabled={stockUpdating}
                loading={stockUpdating}
                size={"middle"}
                onClick={handleSaveInventory}
                type="primary"
                //   onClick={() => {
                //     setSubmitType(ISUBMITTYPE.ONLYAPPROVE);
                //     AntForm.setFieldsValue({
                //       status: {
                //         status: 1,
                //         print: false,
                //       },
                //     });
                //   }}
              >
                Approve
              </Button>
            </div>
          </TableCard>
        </Col>
      </Row>
    </WrapperInventoryManagement>
  );
};
