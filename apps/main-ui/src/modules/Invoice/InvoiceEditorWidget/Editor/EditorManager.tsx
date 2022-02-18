/* eslint-disable react/jsx-no-useless-fragment */
import dotsGrid from '@iconify-icons/mdi/dots-grid';
import deleteIcon from '@iconify/icons-carbon/delete';
import addLine from '@iconify/icons-ri/add-line';
import Icon from '@iconify/react';
import { invycePersist } from '@invyce/invyce-persist';
import { Button, Card, Form } from 'antd';
import { ColumnsType } from 'antd/lib/table';
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
import styled from 'styled-components';

import {
  getAllContacts,
  getAllItems,
  getInvoiceByIDAPI,
} from '../../../../api';
import { getAccountsByTypeAPI } from '../../../../api/accounts';
import { Option } from '../../../../components/CommonSelect';
import { Editable, EditableSelect } from '../../../../components/Editable';
import { useGlobalContext } from '../../../../hooks/globalContext/globalContext';
import { useShortcut } from '../../../../hooks/useShortcut';
import {
  Color,
  IContactType,
  IContactTypes,
  NOTIFICATIONTYPE,
  PaymentMode,
} from '../../../../modal';
import { IAccountsResult } from '../../../../modal/accounts';
import { IInvoiceType } from '../../../../modal/invoice';
import { IItemsResult } from '../../../../modal/items';
import { IOrganizationType } from '../../../../modal/organization';
import convertToRem from '../../../../utils/convertToRem';
import {
  calculateInvoice,
  totalDiscountInInvoice,
} from '../../../../utils/formulas';
import moneyFormat from '../../../../utils/moneyFormat';
import { useWindowSize } from '../../../../utils/useWindowSize';
import defaultItems, {
  defaultFormData,
  defaultPayment,
  Requires,
} from './defaultStates';
import c from './keys';
import { usePrevious } from '../../../../hooks/usePrevious';

export const PurchaseContext: any = createContext({});
export const usePurchaseWidget: any = () => useContext(PurchaseContext);

interface IProps {
  children?: ReactElement<unknown>;
  type?: 'SI' | 'QO';
  id?: number;
  onSubmit?: (payload: unknown) => void;
}

interface IPaymentPayload {
  paymentMode: number;
  totalAmount: number;
  totalDiscount: number;
  dueDate: {
    [key: string]: any;
  };
  paymentType?: number;
  bankId?: number;
  amount?: number | string | null;
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
  const APISTAKE_GETORDERS = getInvoiceByIDAPI;

  const [rowsErrors, setRowsErrors] = useState([]);
  const [width] = useWindowSize();
  const { notificationCallback, setItemsModalConfig, userDetails } =
    useGlobalContext();

  const { organization } = userDetails;

  /* ************ HOOKS *************** */
  // Accounts Fetched By Types

  const { data: accountsData, isLoading: accountsLoading } = useQuery(
    [`accounts-${type}`, type === IInvoiceType.INVOICE ? 'invoice' : 'bill'],
    getAccountsByTypeAPI,
    {
      enabled:
        type === IInvoiceType.INVOICE &&
        organization.organizationType === IOrganizationType.SAAS,
    }
  );

  const accountsList: IAccountsResult[] = accountsData?.data?.result || [];
  const [defaultAccount] = accountsList.filter((i) => i.code === '50001');

  /* Component State Hooks */
  const [invoiceDiscount, setInvoiceDiscount] = useState(0);
  const [invoiceItems, setInvoiceItems] = useState<any>([
    { ...defaultItems, accountId: defaultAccount?.id },
  ]);
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

  /* Antd antd form */
  /* And Form Hook */
  const [AntForm] = Form.useForm();

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

  /* Component did mount */
  useEffect(() => {
    AntForm.setFieldsValue(defaultFormData);
  }, [AntForm]);

  const { data: invoicesData, isLoading: invoiceLoading } = useQuery(
    [`${type}-${id}-view`, id],
    APISTAKE_GETORDERS,
    {
      enabled: !!id,
      cacheTime: Infinity,
    }
  );

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

  const contactResult: IContactType[] =
    (data &&
      data.data &&
      data.data.result &&
      data.data.result.filter((cnt: IContactType) => {
        if (type === IInvoiceType.INVOICE || type === IInvoiceType.QUOTE) {
          return cnt.contactType === IContactTypes.CUSTOMER;
        } else {
          return cnt;
        }
      })) ||
    [];

  const getSubTotal = useCallback(() => {
    let subTotal = 0;
    invoiceItems.forEach((item) => {
      subTotal = subTotal + item.unitPrice * item.quantity;
    });
    return subTotal;
  }, [invoiceItems]);
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

