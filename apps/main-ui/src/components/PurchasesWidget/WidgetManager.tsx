import dotsGrid from '@iconify-icons/mdi/dots-grid';
import deleteIcon from '@iconify/icons-carbon/delete';
import addLine from '@iconify/icons-ri/add-line';
import Icon from '@iconify/react';
import { Button, Card, Form } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import dayjs from 'dayjs';
import update from 'immutability-helper';
import React, {
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
import {
  getAllContacts,
  getAllItems,
  getInvoiceByIDAPI,
  getInvoiceNumber,
  getPurchasesById,
} from '../../api';
import { getAccountsByTypeAPI } from '../../api/accounts';
import { useGlobalContext } from '../../hooks/globalContext/globalContext';
import { useShortcut } from '../../hooks/useShortcut';
import {
  Color,
  IContactType,
  IContactTypes,
  NOTIFICATIONTYPE,
  PaymentMode,
} from '../../modal';
import { IAccountsResult } from '../../modal/accounts';
import { IInvoiceType } from '../../modal/invoice';
import { IItemsResult } from '../../modal/items';
import { IOrganizationType } from '../../modal/organization';
import convertToRem from '../../utils/convertToRem';
import { calculateInvoice, totalDiscountInInvoice } from '../../utils/formulas';
import moneyFormat from '../../utils/moneyFormat';
import { useWindowSize } from '../../utils/useWindowSize';
import { Option } from '../CommonSelect';
import { Editable, EditableSelect } from '../Editable';
import defaultItems, {
  defaultFormData,
  defaultPayment,
  Requires,
} from './defaultStates';
import { invycePersist } from '@invyce/invyce-persist';
import c from './keys';
import styled from 'styled-components';
import usePrevious from '../../hooks/usePrevious';

interface IManagerContext {
  rowsErrors: number[];
  setRowsErrors: (payload: number[]) => void;
  columns: any;
  contactResult: IContactType[];
  getSubTotal: () => void;
  TotalTax: number;
  GrossTotal: number;
  TotalDiscount: number;
  GrandTotal: number | string;
  IDiscount: number | string;
  NetTotal: number | string;
  invoiceDiscount: number | string;
  setInvoiceDiscount: (key: number) => void;
  invoiceItems: typeof defaultItems[];
  setInvoiceItems: (payload: typeof defaultItems[]) => void;
  invoiceStatus: number;
  setInvoiceStatus: (status: number) => void;
  deleteIds: number[] | string[];
  setDeleteIds: (ids: number[] | string[]) => void;
  AntForm: typeof Form.useForm | any;
  moveRow: (dragIndex: number, hoverIndex: number) => void;
  paymentReset: boolean;
  setPaymentReset: (bool: boolean) => void;
  ClearAll: () => void;
  handleAddRow: () => void;
  isFetching: boolean;
  payment: any;
  setPayment: (a?: any) => void;
  handleCheckValidation: () => any[];
}

export const PurchaseContext = createContext<Partial<IManagerContext>>({});
export const usePurchaseWidget = () => useContext(PurchaseContext);

interface IProps {
  children?: ReactElement<any>;
  type?: 'BILL' | 'SI' | 'POE' | 'PO' | 'QO';
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

export const PurchaseManager: FC<IProps> = ({ children, type, id }) => {
  /* API STAKE */
  const APISTAKE_GETORDERS =
    type === IInvoiceType.BILL ||
    type === IInvoiceType.PURCHASE_ENTRY ||
    type === IInvoiceType.PURCHASE_ORDER
      ? getPurchasesById
      : getInvoiceByIDAPI;

  const [rowsErrors, setRowsErrors] = useState([]);
  const [width] = useWindowSize();

  /* ************ HOOKS *************** */

  /* Component State Hooks */
  const [invoiceDiscount, setInvoiceDiscount] = useState(0);
  const [invoiceItems, setInvoiceItems] = useState<any>([defaultItems]);
  const [invoiceStatus, setInvoiceStatus] = useState(1);
  const [deleteIds, setDeleteIds] = useState([]);
  const [paymentReset, setPaymentReset] = useState(false);
  const [payment, setPayment] = useState<IPaymentPayload>({
    paymentMode: PaymentMode.CREDIT,
    totalAmount: 0,
    totalDiscount: 0,
    dueDate: dayjs(),
    paymentType: null,
  });
  const [hasCachedData, setHasCachedData] = useState(false);

  /* Antd antd form */
  /* And Form Hook */
  const [AntForm] = Form.useForm();

  /* CACHING ANT FORM DATA AND RETRIVE DATA HANDLERS */

  const cachePurchasesData = invycePersist(
    c.CACHEKEY + type,
    '',
    'localStorage'
  ).get();
  const antFormCacheData =
    invycePersist(c.ANTFORMCACHE + type, '', 'localStorage').get() || {};

  const previousCachedTableData = usePrevious(cachePurchasesData);
  const previousCachedAntFormData: any = usePrevious(antFormCacheData);

  const getCachedTableData = () => {
    setInvoiceItems(previousCachedTableData);
    AntForm.setFieldsValue({
      ...previousCachedAntFormData,
      dueDate: dayjs(previousCachedAntFormData.dueDate),
      issueDate: dayjs(previousCachedAntFormData.issueDate),
    });
    setHasCachedData(false);
  };

  const destroyCachedInvoice = () => {
    resetPersist();
    setHasCachedData(false);
  };

  const memoInvoiceItems = useMemo(() => {
    return invoiceItems;
  }, [invoiceItems]);

  useEffect(() => {
    if (
      cachePurchasesData &&
      JSON.stringify(cachePurchasesData) !== JSON.stringify(memoInvoiceItems)
    ) {
      setHasCachedData(true);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (!hasCachedData) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memoInvoiceItems]);
  /* CACHING ANT FORM DATA AND RETRIVE DATA HANDLERS ENDS HERE */

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
      enabled: id,
      cacheTime: Infinity,
    }
  );

  /* Component did update hook to update InvoiceItems when API getInvoiceByIDAPI successfully returns */
  useEffect(() => {
    if (invoicesData && invoicesData.data && invoicesData.data.result) {
      const { result } = invoicesData.data;
      // const { payment } = result;
      const { discount } = result;

      const key =
        type === IInvoiceType.PURCHASE_ENTRY ? `purchaseItems` : 'invoiceItems';
      const itemsDiscount =
        (result && totalDiscountInInvoice(result[key], 'itemDiscount', type)) ||
        0;

      const invoiceDiscount = discount - itemsDiscount;
      setInvoiceDiscount(invoiceDiscount);
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

  const { data: invoiceNumberData } = useQuery(
    ['', IInvoiceType.BILL],
    getInvoiceNumber
  );

  useEffect(() => {
    if (invoiceNumberData?.data?.result) {
      const { result } = invoiceNumberData?.data;
      AntForm.setFieldsValue({ invoiceNumber: result });
    }
  }, [invoiceNumberData, AntForm]);

  const contactResult: IContactType[] =
    (data &&
      data.data &&
      data.data.result &&
      data.data.result.filter((cnt: IContactType) => {
        if (type === IInvoiceType.PURCHASE_ENTRY) {
          return cnt.contactType === IContactTypes.SUPPLIER;
        } else if (
          type === IInvoiceType.INVOICE ||
          type === IInvoiceType.QUOTE
        ) {
          return cnt.contactType === IContactTypes.CUSTOMER;
        } else {
          return cnt;
        }
      })) ||
    [];

  // Accounts Fetched By Types

  const { data: accountsData, isLoading: accountsLoading } = useQuery(
    [`accounts-${type}`, type === IInvoiceType.INVOICE ? 'invoice' : 'bill'],
    getAccountsByTypeAPI,
    {
      enabled: organization?.organizationType === IOrganizationType?.SAAS,
    }
  );

  const accountsList: IAccountsResult[] = accountsData?.data?.result || [];

  const getSubTotal = useCallback(() => {
    let subTotal = 0;
    invoiceItems.forEach((item) => {
      subTotal =
        type === IInvoiceType.PURCHASE_ENTRY
          ? subTotal + item.purchasePrice * item.quantity
          : subTotal + item.unitPrice * item.quantity;
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

  const getItemWithItemId = (id: number | string) => {
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
    organization.organizationType === IOrganizationType.SAAS && type !== 'QO';

  const items: IItemsResult[] =
    type === IInvoiceType.INVOICE
      ? (result.length > 0 &&
          result.filter(
            (item) =>
              item.price &&
              item.price.purchasePrice !== null &&
              item.price.salePrice !== null
          )) ||
        []
      : result;

  const handleCheckValidation = () => {
    const errors = [];
    const mutatedItems = [];
    invoiceItems?.forEach((item, index) => {
      const activeItem = { ...item };

      Object?.keys(item)?.forEach((key, keyIndex) => {
        if (Requires[key]?.require === true && !activeItem[key]) {
          if (activeItem?.errors?.length) {
            errors?.push(`In Row ${index + 1}, ${key} is required`);
            if (!activeItem?.errors?.includes(key)) {
              activeItem.errors.push(key);
            }
          } else {
            activeItem.errors = [key];
          }
        } else {
          const indexed = activeItem.errors?.indexOf(key);
          if (indexed !== -1 && activeItem.errors?.length) {
            activeItem.errors.splice(indexed, 1);
          }
        }
      });

      mutatedItems.push(activeItem);
    });

    setInvoiceItems(mutatedItems);

    return errors;
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
      width: width > 1500 ? 220 : 190,
      align: 'left',
      className: `select-column`,

      render: (value, record, index) => {
        return (
          <EditableSelect
            error={record?.errors?.includes('itemId')}
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
            style={{ width: '100%', minWidth: '180px', maxWidth: '180px' }}
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

                  if (
                    type === IInvoiceType.INVOICE &&
                    selectedItem.stock < record.quantity
                  ) {
                    const allErrors = [...rowsErrors];
                    allErrors[index] = { hasError: true };
                    setRowsErrors(allErrors);
                    notificationCallback(
                      NOTIFICATIONTYPE.WARNING,
                      `You are out of stock! Only ${selectedItem.stock} items left in your stock`
                    );
                  } else {
                    const allErrors = [...rowsErrors];
                    allErrors[index] = { hasError: false };
                    setRowsErrors(allErrors);
                  }

                  const description = `${selectedItem?.category?.title || ''}/`;

                  const total =
                    type === IInvoiceType.PURCHASE_ENTRY
                      ? calculateInvoice(purchasePrice, tax, itemDiscount)
                      : calculateInvoice(unitPrice, tax, itemDiscount);
                  [
                    'itemId',
                    'unitPrice',
                    'tax',
                    'description',
                    'itemDiscount',
                  ]?.forEach((key) => {
                    const index = record.errors?.indexOf(key);
                    if (index !== -1 && record?.errors?.length) {
                      record?.errors?.splice(index, 1);
                    }
                  });
                  allItems[index] = {
                    ...allItems[index],
                    itemId: val.value,
                    unitPrice: unitPrice.toFixed(2),
                    tax,
                    itemDiscount,
                    total,
                    costOfGoodAmount,
                    description,
                  };
                  if (type === IInvoiceType.PURCHASE_ENTRY) {
                    allItems[index] = {
                      ...allItems[index],
                      purchasePrice: purchasePrice.toFixed(2),
                    };
                  }
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
                invoiceItems.forEach((st) => {
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
                  return null;
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
            error={record?.errors?.includes('description')}
            style={{
              width: '100%',
              minWidth: '180px',
              maxWidth: `${width > 1500 ? `520px` : `230px`}`,
            }}
            onChange={(e) => {
              const value = e.target.value;
              e.preventDefault();
              clearTimeout(setStateTimeOut);
              setStateTimeOut = setTimeout(() => {
                if (value) {
                  setInvoiceItems((prev) => {
                    const allItems = [...prev];
                    const indexed = record.errors?.indexOf('description');
                    if (indexed !== -1 && record?.errors?.length) {
                      record.errors.splice(indexed, 1);
                    }
                    allItems[index] = {
                      ...record,
                      description: value,
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
            error={record?.errors?.includes('quantity')}
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
                    const purchasePrice = record.purchasePrice;
                    const itemDiscount = record.itemDiscount;

                    const costOfGoodAmount = record.purchasePrice * quantity;
                    const tax = record.tax;

                    if (
                      type === IInvoiceType.INVOICE &&
                      selectedItem.stock < value
                    ) {
                      const allErrors = [...rowsErrors];
                      allErrors[index] = { hasError: true };
                      setRowsErrors(allErrors);
                      notificationCallback(
                        NOTIFICATIONTYPE.WARNING,
                        `You are out of stock! Only ${selectedItem.stock} items left in your stock`
                      );
                    } else {
                      const allErrors = [...rowsErrors];
                      allErrors[index] = { hasError: false };
                      setRowsErrors(allErrors);
                    }

                    const total =
                      type === IInvoiceType.PURCHASE_ENTRY
                        ? calculateInvoice(purchasePrice, tax, itemDiscount) *
                          quantity
                        : calculateInvoice(unitPrice, tax, itemDiscount) *
                          quantity;

                    const indexed = allItems[index].errors?.indexOf('quantity');
                    if (indexed !== -1 && allItems[index].errors?.length) {
                      allItems[index].errors.splice(indexed, 1);
                    }
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
            error={record?.errors?.includes('unitPrice')}
            onChange={(value) => {
              clearTimeout(setStateTimeOut);
              setStateTimeOut = setTimeout(() => {
                setInvoiceItems((prev) => {
                  const allItems = [...prev];
                  const unitPrice = value;
                  const purchasePrice = record.purchasePrice;
                  const itemDiscount = record.itemDiscount;
                  const tax = record.tax;
                  const total =
                    type === IInvoiceType.PURCHASE_ENTRY
                      ? calculateInvoice(purchasePrice, tax, itemDiscount) *
                        parseInt(record.quantity)
                      : calculateInvoice(unitPrice, tax, itemDiscount) *
                        parseInt(record.quantity);

                  const indexed = allItems[index].errors?.indexOf('unitPrice');
                  if (indexed !== -1) {
                    allItems[index].errors.splice(indexed, 1);
                  }

                  allItems[index] = {
                    ...allItems[index],
                    unitPrice,
                    total,
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
      // width: width > 1500 ? 150 : "",

      render: (value, record, index) => {
        return (
          <Editable
            error={record?.errors?.includes('itemDiscount')}
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
                  const purchasePrice = record.purchasePrice;
                  const tax = record.tax;
                  const total =
                    type === IInvoiceType.PURCHASE_ENTRY
                      ? calculateInvoice(purchasePrice, tax, itemDiscount) *
                        parseInt(record.quantity)
                      : calculateInvoice(unitPrice, tax, itemDiscount) *
                        parseInt(record.quantity);
                  const indexed =
                    allItems[index].errors?.indexOf('itemDiscount');
                  if (indexed !== -1) {
                    allItems[index].errors.splice(indexed, 1);
                  }
                  allItems[index] = {
                    ...allItems[index],
                    itemDiscount,
                    total,
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
                error={row?.errors?.includes('accountId')}
                className={`border-less-select`}
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
                    const indexed =
                      allItems[index].errors?.indexOf('accountId');
                    if (indexed !== -1 && allItems[index].errors?.length) {
                      allItems[index].errors.splice(indexed, 1);
                    }
                    allItems[index] = {
                      ...allItems[index],
                      accountId: val.value,
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
        return <>{value}</>;
      },
    },
    {
      title: 'Amount',
      dataIndex: 'total',
      width: 170,
      key: 'total',
      align: 'center',
      render: (value, record, index) => (
        <>{typeof value === 'number' ? moneyFormat(value) : value}</>
      ),
    },
    {
      title: '',
      key: 'action',

      // width: 50,
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

  if (type === IInvoiceType.PURCHASE_ENTRY) {
    columns.splice(5, 0, {
      title: 'Purchase Price',
      dataIndex: 'purchasePrice',
      key: 'purchasePrice',

      render: (value, record, index) => {
        return (
          <Editable
            error={record?.errors?.includes('purchasePrice')}
            disabled={!record.itemId}
            onChange={(value) => {
              clearTimeout(setStateTimeOut);

              setTimeout(() => {
                const allItems = [...invoiceItems];
                const purchasePrice = value;
                const costOfGoodAmount =
                  purchasePrice * allItems[index].quantity;
                const total =
                  calculateInvoice(
                    purchasePrice,
                    record.tax,
                    record.itemDiscount
                  ) * record.quantity;

                const indexed =
                  allItems[index].errors?.indexOf('purchasePrice');
                if (indexed !== -1) {
                  allItems[index].errors.splice(indexed, 1);
                }

                allItems[index] = {
                  ...allItems[index],
                  purchasePrice,
                  total,
                  costOfGoodAmount,
                };
                setInvoiceItems(allItems);
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

  /* Scroll to last added item */

  const handleScroll = () => {
    const ele: HTMLElement = document.querySelector('.ant-table-tbody');

    ele.lastElementChild.scrollIntoView({ block: 'end', behavior: 'smooth' });
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
  const resetPersist = () => {
    invycePersist().resetData(c.CACHEKEY + type, 'localStorage');
    invycePersist().resetData(c.ANTFORMCACHE + type, 'localStorage');
  };
  const ClearAll = () => {
    AntForm.resetFields();
    setInvoiceItems([{ ...defaultItems }]);
    setPayment({ ...defaultPayment });
    AntForm.setFieldsValue({
      ...defaultFormData,
    });
    setInvoiceDiscount(0);
    resetPersist();
    setPaymentReset(true);
    setTimeout(() => {
      setPaymentReset(false);
    }, 200);
  };

  useShortcut('i', handleAddRow);
  useShortcut('b', removeRowFromLastIndex);
  useShortcut('/', ClearAll);

  const moveRow: any = useCallback(
    (dragIndex, hoverIndex) => {
      const dragRow = invoiceItems[dragIndex];
      setInvoiceItems(
        update(invoiceItems, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRow],
          ],
        })
      );
    },
    [invoiceItems]
  );

  return (
    <PurchaseContext.Provider
      value={{
        handleCheckValidation,
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
        payment,
        setPayment,
        AntForm,
        moveRow,
        paymentReset,
        setPaymentReset,
        ClearAll,
        handleAddRow,
        isFetching: itemsLoading || invoiceLoading || accountsLoading,
      }}
    >
      <LayoutWrapper>
        <div className="table_content">
          {hasCachedData && (
            <div className="notifier">
              <span>
                Do you want to continue from where you left before?
                <br />
                <Button
                  onClick={getCachedTableData}
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
        </div>
        {/* <div className="sider"><EmailSider/></div> */}
        {/* {children} */}
      </LayoutWrapper>
    </PurchaseContext.Provider>
  );
};

const LayoutWrapper = styled.div`
  .table_content {
    width: calc(100% - 0);
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
  }
`;
