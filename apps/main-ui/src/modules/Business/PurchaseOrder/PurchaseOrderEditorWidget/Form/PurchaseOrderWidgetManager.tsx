import React, {
  createContext,
  FC,
  ReactElement,
  useContext,
  useState,
} from 'react';
import { ColumnsType } from 'antd/lib/table';
import { Select } from 'antd';
import { Editable, EditableSelect } from '../../../../../components/Editable';
import { useQuery } from 'react-query';
import { getAllItems } from '../../../../../api';
import deleteIcon from '@iconify/icons-carbon/delete';
import convertToRem from '../../../../../utils/convertToRem';
import { Color } from '../../../../../modal';
import { SortableHandle } from 'react-sortable-hoc';
import { Icon } from '@iconify/react';
import dotsGrid from '@iconify-icons/mdi/dots-grid';
import { useShortcut } from '../../../../../hooks/useShortcut';

const { Option } = Select;

let setStateTimeOut: any;

const DragHandle = SortableHandle(() => (
  <Icon
    style={{ cursor: 'move', color: '#999', fontSize: 17 }}
    icon={dotsGrid}
    color={'#B1B1B1'}
  />
));

export const PurchaseOrderContext: any = createContext({});

export const usePurchaseOrderContext: any = () =>
  useContext(PurchaseOrderContext);

interface IProps {
  children: ReactElement<any>;
}
export const PurchaseOrderWidgetManager: FC<IProps> = ({ children }) => {
  const [state, setState] = useState([
    {
      itemId: null,
      quantity: 1,
      description: '',
      index: 0,
    },
  ]);

  const handleDelete = (index) => {
    setState((prev) => {
      const allItems = [...prev];
      allItems.splice(index, 1);
      return allItems;
    });
  };
  /*Query hook for  Fetching all items against ID */
  const {
    data: itemsData,
    isLoading: itemsLoading,
    isError,
    isFetched,
  } = useQuery([`all-items`, 'ALL'], getAllItems);
  const allItemsResult = itemsData?.data?.result || [];

  const handleAddRow = () => {
    setState((prev) => {
      const allItems = [...prev];
      allItems.push({
        itemId: null,
        quantity: 1,
        description: '',
        index: allItems.length - 1,
      });
      return allItems;
    });
  };
  const removeRowFromLastIndex = () => {
    setState((prev) => {
      const allItems = [...prev];
      const lastIndex = allItems.length - 1;
      allItems.splice(lastIndex, 1);
      return allItems;
    });
  };

  const ClearAll = () => {
    setState([
      {
        itemId: null,
        quantity: 1,
        description: '',
        index: 0,
      },
    ]);
  };

  useShortcut('i', handleAddRow);
  useShortcut('b', removeRowFromLastIndex);
  useShortcut('/', ClearAll);

  const getItemWithItemId = (id) => {
    if (allItemsResult && allItemsResult.length) {
      const [filtered] = allItemsResult.filter((item) => item.id === id);

      return filtered;
    }
  };

  const columns: ColumnsType<any> = [
    {
      title: '',
      dataIndex: 'sort',
      width: 30,
      className: 'drag-visible',
      render: () => <DragHandle />,
    },
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
      align: 'center',
      width: 50,
      className: 'drag-visible',
      render: (value, record, index) => {
        return <>{index + 1}</>;
      },
    },
    {
      width: 200,
      title: 'Item',
      dataIndex: 'itemId',
      className: 'drag-visible',
      key: 'itemId',
      render: (value, record, index) => {
        return (
          <EditableSelect
            value={{
              value: value !== null ? value : '',
              label: `${
                value !== null && allItemsResult.length
                  ? allItemsResult &&
                    getItemWithItemId(value) &&
                    `${getItemWithItemId(value).code} / ${
                      getItemWithItemId(value).name
                    }`
                  : 'Select Item'
              }`,
            }}
            size="middle"
            style={{ width: '100%', minWidth: '180px' }}
            showSearch
            placeholder="Select Items"
            optionFilterProp="children"
            labelInValue={true}
            onChange={(val) => {
              console.log(val, 'value');
              setState((prev) => {
                const allItems = [...prev];
                allItems?.splice(index, 1, {
                  ...record,
                  itemId: val?.value,
                });

                return allItems;
              });
              // setState((prev) => {
              //   prev[index] = { ...prev[index], itemId: val?.value };
              //   return prev;
              // });
            }}
          >
            {allItemsResult.map((item, index) => {
              const usedIds = [];
              state.forEach((st) => {
                if (st.itemId !== null) {
                  usedIds.push(st.itemId);
                } else {
                  return null;
                }
              });
              if (!usedIds.includes(item.id)) {
                return (
                  <Option value={item.id}>
                    {item.code} / {item.name}
                  </Option>
                );
              } else {
                return null;
              }
            })}
          </EditableSelect>
        );
      },
    },
    {
      title: 'Qty',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      render: (data, record, index) => {
        return (
          <Editable
            disabled={!record.itemId}
            onChange={(value) => {
              const inputvalue = value;
              clearTimeout(setStateTimeOut);

              setStateTimeOut = setTimeout(() => {
                setState((prev) => {
                  const allItems = [...prev];
                  allItems[index] = {
                    ...allItems[index],
                    quantity: inputvalue,
                  };
                  return allItems;
                });
              }, 300);
            }}
            type="number"
            placeholder="QTY"
            value={data}
            size={'middle'}
          />
        );
      },
    },
    {
      title: 'description',
      dataIndex: 'description',
      key: 'description',
      render: (data, record, index) => {
        return (
          <Editable
            disabled={!record.itemId}
            onChange={(e) => {
              const value = e.target.value;
              clearTimeout(setStateTimeOut);
              setStateTimeOut = setTimeout(() => {
                setState((prev) => {
                  const allItems = [...prev];
                  allItems[index] = {
                    ...allItems[index],
                    description: value,
                  };
                  return allItems;
                });
              }, 300);
            }}
            placeholder="Description"
            value={data}
            size={'middle'}
          />
        );
      },
    },
    {
      title: '',
      dataIndex: '',
      key: '',
      width: 50,
      render: (data, record, index) => {
        return (
          <i onClick={() => handleDelete(index)}>
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

  return (
    <PurchaseOrderContext.Provider
      value={{
        addRow: handleAddRow,
        state,
        setState,
        columns,
        loading: itemsLoading,
        reset: () => {
          setState([
            {
              itemId: null,
              quantity: 1,
              description: '',
              index: 0,
            },
          ]);
        },
      }}
    >
      {children}
    </PurchaseOrderContext.Provider>
  );
};
