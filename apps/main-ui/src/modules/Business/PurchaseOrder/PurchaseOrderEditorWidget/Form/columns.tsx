/* eslint-disable array-callback-return */
import React from "react";
import { ColumnsType } from "antd/lib/table";
import { Select } from "antd";
import { Editable } from "../../../../../components/Editable";
import { useQuery } from "react-query";
import { getAllItems } from "../../../../../api";
import deleteIcon from "@iconify/icons-carbon/delete";
import convertToRem from "../../../../../utils/convertToRem";
import { Color } from "../../../../../modal";
import { SortableHandle } from "react-sortable-hoc";
import { Icon } from "@iconify/react";
import dotsGrid from "@iconify-icons/mdi/dots-grid";

const { Option } = Select;

let setStateTimeOut: any;

const DragHandle = SortableHandle(() => (
  <Icon
    style={{ cursor: "move", color: "#999", fontSize: 17 }}
    icon={dotsGrid}
    color={"#B1B1B1"}
  />
));

export default function (state?: any[], setState?: (payload?: any) => void) {
  const handleDelete = (index) => {
    let allItems = [...state];
    allItems.splice(index, 1);
    setState(allItems);
  };
  /*Query hook for  Fetching all items against ID */
  const responseItems = useQuery([`all-items`, "ALL"], getAllItems);
  const allItemsResult =
    (responseItems.data &&
      responseItems.data.data &&
      responseItems.data.data.result) ||
    [];

  const getItemWithItemId = (id) => {
    if (allItemsResult && allItemsResult.length) {
      let [filtered] = allItemsResult.filter((item) => item.id === id);

      return filtered;
    }
  };

  const _columns: ColumnsType<any> = [
    {
      title: "",
      dataIndex: "sort",
      width: 30,
      className: "drag-visible",
      render: () => <DragHandle />,
    },
    {
      title: "#",
      dataIndex: "key",
      key: "key",
      align: "center",
      width: 50,
      className: "drag-visible",
      render: (value, record, index) => {
        return <>{index + 1}</>;
      },
    },
    {
      width: 200,
      title: "Item",
      dataIndex: "itemId",
      className: "drag-visible",
      key: "itemId",
      render: (value, record, index) => {
        return (
          <Select
            value={{
              value: value !== null ? value : "",
              label: `${
                value !== null && allItemsResult.length
                  ? allItemsResult &&
                    getItemWithItemId(value) &&
                    `${getItemWithItemId(value).code} / ${
                      getItemWithItemId(value).name
                    }`
                  : "Select Item"
              }`,
            }}
            size="middle"
            style={{ width: "100%", minWidth: "180px" }}
            showSearch
            placeholder="Select Items"
            optionFilterProp="children"
            labelInValue={true}
            onChange={(val) => {
              let allItems = [...state];
              allItems[index] = { ...allItems[index], itemId: val.value };
              setState(allItems);
            }}
          >
            {allItemsResult?.map((item:any, index:Number) => {
              let usedIds = [];
              state.forEach((st) => {
                if (st.itemId !== null) {
                  usedIds.push(st.itemId);
                }else{
                  return null
                }
              });
              if (!usedIds.includes(item.id)) {
                return (
                  <Option value={item.id}>
                    {item.code} / {item.name}
                  </Option>
                );
              }else{
                return null
              }
            })}
          </Select>
        );
      },
    },
    {
      title: "Qty",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
      render: (data, record, index) => {
        return (
          <Editable
            disabled={!record.itemId}
            onChange={(value) => {
              let inputvalue = value;
              clearTimeout(setStateTimeOut);

              setStateTimeOut = setTimeout(() => {
                let allItems = [...state];
                allItems[index] = {
                  ...allItems[index],
                  quantity: inputvalue,
                };
                setState(allItems);
              }, 300);
            }}
            type="number"
            placeholder="QTY"
            value={data}
            size={"middle"}
          />
        );
      },
    },
    {
      title: "description",
      dataIndex: "description",
      key: "description",
      render: (data, record, index) => {
        return (
          <Editable
            disabled={!record.itemId}
            onChange={(e) => {
              let value = e.target.value;
              clearTimeout(setStateTimeOut);
              setStateTimeOut = setTimeout(() => {
                let allItems = [...state];
                allItems[index] = {
                  ...allItems[index],
                  description: value,
                };
                setState(allItems);
              }, 300);
            }}
            placeholder="Description"
            value={data}
            size={"middle"}
          />
        );
      },
    },
    {
      title: "",
      dataIndex: "",
      key: "",
      width: 50,
      render: (data, record, index) => {
        return (
          <i onClick={() => handleDelete(index)}>
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

  return _columns;
}