  const getItemWithItemId = (id: string | number) => {
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

  const filteredItems = () => {
    const filtered = items?.filter((i, ind) => {
      const ids = invoiceItems?.map((inv) => {
        return inv.itemId;
      });

      if (ids?.includes(i.id)) {
        return null;
      } else {
        return i;
      }
    });

    return filtered;
  };

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
          if (indexed !== -1 && activeItem?.errors?.length) {
            activeItem?.errors?.splice(indexed, 1);
          }
        }
      });

      mutatedItems.push(activeItem);
    });

    setInvoiceItems(mutatedItems);

    return errors;
  };

  const columns: ColumnsType<any> = useMemo(() => {
    return [
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
              style={{ width: '100%', minWidth: '180px', maxWidth: '180px' }}
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

                    const description = `${
                      selectedItem?.category?.title || ''
                    }/`;

                    const total = calculateInvoice(
                      unitPrice,
                      tax,
                      itemDiscount
                    );

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

                    allItems.splice(index, 1, {
                      ...record,
                      itemId: val.value,
                      unitPrice: unitPrice.toFixed(2),
                      tax,
                      itemDiscount,
                      total,
                      costOfGoodAmount,
                      description,
                      accountId: record?.accountId
                        ? record?.accountId
                        : defaultAccount?.id,
                    });
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
                {filteredItems().map((item: IItemsResult, mapIndex: number) => {
                  return (
                    <Option key={mapIndex} title={item.name} value={item.id}>
                      {item.code} / {item.name}
                    </Option>
                  );
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
                      delete allItems[index]?.quantityError;

                      const costOfGoodAmount = purchasePrice * quantity;
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
                        calculateInvoice(unitPrice, tax, itemDiscount) *
                        quantity;

                      const indexed = record.errors?.indexOf('quantity');
                      if (indexed !== -1 && record?.errors?.length) {
                        record.errors.splice(indexed, 1);
                      }
                      allItems[index] = {
                        ...record,
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
                    const itemDiscount = record.itemDiscount;
                    const tax = record.tax;
                    const total =
                      calculateInvoice(unitPrice, tax, itemDiscount) *
                      parseInt(record.quantity);

                    const indexed = record.errors?.indexOf('unitPrice');

                    if (indexed !== -1 && record?.errors?.length) {
                      record.errors.splice(indexed, 1);
                    }

                    allItems[index] = {
                      ...record,
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
                    const tax = record.tax;
                    const total =
                      calculateInvoice(unitPrice, tax, itemDiscount) *
                      parseInt(record.quantity);
                    const indexed = record.errors?.indexOf('itemDiscount');
                    if (indexed !== -1 && record?.errors?.length) {
                      record.errors.splice(indexed, 1);
                    }

                    allItems[index] = {
                      ...record,
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
            render: (value, record, index) => {
              return (
                <EditableSelect
                  error={record?.errors?.includes('accountId')}
                  className={`border-less-select`}
                  value={{
                    value: value !== null ? value : defaultAccount?.id || '',
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
                      const indexed = record?.errors?.indexOf('accountId');

                      if (indexed !== -1 && record?.errors?.length) {
                        record?.errors?.splice(indexed, 1);
                      }

                      allItems[index] = {
                        ...record,
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
        width: width > 1500 ? 150 : 130,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredItems]);
  const handleScroll = () => {
    const ele: HTMLElement = document.querySelector('.ant-table-tbody');

    ele.lastElementChild.scrollIntoView({ block: 'end', behavior: 'smooth' });
  };

  /* Scroll to last added item */

  //   const handleScroll = () => {
  //     let ele: HTMLElement = document.querySelector(".ant-table-tbody");

  //     ele.lastElementChild.scrollIntoView();
  //   };

  const handleAddRow = () => {
    setInvoiceItems((prev) => {
      const items = [...prev];
      items.push({
        ...defaultItems,
        index: items.length,
      });
      return items;
    });

    setTimeout(() => {
      handleScroll();
    }, 1000);
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
    setInvoiceDiscount(0);
    setInvoiceItems([{ ...defaultItems, accountId: defaultAccount?.id }]);
    setPayment({ ...defaultPayment });
    AntForm.setFieldsValue({
      ...defaultFormData,
    });
    setDeleteIds([]);
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
        handleCheckValidation,
        getCachedInvoice,
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
        </div>
        {/* <div className="sider"><EmailSider/></div> */}
        {/* {children} */}
      </LayoutWrapper>
    </PurchaseContext.Provider>
  );
};

const LayoutWrapper = styled.section`
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
