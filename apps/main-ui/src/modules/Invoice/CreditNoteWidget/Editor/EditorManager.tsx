import dotsGrid from '@iconify-icons/mdi/dots-grid';
import deleteIcon from '@iconify/icons-carbon/delete';
import addLine from '@iconify/icons-ri/add-line';
import Icon from '@iconify/react';
import { Button, Card, Form } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useEffectLoading } from '../../../../hooks/useEffectLoading';
import dayjs from 'dayjs';
import update from 'immutability-helper';
import {
  createContext,
  FC,
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useQuery } from 'react-query';
import { SortableHandle } from 'react-sortable-hoc';
import scrollIntoView from 'scroll-into-view';

import {
  getAllContacts,
  getAllItems,
  getInvoiceByIDAPI,
  getInvoiceNumber,
} from '../../../../api';
import { getAccountsByTypeAPI } from '../../../../api/accounts';
import CommonSelect, { Option } from '../../../../components/CommonSelect';
import { Editable, EditableSelect } from '../../../../components/Editable';
import { useGlobalContext } from '../../../../hooks/globalContext/globalContext';
import { useShortcut } from '../../../../hooks/useShortcut';
import {
  Color,
  IContactType,
  IContactTypes,
  PaymentMode,
} from '../../../../modal';
import { IAccountsResult } from '../../../../modal/accounts';
import { ORDER_TYPE } from '../../../../modal/invoice';
import { IItemsResult } from '../../../../modal/items';
import { IOrganizationType } from '../../../../modal/organization';
import convertToRem from '../../../../utils/convertToRem';
import {
  calculateInvoice,
  totalDiscountInInvoice,
} from '../../../../utils/formulas';
import moneyFormat from '../../../../utils/moneyFormat';
import { useWindowSize } from '../../../../utils/useWindowSize';
import defaultItems, { defaultFormData, defaultPayment } from './defaultStates';
import { RemovedErrors } from './handlers';
import styled from 'styled-components';
import { invycePersist } from '@invyce/invyce-persist';
import c from './key';
import usePrevious from '../../../../hooks/usePrevious';

export const PurchaseContext: any = createContext({});
export const usePurchaseWidget: any = () => useContext(PurchaseContext);

interface IProps {
  children?: ReactElement<any>;
  type?: 'CN';
  id?: number;
  onSubmit?: (payload: any) => void;
}

interface IPaymentPayload {
  paymentMode: number;
  totalAmount: number;
  totalDiscount: number;
  dueDate: any;
  paymentType?: number;
  bankId?: number;
  amount?: number | any;
}

const DragHandle = SortableHandle(() => (
  <Icon
    style={{ cursor: 'move', color: '#999', fontSize: 17 }}
    icon={dotsGrid}
    color={'#B1B1B1'}
  />
));

let setStateTimeOut: any;

