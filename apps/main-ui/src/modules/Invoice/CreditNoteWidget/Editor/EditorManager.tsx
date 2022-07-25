import dotsGrid from '@iconify-icons/mdi/dots-grid';
import deleteIcon from '@iconify/icons-carbon/delete';
import addLine from '@iconify/icons-ri/add-line';
import Icon from '@iconify/react';
import { Button, Card, Form } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import dayjs from 'dayjs';
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
  creditNoteViewAPI,
  getAllContacts,
  getAllItems,
  getInvoiceByIDAPI,
  getInvoiceNumber,
} from '../../../../api';
import { getAccountsByTypeAPI } from '../../../../api/accounts';
import { Option } from '../../../../components/CommonSelect';
import { Editable, EditableSelect } from '../../../../components/Editable';
import { useGlobalContext } from '../../../../hooks/globalContext/globalContext';
import { useShortcut } from '../../../../hooks/useShortcut';
import { Color, IContactType, IContactTypes } from '../../../../modal';
import { IAccountsResult } from '../../../../modal/accounts';
import { ORDER_TYPE } from '../../../../modal/invoice';
import { IItemsResult } from '@invyce/shared/types';
import { IOrganizationType } from '../../../../modal/organization';
import convertToRem from '../../../../utils/convertToRem';
import {
  calculateInvoice,
  totalDiscountInInvoice,
} from '../../../../utils/formulas';
import moneyFormat from '../../../../utils/moneyFormat';
import { useWindowSize } from '../../../../utils/useWindowSize';
import defaultItems, { defaultFormData } from './defaultStates';
import { RemovedErrors } from './handlers';
import styled from 'styled-components';
import { invycePersist } from '@invyce/invyce-persist';
import c from './key';
import usePrevious from '../../../../hooks/usePrevious';
import { useHistory } from 'react-router-dom';
import { ISupportedRoutes, IInvoiceType } from '../../../../modal';

export const PurchaseContext: any = createContext({});
export const usePurchaseWidget: any = () => useContext(PurchaseContext);

interface IProps {
  children?: ReactElement<any>;
  type?: 'CN';
  id?: number;
  onSubmit?: (payload: any) => void;
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
  const history = useHistory();
  const relation: { type: string } = history.location?.state as {
    type: string;
  };


  const [rowsErrors, setRowsErrors] = useState([]);
  const [width] = useWindowSize();

  /* ************ HOOKS *************** */
  const { setItemsModalConfig, userDetails } = useGlobalContext();

  const { organization } = userDetails;

  /* Component State Hooks */
  const [invoiceDiscount, setInvoiceDiscount] = useState(0);
  const [invoiceItems, setInvoiceItems] = useState<any>([defaultItems]);
  const [invoiceStatus, setInvoiceStatus] = useState(1);
  const [deleteIds, setDeleteIds] = useState([]);
  const [paymentReset, setPaymentReset] = useState(false);

  const priceKey = 'unitPrice';

  const { data: accountsData, isLoading: accountsLoading } = useQuery(
    [`accounts-${type}-contactType=${IContactTypes.CUSTOMER}`, 'invoice'],
    getAccountsByTypeAPI,
    {
      enabled:
        userDetails?.organization.organizationType === IOrganizationType.SAAS,
    }
  );

  const accountsList: IAccountsResult[] = accountsData?.data?.result || [];

  const defaultAccountCode = '15001';

  const [defaultAccount] = accountsList.filter(
    (i) => i.code === defaultAccountCode
  );

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

  const APICATEGORYSTAKE =
    relation?.type === IInvoiceType.PURCHASE_ENTRY ||
    relation?.type === IInvoiceType.PURCHASE_ORDER
      ? getInvoiceByIDAPI
      : creditNoteViewAPI;

  const key =
    relation?.type === IInvoiceType.PURCHASE_ENTRY ||
    relation?.type === IInvoiceType.PURCHASE_ORDER
      ? 'purchaseItems'
      : 'creditNoteItems';

  const { data: invoicesData, isLoading: invoiceLoading } = useQuery(
    [`${type}-${id}-view`, id],
    APICATEGORYSTAKE,
    {
      enabled: !!id,
      cacheTime: Infinity,
    }
  );

