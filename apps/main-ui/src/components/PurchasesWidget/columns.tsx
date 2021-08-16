/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import { Button, Select } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useQuery } from 'react-query';
import Icon from '@iconify/react';
import deleteIcon from '@iconify/icons-carbon/delete';
import { SortableHandle } from 'react-sortable-hoc';
import dotsGrid from '@iconify-icons/mdi/dots-grid';
import addLine from '@iconify/icons-ri/add-line';
import { getAllItems } from '../../api';
import { useGlobalContext } from '../../hooks/globalContext/globalContext';
import { IItemsResult } from '../../modal/items';
import { calculateInvoice } from '../../utils/formulas';
import { Editable } from '../Editable';
import moneyFormat from '../../utils/moneyFormat';
import convertToRem from '../../utils/convertToRem';
import { Color, NOTIFICATIONTYPE } from '../../modal';
import { usePurchaseWidget } from './WidgetManager';

const { Option } = Select;

const DragHandle = SortableHandle(() => (
  <Icon
    style={{ cursor: 'move', color: '#999', fontSize: 17 }}
    icon={dotsGrid}
    color={'#B1B1B1'}
  />
));

let setStateTimeOut: any;

export default function (
  initialState?: any,
  setState?: any,
  typed?: any,
  deleteIds?: number[],
  setDeleteIds?: (ids: number[]) => void
) {
  const [state, setSState] = useState<any>({});
  const [type, setType] = useState('');

  useEffect(() => {
    if (JSON.stringify(initialState) !== JSON.stringify(state)) {
      setSState(initialState);
    }
  }, [initialState, state]);

  useEffect(() => {
    if (type !== typed) {
      setType(typed);
    }
  }, [typed, type]);

  /*Query hook for  Fetching all items against ID */
  const { data: itemsData, isLoading: itemsLoading } = useQuery(
    [`all-items`, 'ALL'],
    getAllItems
  );
  const { notificationCallback, setItemsModalConfig } = useGlobalContext();
  const { setRowsErrors, rowsErrors } = usePurchaseWidget();
  const result: IItemsResult[] =
    (itemsData && itemsData.data && itemsData.data.result) || [];

  const items: IItemsResult[] =
    type === 'SI'
      ? (result.length > 0 &&
          result.filter(
            (item) =>
              item.price &&
              item.price.purchasePrice !== null &&
              item.price.salePrice !== null
          )) ||
        []
      : result;

  const handleDelete = (index) => {
    let alldata = [...state];
    alldata.splice(index, 1);
    setState(alldata);
  };

  const getItemWithItemId = (id: number | string) => {
    if (items && items.length) {
      let [filtered] = items.filter((item) => item.id === id);

      return filtered;
    }else{
      return null
    }
  };

  const columns: ColumnsType<any> = [
    {
      title: '',
      dataIndex: 'sort',
      width: 30,
      className: 'drag-visible textCenter',
      render: () => <DragHandle />,
    },
    {
      title: '#',
      width: 48,

      render: (value, record, index) => {
        return <>{index + 1}</>;
      },
      align: 'center',
    },
    {
      title: 'Item',
      dataIndex: 'itemId',
      key: 'itemId',
      width: 220,
      align: 'left',
      className: 'select-column',

      render: (value, record, index) => {
        return (
          <Select
            className="border-less-select"
            loading={itemsLoading}
            size="middle"
            value={{
              value: value !== null ? value : '',
              label: `${
                value !== null && items.length
                  ? items &&
                    getItemWithItemId(value) &&
                    `${getItemWithItemId(value).code} / ${
                      getItemWithItemId(value).name
                    }`
                  : 'Select Item'
              }`,
            }}
            labelInValue={true}
            showSearch
            style={{ width: '100%', minWidth: '180px' }}
            placeholder="Select Items"
            optionFilterProp="children"
            onChange={(val) => {
              if (val.value !== 'new_item') {
                let [selectedItem] = items.filter(
                  (item) => item.id === val.value
                );
                let allItems = [...state];
                let unitPrice =
                  (selectedItem &&
                    selectedItem.price &&
                    selectedItem.price.salePrice) ||
                  0;
                let purchasePrice =
                  (selectedItem &&
                    selectedItem.price &&
                    selectedItem.price.purchasePrice) ||
                  0;
                let itemDiscount =
                  (selectedItem &&
                    selectedItem.price &&
                    selectedItem.price.discount) ||
                  '0';
                let tax =
                  (selectedItem &&
                    selectedItem.price &&
                    selectedItem.price.tax) ||
                  '0';
                let costOfGoodAmount = purchasePrice * allItems[index].quantity;

                if (type === 'SI' && selectedItem.stock < record.quantity) {
                  let allErrors = [...rowsErrors];
                  allErrors[index] = { hasError: true };
                  setRowsErrors(allErrors);
                  notificationCallback(
                    NOTIFICATIONTYPE.WARNING,
                    `You are out of stock! Only ${selectedItem.stock} items left in your stock`
                  );
                } else {
                  let allErrors = [...rowsErrors];
                  allErrors[index] = { hasError: false };
                  setRowsErrors(allErrors);
                }

                let description = `${selectedItem.category.title}/`;

                let total =
                  type === 'POE'
                    ? calculateInvoice(purchasePrice, tax, itemDiscount)
                    : calculateInvoice(unitPrice, tax, itemDiscount);

                allItems[index] = {
                  ...allItems[index],
                  itemId: val.value,
                  unitPrice,
                  tax,
                  itemDiscount,
                  total,
                  costOfGoodAmount,
                  description,
                };
                if (type === 'POE') {
                  allItems[index] = {
                    ...allItems[index],
                    purchasePrice,
                  };
                }
                setState(allItems);
              }
            }}
          >
            <Option value={'new_item'}>
              <Button
                type="link"
                onClick={() => {
                  setItemsModalConfig(true);
                }}
              >
                {' '}
                <Icon icon={addLine} /> New Item
              </Button>
            </Option>
            {items?.length && items?.map((item: IItemsResult, index: number) => {
              let usedIds = [];
              state.forEach((st) => {
                if (st.itemId !== null) {
                  usedIds.push(st.itemId);
                } else {
                  return null
                }
              });
              if (!usedIds.includes(item.id)) {
                return (
                  <Option key={index} title={item.name} value={item.id}>
                    {item.code} / {item.name}
                  </Option>
                );
              } else {
                return null
              }
            })}
          </Select>
        );
      },
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 230,

      render: (data, record, index) => {
        return (
          <Editable
            disabled={!record.itemId}
            onChange={(e) => {
              let value = e.target.value;
              e.preventDefault();
              clearTimeout(setStateTimeOut);
              setStateTimeOut = setTimeout(() => {
                if (value) {
                  let allItems = [...state];
                  allItems[index] = { ...allItems[index], description: value };
                  setState(allItems);
                }
              }, 500);
            }}
            placeholder="Description"
            size={'middle'}
            value={data}
          />
        );
      },
    },
    {
      title: 'Qty',
      dataIndex: 'quantity',
      key: 'quantity',

      render: (value, record, index) => {
        return (
          <Editable
            disabled={!record.itemId}
            onChange={(value: number) => {
              clearTimeout(setStateTimeOut);
              setStateTimeOut = setTimeout(() => {
                if (value) {
                  let [selectedItem] = items.filter(
                    (item) => item.id === record.itemId
                  );
                  let quantity = value;
                  if (quantity === null || quantity === undefined) {
                    quantity = 0;
                  }
                  let allItems = [...state];
                  let unitPrice = record.unitPrice;
                  let purchasePrice = record.purchasePrice;
                  let itemDiscount = record.itemDiscount;

                  let costOfGoodAmount = record.purchasePrice * quantity;
                  let tax = record.tax;

                  if (type === 'SI' && selectedItem.stock < value) {
                    let allErrors = [...rowsErrors];
                    allErrors[index] = { hasError: true };
                    setRowsErrors(allErrors);
                    notificationCallback(
                      NOTIFICATIONTYPE.WARNING,
                      `You are out of stock! Only ${selectedItem.stock} items left in your stock`
                    );
                  } else {
                    let allErrors = [...rowsErrors];
                    allErrors[index] = { hasError: false };
                    setRowsErrors(allErrors);
                  }

                  let total =
                    type === 'POE'
                      ? calculateInvoice(purchasePrice, tax, itemDiscount) *
                        quantity
                      : calculateInvoice(unitPrice, tax, itemDiscount) *
                        quantity;
                  allItems[index] = {
                    ...allItems[index],
                    quantity,
                    total,
                    costOfGoodAmount,
                  };
                  setState(allItems);
                }
              }, 500);
            }}
            placeholder="qty"
            type="number"
            value={value}
            size={'middle'}
          />
        );
      },
    },
    {
      title: 'Unit Price',
      dataIndex: 'unitPrice',
      key: 'unitPrice',

      render: (value, record, index) => {
        return (
          <Editable
            disabled={!record.itemId}
            onChange={(value) => {
              clearTimeout(setStateTimeOut);
              setStateTimeOut = setTimeout(() => {
                let allItems = [...state];
                let unitPrice = value;
                let purchasePrice = record.purchasePrice;
                let itemDiscount = record.itemDiscount;
                let tax = record.tax;
                let total =
                  type === 'POE'
                    ? calculateInvoice(purchasePrice, tax, itemDiscount) *
                      parseInt(record.quantity)
                    : calculateInvoice(unitPrice, tax, itemDiscount) *
                      parseInt(record.quantity);

                allItems[index] = {
                  ...allItems[index],
                  unitPrice,
                  total,
                };
                setState(allItems);
              }, 500);
            }}
            type="number"
            value={value}
            size={'middle'}
          />
        );
      },
    },
    {
      title: 'Disc %',
      dataIndex: 'itemDiscount',
      key: 'itemDiscount',

      render: (value, record, index) => {
        return (
          <Editable
            disabled={!record.itemId}
            type="text"
            value={value}
            onChange={(e) => {
              const { value } = e.target;
              clearTimeout(setStateTimeOut);
              setStateTimeOut = setTimeout(() => {
                let allItems = [...state];
                let itemDiscount = value.replace(/\b0+/g, '');

                if (itemDiscount === '') {
                  itemDiscount = '0';
                }
                let unitPrice = record.unitPrice;
                let purchasePrice = record.purchasePrice;
                let tax = record.tax;
                let total =
                  type === 'POE'
                    ? calculateInvoice(purchasePrice, tax, itemDiscount) *
                      parseInt(record.quantity)
                    : calculateInvoice(unitPrice, tax, itemDiscount) *
                      parseInt(record.quantity);

                allItems[index] = {
                  ...allItems[index],
                  itemDiscount,
                  total,
                };
                setState(allItems);
              }, 400);
            }}
            size={'middle'}
          />
        );
      },
    },
    {
      title: 'Tax',
      dataIndex: 'tax',
      key: 'tax',

      render: (value, record, index) => <> {value}</>,
    },
    {
      title: 'Amount',
      dataIndex: 'total',
      key: 'total',
      render: (value, record, index) => (
        <>{typeof value === 'number' ? moneyFormat(value) : value}</>
      ),
    },
    {
      title: '',
      key: 'action',
      width: 50,
      render: (value, record, index) => {
        return (
          <i
            onClick={() => {
              if (record.id) {
                let allDeleteIds = [...deleteIds];
                allDeleteIds.push(record.id);
                setDeleteIds(allDeleteIds);
              }
              let allErrors = [...rowsErrors];
              allErrors.splice(index, 1);
              setRowsErrors(allErrors);
              handleDelete(index);
            }}
          >
            {' '}
            <Icon
              style={{
                fontSize: convertToRem(20),
                color: Color.$GRAY,
                cursor: 'pointer',
              }}
              icon={deleteIcon}
            />
          </i>
        );
      },
    },
  ];

  if (type === 'POE') {
    columns.splice(5, 0, {
      title: 'Purchase Price',
      dataIndex: 'purchasePrice',
      key: 'purchasePrice',

      render: (value, record, index) => {
        return (
          <Editable
            disabled={!record.itemId}
            onChange={(value) => {
              clearTimeout(setStateTimeOut);

              setTimeout(() => {
                let allItems = [...state];
                let purchasePrice = value;
                let costOfGoodAmount = purchasePrice * allItems[index].quantity;
                let total =
                  calculateInvoice(
                    purchasePrice,
                    record.tax,
                    record.itemDiscount
                  ) * record.quantity;

                allItems[index] = {
                  ...allItems[index],
                  purchasePrice,
                  total,
                  costOfGoodAmount,
                };
                setState(allItems);
              }, 500);
            }}
            type="number"
            value={value}
            size={'middle'}
          />
        );
      },
    });
  }

  return { columns };
}