export const PurchaseManager: FC<IProps> = ({ children, type = 'CN', id }) => {
  /* API STAKE */
  const APISTAKE_GETORDERS = getInvoiceByIDAPI;

  const [rowsErrors, setRowsErrors] = useState([]);
  const [width] = useWindowSize();

  /* ************ HOOKS *************** */

  /* Component State Hooks */
  const [invoiceDiscount, setInvoiceDiscount] = useState(0);
  const [invoiceItems, setInvoiceItems] = useState<any>([defaultItems]);
  const [invoiceStatus, setInvoiceStatus] = useState(1);
  const [deleteIds, setDeleteIds] = useState([]);
  const [paymentReset, setPaymentReset] = useState(false);

  const [contactType, setContactType] = useState(null);

  const cachedInvoiceData = invycePersist(
    c.CACHEKEY + type,
    '',
    'localStorage'
  ).get();

  const antFormCacheData =
    invycePersist(c.ANTFORMCACHE + type, '', 'localStorage').get() || {};

  const previousCachedInvoiceData = usePrevious(cachedInvoiceData);
  const previousCachedFormData: any = usePrevious(antFormCacheData);

  const getCachedInvoice = () => {
    setInvoiceItems(previousCachedInvoiceData);
    AntForm.setFieldsValue({
      ...previousCachedFormData,
      dueDate: dayjs(previousCachedFormData.dueDate),
      issueDate: dayjs(previousCachedFormData.issueDate),
    });
    setHasCachedData(false);
  };

  const destroyCachedInvoice = () => {
    resetPersist();
    setHasCachedData(false);
  };

  const resetPersist = () => {
    invycePersist().resetData(c.CACHEKEY + type, 'localStorage');
    invycePersist().resetData(c.ANTFORMCACHE + type, 'localStorage');
  };

  const [hasCachedData, setHasCachedData] = useState(false);

  const memoInvoiceItems = useMemo(() => {
    return invoiceItems;
  }, [invoiceItems]);

  useEffect(() => {
    if (
      cachedInvoiceData &&
      JSON.stringify(cachedInvoiceData) !== JSON.stringify(memoInvoiceItems) &&
      !id
    ) {
      setHasCachedData(true);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (!hasCachedData && !id) {
        setTimeout(() => {
          if (!hasCachedData) {
            invycePersist(
              c.CACHEKEY + type,
              invoiceItems,
              'localStorage'
            ).set();
          }
        }, 400);
      }
    }, 400);
  }, [memoInvoiceItems]);

  /* Antd antd form */
  /* And Form Hook */
  const [AntForm] = Form.useForm();

  /* Component did mount */
  useEffect(() => {
    AntForm.setFieldsValue(defaultFormData);
  }, [AntForm]);

  const { notificationCallback, setItemsModalConfig, userDetails } =
    useGlobalContext();

  const { organization } = userDetails;

  const { data: invoicesData, isLoading: invoiceLoading } = useQuery(
    [`${type}-${id}-view`, id],
    APISTAKE_GETORDERS,
    {
      enabled: !!id,
      cacheTime: Infinity,
    }
  );

  const { data: invoiceNumberData, refetch: refetchInvoiceNumber } = useQuery(
    [null, ORDER_TYPE?.CREDIT_NOTE],
    getInvoiceNumber
  );

  useEffect(() => {
    if (invoiceNumberData?.data?.result) {
      const { result } = invoiceNumberData?.data;
      AntForm.setFieldsValue({ invoiceNumber: result });
    }
  }, [invoiceNumberData]);

  /* Component did update hook to update InvoiceItems when API getInvoiceByIDAPI successfully returns */
  useEffect(() => {
    if (invoicesData && invoicesData.data && invoicesData.data.result) {
      const { result } = invoicesData.data;
      // const { payment } = result;
      const { discount } = result;

      const key = 'invoiceItems';
      const itemsDiscount =
        (result && totalDiscountInInvoice(result[key], 'itemDiscount', type)) ||
        0;

      const invoiceDiscount = discount - itemsDiscount;
      setInvoiceDiscount(invoiceDiscount);
      delete result?.invoiceNumber;

      AntForm.setFieldsValue({
        ...result,
        dueDate: dayjs(result.dueDate),
        issueDate: dayjs(result.issueDate),
        invoiceDiscount,
      });

      const invoice_items = [];
      result[key].forEach((item, index) => {
        const purchasePrice = item.purchasePrice ? item.purchasePrice : 0;
        const unitPrice = item.unitPrice ? item.unitPrice : 0;
        const tax = item.tax ? item.tax : 0;
        const total = item.total ? item.total : 0;
        const itemDiscount = item.itemDiscount ? item.itemDiscount : 0;
        const quantity = item.quantity ? item.quantity : 1;
        delete item.item;
        invoice_items.push({
          ...item,
          purchasePrice,
          unitPrice,
          tax,
          total,
          quantity,
          itemDiscount,
        });
      });

      const sortedItems = invoice_items.sort((a, b) => {
        return a.sequence - b.sequence;
      });

      setInvoiceItems(sortedItems);
    }
  }, [invoicesData, AntForm, type]);

  /*Query hook for  Fetching all accounts against ID */
  const { isLoading, data } = useQuery(
    [`all-contacts`, 'ALL'],
    getAllContacts,
    {
      cacheTime: Infinity,
    }
  );

  const contactResult: IContactType[] = data?.data?.result || [];

  // Accounts Fetched By Types

  const {
    data: accountsData,
    isLoading: accountsLoading,
    isPreviousData,
  } = useQuery(
    [
      `accounts-${type}-contactType=${contactType}`,
      contactType === IContactTypes?.CUSTOMER ? 'invoice' : 'bill' || 'invoice',
    ],
    getAccountsByTypeAPI,
    {
      enabled:
        userDetails?.organization.organizationType === IOrganizationType.SAAS &&
        !!contactType,
    }
  );

  const accountsList: IAccountsResult[] = accountsData?.data?.result || [];

  const getSubTotal = useCallback(() => {
    let subTotal = 0;
    invoiceItems.forEach((item) => {
      subTotal = subTotal + item.unitPrice * item.quantity;
    });
    return subTotal;
  }, [invoiceItems, type]);
  /* Gets total Tax on each item */
  const TotalTax = useMemo(() => {
    return totalDiscountInInvoice(invoiceItems, 'tax', type);
  }, [invoiceItems, type]);
  /* Gets Gross total amount on invoices */
  const GrossTotal = useMemo(() => {
    return getSubTotal() + TotalTax;
  }, [getSubTotal(), TotalTax]);

  /* Gets Total Discount on items */
  const TotalDiscount = useMemo(() => {
    return totalDiscountInInvoice(invoiceItems, 'itemDiscount', type);
  }, [invoiceItems, type]);

  const GrandTotal: any = useMemo(() => {
    return invoiceItems.length
      ? invoiceItems.reduce((a, b) => ({ total: a.total + b.total }))
      : { total: 0 };
  }, [invoiceItems]);

  const IDiscount: number = useMemo(() => {
    return invoiceDiscount ? invoiceDiscount : 0;
  }, [invoiceDiscount]);

  const NetTotal = useMemo(() => {
    return GrandTotal.total - IDiscount;
  }, [GrandTotal, IDiscount]);

  /*Query hook for  Fetching all items against ID */
  const { data: itemsData, isLoading: itemsLoading } = useQuery(
    [`all-items`, 'ALL'],
    getAllItems
  );

  const result: IItemsResult[] =
    (itemsData && itemsData.data && itemsData.data.result) || [];

  const handleDelete = (index) => {
    setInvoiceItems((prev) => {
      const alldata = [...prev];
      alldata.splice(index, 1);
      return alldata;
    });
  };

  const getItemWithItemId = (id: number) => {
    if (items && items.length) {
      const [filtered] = items.filter((item) => item.id === id);

      return filtered;
    } else {
      return null;
    }
  };

  const getAccountNameByID = (id) => {
    const [filtered] = accountsList?.filter((item) => item?.id === id);

    return filtered ? filtered?.name : id;
  };

  const enableAccountColumn =
    organization.organizationType === IOrganizationType.SAAS;

  const items: IItemsResult[] =
    type === 'CN'
      ? (result.length > 0 &&
          result.filter(
            (item) =>
              item.price &&
              item.price.purchasePrice !== null &&
              item.price.salePrice !== null
          )) ||
        []
      : result;

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
        return <div>{index + 1}</div>;
      },
      align: 'center',
    },
    {
      title: 'Item',
      dataIndex: 'itemId',
      key: 'itemId',
      width: width > 1500 ? 220 : 190,
      align: 'left',

      className: `select-column`,

      render: (value, record, index) => {
        return (
          <EditableSelect
            error={record?.errors?.length && record?.errors?.includes('itemId')}
            className={`border-less-select ${
              index === invoiceItems.length - 1 ? 'scrollIntoView' : ''
            }`}
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
                setInvoiceItems((prev) => {
                  const [selectedItem] = items.filter(
                    (item) => item.id === val.value
                  );
                  const allItems = [...prev];
                  const unitPrice =
                    (selectedItem &&
                      selectedItem.price &&
                      selectedItem.price.salePrice) ||
                    0;
                  const purchasePrice =
                    (selectedItem &&
                      selectedItem.price &&
                      selectedItem.price.purchasePrice) ||
                    0;
                  const itemDiscount =
                    (selectedItem &&
                      selectedItem.price &&
                      selectedItem.price.discount) ||
                    '0';
                  const tax =
                    (selectedItem &&
                      selectedItem.price &&
                      selectedItem.price.tax) ||
                    '0';
                  const costOfGoodAmount =
                    purchasePrice * allItems[index].quantity;

                  // if (type === 'CN' && selectedItem.stock < record.quantity) {
                  //   const allErrors = [...rowsErrors];
                  //   allErrors[index] = { hasError: true };
                  //   setRowsErrors(allErrors);
                  //   notificationCallback(
                  //     NOTIFICATIONTYPE.WARNING,
                  //     `You are out of stock! Only ${selectedItem.stock} items left in your stock`
                  //   );
                  // } else {
                  //   const allErrors = [...rowsErrors];
                  //   allErrors[index] = { hasError: false };
                  //   setRowsErrors(allErrors);
                  // }

                  const description = `${selectedItem?.category?.title || ''}/`;

                  const total = calculateInvoice(unitPrice, tax, itemDiscount);

                  allItems[index] = {
                    ...allItems[index],
                    itemId: val.value,
                    unitPrice: unitPrice.toFixed(2),
                    tax,
                    itemDiscount,
                    total,
                    costOfGoodAmount,
                    description,
                    errors: RemovedErrors(allItems[index].errors, [
                      'itemId',
                      'unitPrice',
                      'tax',
                      'description',
                      'itemDiscount',
                    ]),
                  };

                  return allItems;
                });
              }
            }}
          >
            <>
              {/* <Rbac permission={PERMISSIONS.ITEMS_CREATE}> */}
              <Option value={'new_item'}>
                <Button
                  className="flex alignCenter"
                  type="link"
                  onClick={() => {
                    setItemsModalConfig(true);
                  }}
                >
                  {' '}
                  <Icon icon={addLine} />{' '}
                  <span className="ml-10">New Item</span>
                </Button>
              </Option>
              {/* </Rbac> */}
              {items.map((item: IItemsResult, index: number) => {
                const usedIds = [];
                invoiceItems?.forEach((st) => {
                  if (st.itemId !== null) {
                    usedIds.push(st.itemId);
                  } else {
                    return null;
                  }
                });
                if (!usedIds.includes(item.id)) {
                  return (
                    <Option key={index} title={item.name} value={item.id}>
                      {item.code} / {item.name}
                    </Option>
                  );
                } else {
                  return false;
                }
              })}
            </>
          </EditableSelect>
        );
      },
    },

    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: width > 1500 ? 670 : 230,

      render: (data, record, index) => {
        return (
          <Editable
            error={
              record?.errors?.length && record?.errors?.includes('description')
            }
            onChange={(e) => {
              const value = e.target.value;
              e.preventDefault();
              clearTimeout(setStateTimeOut);
              setStateTimeOut = setTimeout(() => {
                if (value) {
                  setInvoiceItems((prev) => {
                    const allItems = [...prev];

                    allItems[index] = {
                      ...allItems[index],
                      description: value,
                      errors: RemovedErrors(
                        allItems[index].errors,
                        'description'
                      ),
                    };
                    return prev;
                  });
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
      width: width > 1500 ? 150 : 120,

      render: (value, record, index) => {
        return (
          <Editable
            error={
              record?.errors?.length && record?.errors?.includes('quantity')
            }
            disabled={!record.itemId}
            onChange={(value: number) => {
              clearTimeout(setStateTimeOut);
              setStateTimeOut = setTimeout(() => {
                if (value) {
                  setInvoiceItems((prev) => {
                    const [selectedItem] = items.filter(
                      (item) => item.id === record.itemId
                    );
                    let quantity = value;
                    if (quantity === null || quantity === undefined) {
                      quantity = 0;
                    }
                    const allItems = [...prev];
                    const unitPrice = record.unitPrice;
                    const itemDiscount = record.itemDiscount;

                    const costOfGoodAmount = record.purchasePrice * quantity;
                    const tax = record.tax;

                    const indexed = allItems[index].errors?.indexOf('quantity');
                    if (indexed !== -1 && allItems[index]?.errors?.length) {
                      allItems[index].errors.splice(indexed, 1);
                    }

                    const total =
                      calculateInvoice(unitPrice, tax, itemDiscount) * quantity;
                    allItems[index] = {
                      ...allItems[index],
                      quantity,
                      total,
                      costOfGoodAmount,
                    };

                    return allItems;
                  });
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
      width: width > 1500 ? 150 : '',

      render: (value, record, index) => {
        return (
          <Editable
            error={
              record?.errors?.length && record?.errors?.includes('unitPrice')
            }
            onChange={(value) => {
              clearTimeout(setStateTimeOut);
              setStateTimeOut = setTimeout(() => {
                setInvoiceItems((prev) => {
                  const allItems = [...prev];
                  const unitPrice = value;
                  const itemDiscount = record.itemDiscount;
                  const tax = record.tax;
                  const total =
                    calculateInvoice(unitPrice, tax, itemDiscount) *
                    parseInt(record.quantity);

                  allItems[index] = {
                    ...allItems[index],
                    unitPrice,
                    total,
                    errors: RemovedErrors(allItems[index].errors, 'unitPrice'),
                  };

                  return allItems;
                });
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
      width: width > 1500 ? 150 : '',

      render: (value, record, index) => {
        return (
          <Editable
            error={
              record?.errors?.length && record?.errors?.includes('itemDiscount')
            }
            disabled={!record.itemId}
            type="text"
            value={value}
            onChange={(e) => {
              const { value } = e.target;
              clearTimeout(setStateTimeOut);
              setStateTimeOut = setTimeout(() => {
                setInvoiceItems((prev) => {
                  const allItems = [...prev];
                  let itemDiscount = value.replace(/\b0+/g, '');

                  if (itemDiscount === '') {
                    itemDiscount = '0';
                  }
                  const unitPrice = record.unitPrice;
                  const tax = record.tax;
                  const total =
                    calculateInvoice(unitPrice, tax, itemDiscount) *
                    parseInt(record.quantity);

                  allItems[index] = {
                    ...allItems[index],
                    itemDiscount,
                    total,
                    errors: RemovedErrors(
                      allItems[index].errors,
                      'itemDiscount'
                    ),
                  };
                  return allItems;
                });
              }, 400);
            }}
            size={'middle'}
          />
        );
      },
    },
    enableAccountColumn
      ? {
          title: 'Account',
          dataIndex: 'accountId',
          width: width > 1500 ? 220 : 150,
          render: (value, row, index) => {
            return (
              <EditableSelect
                error={
                  row?.errors?.length && row?.errors?.includes('accountId')
                }
                className={`border-less-select contacttype-${contactType}`}
                value={{
                  value: value !== null ? value : '',
                  label:
                    (accountsList?.length && getAccountNameByID(value)) ||
                    'Select Account',
                }}
                labelInValue={true}
                loading={accountsLoading}
                size="middle"
                showSearch
                style={{ width: '100%' }}
                placeholder="Select Account"
                optionFilterProp="children"
                onChange={(val) => {
                  setInvoiceItems((prev) => {
                    const allItems = [...prev];

                    allItems[index] = {
                      ...allItems[index],
                      accountId: val.value,
                      errors: RemovedErrors(
                        allItems[index].errors,
                        'accountId'
                      ),
                    };

                    return allItems;
                  });
                }}
              >
                <>
                  {accountsList.map((acc: IAccountsResult, index: number) => {
                    return (
                      <Option key={index} value={acc.id}>
                        {acc.name}
                      </Option>
                    );
                  })}
                </>
              </EditableSelect>
            );
          },
        }
      : {
          width: 0,
        },
    {
      title: 'Tax',
      dataIndex: 'tax',
      key: 'tax',
      // width: width > 1500 ? 150 : 130,
      align: 'center',

      render: (value, record, index) => {
        return <div>{value}</div>;
      },
    },
    {
      title: 'Amount',
      dataIndex: 'total',
      width: 170,
      key: 'total',
      align: 'center',
      render: (value, record, index) => (
        <div>{typeof value === 'number' ? moneyFormat(value) : value}</div>
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
                setDeleteIds((prev) => {
                  const allDeleteIds = [...prev];
                  allDeleteIds.push(record.id);
                  return allDeleteIds;
                });
              }
              setRowsErrors((prev) => {
                const allErrors = [...prev];
                allErrors.splice(index, 1);
                return allErrors;
              });
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
  const handleScroll = () => {
    scrollIntoView(document.querySelector('.scroll-row')!, {
      align: {
        top: 0,
      },
    });
  };

  /* Scroll to last added item */

  //   const handleScroll = () => {
  //     let ele: HTMLElement = document.querySelector(".ant-table-tbody");

  //     ele.lastElementChild.scrollIntoView();
  //   };

  const handleAddRow = () => {
    const items = [...invoiceItems];
    items.push({ ...defaultItems, index: items.length });
    setInvoiceItems(items);
    setTimeout(() => {
      handleScroll();
    }, 600);
  };

  /* This function is responsible to remove invoice item from last index like (LIFO) */
  const removeRowFromLastIndex = () => {
    const allItems = [...invoiceItems];
    const lastIndex = allItems.length - 1;
    allItems.splice(lastIndex, 1);
    setInvoiceItems(allItems);
  };

  /* This function is responsible to clear all invoice items and reset form */

  const ClearAll = () => {
    AntForm.resetFields();
    setInvoiceItems([defaultItems]);
    destroyCachedInvoice();
    setTimeout(() => {
      AntForm.setFieldsValue(defaultFormData);
      refetchInvoiceNumber();
    }, 300);
  };

  useShortcut('i', handleAddRow);
  useShortcut('b', removeRowFromLastIndex);
  useShortcut('/', ClearAll);

  const { loading: contactEffectLoading } = useEffectLoading(contactType);

  return (
    <PurchaseContext.Provider
      value={{
        rowsErrors,
        setRowsErrors,
        columns,
        contactResult,
        getSubTotal,
        TotalTax,
        GrossTotal,
        TotalDiscount,
        GrandTotal,
        IDiscount,
        NetTotal,
        invoiceDiscount,
        setInvoiceDiscount,
        invoiceItems,
        setInvoiceItems,
        invoiceStatus,
        setInvoiceStatus,
        deleteIds,
        setDeleteIds,
        AntForm,
        paymentReset,
        setPaymentReset,
        ClearAll,
        handleAddRow,
        isFetching:
          itemsLoading ||
          invoiceLoading ||
          accountsLoading ||
          contactEffectLoading,
        contactType,
        setContactType,
        accountsList,
      }}
    >
      <Wrapper>
        {hasCachedData && (
          <div className="notifier">
            <span>
              Do you want to continue from where you left before?
              <br />
              <Button
                onClick={getCachedInvoice}
                className="mr-5 mt-5"
                type="primary"
                ghost
              >
                yes
              </Button>
              <Button
                onClick={destroyCachedInvoice}
                type="primary"
                ghost
                danger
                className="mt-5"
              >
                No
              </Button>
            </span>
          </div>
        )}

        <Card>{children}</Card>
      </Wrapper>
    </PurchaseContext.Provider>
  );
};

const Wrapper = styled.div`
  position: relative;
  .notifier {
    position: absolute;
    height: 100%;
    width: 100%;
    z-index: 1111;
    background: #ffffffdb;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