  const { data: invoiceNumberData, refetch: refetchInvoiceNumber } = useQuery(
    [null, ORDER_TYPE?.CREDIT_NOTE],
    getInvoiceNumber,
    { enabled: !id || id === null || relation?.type === IInvoiceType?.INVOICE }
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

      setInvoiceDiscount(invoiceDiscount);
      if (id && relation?.type) {
        delete result?.invoiceNumber;
      }
      AntForm.setFieldsValue({
        ...result,
        dueDate: dayjs(result.dueDate),
        issueDate: dayjs(result.issueDate),
      });

      const invoice_items = [];
      result[key]?.forEach((item, index) => {
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

  const contactResult: IContactType[] =
    data?.data?.result?.filter(
      (contact: IContactType) => contact?.contactType === IContactTypes.CUSTOMER
    ) || [];

  // Accounts Fetched By Types

  const getSubTotal = useCallback(() => {
    let subTotal = 0;
    invoiceItems.forEach((item) => {
      subTotal = subTotal + item.unitPrice * item.quantity;
    });
    return subTotal;
  }, [invoiceItems, type]);
  /* Gets total Tax on each item */
  const TotalTax = useMemo(() => {
    return totalDiscountInInvoice(invoiceItems, 'tax', type) || 0;
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
    return GrandTotal.total - invoiceDiscount;
  }, [GrandTotal]);

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

                  const purchasePrice =
                    allItems[index].purchasePrice ||
                    selectedItem?.price?.purchasePrice ||
                    0;
                  const unitPrice =
                    allItems[index].unitPrice ||
                    selectedItem?.price?.salePrice ||
                    0;

                  const tax = selectedItem?.price?.tax || '0';
                  const costOfGoodAmount =
                    purchasePrice * allItems[index].quantity;

                  const description = `${selectedItem?.category?.title || ''}/`;

                  const total = calculateInvoice(unitPrice, tax, '0');

                  allItems[index] = {
                    ...allItems[index],
                    itemId: val.value,
                    purchasePrice,
                    unitPrice,
                    tax,
                    total,
                    costOfGoodAmount,
                    description,
                    accountId: allItems[index].accountId
                      ? allItems[index].accountId
                      : defaultAccount?.id,
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
                    return allItems;
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
                    let quantity = value;
                    if (quantity === null || quantity === undefined) {
                      quantity = 0;
                    }
                    const allItems = [...prev];

                    const costOfGoodAmount = record.purchasePrice * quantity;

                    const indexed = allItems[index].errors?.indexOf('quantity');
                    if (indexed !== -1 && allItems[index]?.errors?.length) {
                      allItems[index].errors.splice(indexed, 1);
                    }

                    const total =
                      calculateInvoice(
                        record[priceKey],
                        record?.tax,
                        record?.itemDiscount || '0'
                      ) * quantity;
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
            error={record?.errors?.length && record?.errors?.includes(key)}
            onChange={(value) => {
              clearTimeout(setStateTimeOut);
              setStateTimeOut = setTimeout(() => {
                setInvoiceItems((prev) => {
                  const allItems = [...prev];

                  const row = {
                    ...allItems[index],
                    [priceKey]: value,
                    itemDiscount: record?.itemDiscount,
                    tax: record?.tax,
                  };
                  const total =
                    calculateInvoice(
                      row[priceKey],
                      row?.tax,
                      row?.itemDiscount
                    ) * parseInt(row?.quantity);

                  allItems[index] = {
                    ...row,
                    purchasePrice: value,
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
                className={`border-less-select contacttype-${IContactTypes.SUPPLIER}`}
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

    history?.push(
      `${ISupportedRoutes?.DASHBOARD_LAYOUT}${ISupportedRoutes?.ADD_CREDIT_NOTE}`,
      null
    );
  };

  useShortcut('i', handleAddRow);
  useShortcut('b', removeRowFromLastIndex);
  useShortcut('/', ClearAll);

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
        isFetching: itemsLoading || invoiceLoading || accountsLoading,
        accountsList,
        relation,
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
