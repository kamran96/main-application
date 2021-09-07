import dotsGrid from "@iconify-icons/mdi/dots-grid";
import deleteIcon from "@iconify/icons-carbon/delete";
import addLine from "@iconify/icons-ri/add-line";
import Icon from "@iconify/react";
import { Button, Form } from "antd";
import { ColumnsType } from "antd/lib/table";
import dayjs from "dayjs";
import update from "immutability-helper";
import React, {
  createContext,
  FC,
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useQuery } from "react-query";
import { SortableHandle } from "react-sortable-hoc";
import {
  getAllContacts,
  getAllItems,
  getInvoiceByIDAPI,
  getPurchasesById,
} from "../../api";
import { getAccountsByTypeAPI } from "../../api/accounts";
import { useGlobalContext } from "../../hooks/globalContext/globalContext";
import { useShortcut } from "../../hooks/useShortcut";
import {
  Color,
  IContactType,
  IContactTypes,
  NOTIFICATIONTYPE,
  PaymentMode,
} from "../../modal";
import { IAccountsResult } from "../../modal/accounts";
import { IInvoiceType } from "../../modal/invoice";
import { IItemsResult } from "../../modal/items";
import { IOrganizationType } from "../../modal/organization";
import convertToRem from "../../utils/convertToRem";
import { calculateInvoice, totalDiscountInInvoice } from "../../utils/formulas";
import moneyFormat from "../../utils/moneyFormat";
import { useWindowSize } from "../../utils/useWindowSize";
import CommonSelect, { Option } from "../CommonSelect";
import { Editable, EditableSelect } from "../Editable";
import defaultItems, { defaultFormData, defaultPayment } from "./defaultStates";

export const PurchaseContext: any = createContext({});
export const usePurchaseWidget: any = () => useContext(PurchaseContext);

interface IProps {
  children?: ReactElement<any>;
  type?: "BILL" | "SI" | "POE" | "PO" | "QO";
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
    style={{ cursor: "move", color: "#999", fontSize: 17 }}
    icon={dotsGrid}
    color={"#B1B1B1"}
  />
));

let setStateTimeOut: any;

export const PurchaseManager: FC<IProps> = ({ children, type, id }) => {
  /* API STAKE */
  const APISTAKE_GETORDERS =
    type===IInvoiceType.BILL || type===IInvoiceType.PURCHASE_ENTRY || type===IInvoiceType.PURCHASE_ORDER  ? getPurchasesById : getInvoiceByIDAPI;

  const [rowsErrors, setRowsErrors] = useState([]);
  const [width] = useWindowSize();

  /* ************ HOOKS *************** */

  /* Component State Hooks */
  const [invoiceDiscount, setInvoiceDiscount] = useState(0);
  const [invoiceItems, setInvoiceItems] = useState<any>([]);
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
  const [accountRowSelectedIndex, setAccountRowSelectedIndex] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  /* Antd antd form */
  /* And Form Hook */
  const [AntForm] = Form.useForm();

  /* Component did mount */
  useEffect(() => {
    AntForm.setFieldsValue({
      issueDate: dayjs(),
      currency: "PKR",
      invoiceDiscount: 0,
    });

    let initialInvoiceItemsState = [];
    for (let i = 0; i <= 2; i++) {
      initialInvoiceItemsState.push({
        ...defaultItems,
        index: 1 + 1,
        accountId: type === IInvoiceType.INVOICE ? 321 : null,
      });
    }
    setInvoiceItems(initialInvoiceItemsState);
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

      let key =
        type === IInvoiceType.PURCHASE_ENTRY
          ? `purchase_items`
          : "invoice_items";
      const itemsDiscount =
        (result && totalDiscountInInvoice(result[key], "itemDiscount", type)) ||
        0;

      const invoiceDiscount = discount - itemsDiscount;
      setInvoiceDiscount(invoiceDiscount);
      AntForm.setFieldsValue({
        ...result,
        dueDate: dayjs(result.dueDate),
        issueDate: dayjs(result.issueDate),
        invoiceDiscount,
      });

      let invoice_items = [];
      result[key].forEach((item, index) => {
        let purchasePrice = item.purchasePrice ? item.purchasePrice : 0;
        let unitPrice = item.unitPrice ? item.unitPrice : 0;
        let tax = item.tax ? item.tax : 0;
        let total = item.total ? item.total : 0;
        let itemDiscount = item.itemDiscount ? item.itemDiscount : 0;
        let quantity = item.quantity ? item.quantity : 1;
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

      let sortedItems = invoice_items.sort((a, b) => {
        return a.sequence - b.sequence;
      });

      setInvoiceItems(sortedItems);
    }
  }, [invoicesData, AntForm, type]);

  /*Query hook for  Fetching all accounts against ID */
  const { isLoading, data } = useQuery(
    [`all-contacts`, "ALL"],
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
    [`accounts-${type}`, type === IInvoiceType.INVOICE ? "invoice" : "bill"],
    getAccountsByTypeAPI,
    {
      enabled:
        (type === IInvoiceType.INVOICE &&
          organization.organizationType === "EN") ||
        (type === "BILL" && organization.organizationType === "EN"),
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
    return totalDiscountInInvoice(invoiceItems, "tax", type);
  }, [invoiceItems, type]);
  /* Gets Gross total amount on invoices */
  const GrossTotal = useMemo(() => {
    return getSubTotal() + TotalTax;
  }, [getSubTotal(), TotalTax]);

  /* Gets Total Discount on items */
  const TotalDiscount = useMemo(() => {
    return totalDiscountInInvoice(invoiceItems, "itemDiscount", type);
  }, [invoiceItems, type]);

  let GrandTotal: any = useMemo(() => {
    return invoiceItems.length
      ? invoiceItems.reduce((a, b) => ({ total: a.total + b.total }))
      : { total: 0 };
  }, [invoiceItems]);

  let IDiscount: number = useMemo(() => {
    return invoiceDiscount ? invoiceDiscount : 0;
  }, [invoiceDiscount]);

  let NetTotal = useMemo(() => {
    return GrandTotal.total - IDiscount;
  }, [GrandTotal, IDiscount]);

  /*Query hook for  Fetching all items against ID */
  const { data: itemsData, isLoading: itemsLoading } = useQuery(
    [`all-items`, "ALL"],
    getAllItems
  );

  const result: IItemsResult[] =
    (itemsData && itemsData.data && itemsData.data.result) || [];

  const handleDelete = (index) => {
    let alldata = [...invoiceItems];
    alldata.splice(index, 1);
    setInvoiceItems(alldata);
  };

  const getItemWithItemId = (id: number | string) => {
    if (items && items.length) {
      let [filtered] = items.filter((item) => item.id === id);

      return filtered;
    }else{
      return null
    }
  };

  const getAccountNameByID = (id) => {
    let [filtered] = accountsList?.filter((item) => item?.id === id);

    return filtered ? filtered?.name : id;
  };

  const enableAccountColumn =
    organization.organizationType === IOrganizationType.ENTERPRISE &&
    type !== "QO";

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

  const columns: ColumnsType<any> = [
    {
      title: "",
      dataIndex: "sort",
      width: 30,
      className: "drag-visible textCenter",
      render: () => <DragHandle />,
      shouldCellUpdate: (record, prevRecord)=> record.toString()!==prevRecord.toString()
    },
    {
      title: "#",
      width: 48,
      
      render: (value, record, index) => {
        return <>{index + 1}</>;
      },
      align: "center",
    },
    {
      title: "Item",
      dataIndex: "itemId",
      key: "itemId",
      width: width > 1500 ? 220 : 190,
      align: "left",
      className: `select-column`,
      
      render: (value, record, index) => {
        return (
          <EditableSelect
          onClick={() => setSelectedIndex(index)}
          className={`border-less-select ${
            index === invoiceItems.length - 1 ? "scrollIntoView" : ""
            }`}
            loading={itemsLoading}
            size="middle"
            value={{
              value: value !== null ? value : "",
              label: `${
                value !== null && items.length
                ? items &&
                getItemWithItemId(value) &&
                `${getItemWithItemId(value).code} / ${
                  getItemWithItemId(value).name
                }`
                : "Select Item"
              }`,
            }}
            labelInValue={true}
            showSearch
            style={{ width: "100%", minWidth: "180px" }}
            placeholder="Select Items"
            optionFilterProp="children"
            onChange={(val) => {
              if (val.value !== "new_item") {
                let [selectedItem] = items.filter(
                  (item) => item.id === val.value
                  );
                  let allItems = [...invoiceItems];
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
                    "0";
                    let tax =
                    (selectedItem &&
                    selectedItem.price &&
                    selectedItem.price.tax) ||
                    "0";
                    let costOfGoodAmount = purchasePrice * allItems[index].quantity;
                    
                    if (
                      type === IInvoiceType.INVOICE &&
                      selectedItem.stock < record.quantity
                      ) {
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
                
                let description = `${selectedItem?.category?.title || ""}/`;
                
                let total =
                type === IInvoiceType.PURCHASE_ENTRY
                ? calculateInvoice(purchasePrice, tax, itemDiscount)
                : calculateInvoice(unitPrice, tax, itemDiscount);
                
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
                setInvoiceItems(allItems);
              }
            }}
            >
            <>
              {/* <Rbac permission={PERMISSIONS.ITEMS_CREATE}> */}
              <Option value={"new_item"}>
                <Button
                  className="flex alignCenter"
                  type="link"
                  onClick={() => {
                    setItemsModalConfig(true);
                  }}
                  >
                  {" "}
                  <Icon icon={addLine} />{" "}
                  <span className="ml-10">New Item</span>
                </Button>
              </Option>
              {/* </Rbac> */}
              {selectedIndex === index &&
                items.map((item: IItemsResult, index: number) => {
                  let usedIds = [];
                  invoiceItems.forEach((st) => {
                    if (st.itemId !== null) {
                      usedIds.push(st.itemId);
                    }else{
                      return null
                    }
                  });
                  if (!usedIds.includes(item.id)) {
                    return (
                      <Option key={index} title={item.name} value={item.id}>
                        {item.code} / {item.name}
                      </Option>
                    );
                  }else{
                    return null
                    
                  }
                })}
            </>
          </EditableSelect>
        );
      },
    },
    
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: width > 1500 ? 670 : 230,
      
      render: (data, record, index) => {
        return (
          <Editable
          onChange={(e) => {
            let value = e.target.value;
            e.preventDefault();
            clearTimeout(setStateTimeOut);
            setStateTimeOut = setTimeout(() => {
              if (value) {
                let allItems = [...invoiceItems];
                  allItems[index] = { ...allItems[index], description: value };
                  setInvoiceItems(allItems);
                }
              }, 500);
            }}
            placeholder="Description"
            size={"middle"}
            value={data}
            />
            );
          },
        },
    {
      title: "Qty",
      dataIndex: "quantity",
      key: "quantity",
      // width: width > 1500 ? 150 : 120,
      
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
                    let allItems = [...invoiceItems];
                    let unitPrice = record.unitPrice;
                    let purchasePrice = record.purchasePrice;
                    let itemDiscount = record.itemDiscount;
                    
                    let costOfGoodAmount = record.purchasePrice * quantity;
                    let tax = record.tax;
                    
                    if (
                      type === IInvoiceType.INVOICE &&
                      selectedItem.stock < value
                      ) {
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
                  type === IInvoiceType.PURCHASE_ENTRY
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
                  setInvoiceItems(allItems);
                }
              }, 500);
            }}
            placeholder="qty"
            type="number"
            value={value}
            size={"middle"}
            />
        );
      },
    },
    {
      title: "Unit Price",
      dataIndex: "unitPrice",
      key: "unitPrice",
      // width: width > 1500 ? 150 : "",
      
      render: (value, record, index) => {
        return (
          <Editable
          onChange={(value) => {
            clearTimeout(setStateTimeOut);
            setStateTimeOut = setTimeout(() => {
              let allItems = [...invoiceItems];
              let unitPrice = value;
                let purchasePrice = record.purchasePrice;
                let itemDiscount = record.itemDiscount;
                let tax = record.tax;
                let total =
                type === IInvoiceType.PURCHASE_ENTRY
                    ? calculateInvoice(purchasePrice, tax, itemDiscount) *
                    parseInt(record.quantity)
                    : calculateInvoice(unitPrice, tax, itemDiscount) *
                    parseInt(record.quantity);
                    
                    allItems[index] = {
                      ...allItems[index],
                      unitPrice,
                      total,
                    };
                    setInvoiceItems(allItems);
                  }, 500);
                }}
                type="number"
                value={value}
                size={"middle"}
                />
                );
              },
            },
    {
      title: "Disc %",
      dataIndex: "itemDiscount",
      key: "itemDiscount",
      // width: width > 1500 ? 150 : "",
      
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
                let allItems = [...invoiceItems];
                let itemDiscount = value.replace(/\b0+/g, "");
                
                if (itemDiscount === "") {
                  itemDiscount = "0";
                }
                let unitPrice = record.unitPrice;
                let purchasePrice = record.purchasePrice;
                let tax = record.tax;
                let total =
                type === IInvoiceType.PURCHASE_ENTRY
                    ? calculateInvoice(purchasePrice, tax, itemDiscount) *
                    parseInt(record.quantity)
                    : calculateInvoice(unitPrice, tax, itemDiscount) *
                    parseInt(record.quantity);
                    
                    allItems[index] = {
                      ...allItems[index],
                      itemDiscount,
                      total,
                    };
                    setInvoiceItems(allItems);
                  }, 400);
                }}
                size={"middle"}
                />
        );
      },
    },
    enableAccountColumn
    ? {
      title: "Account",
      dataIndex: "accountId",
      width: width > 1500 ? 220 : 150,
      render: (value, row, index) => {
        console.log(value);
        return (
          <CommonSelect
          onClick={() => setAccountRowSelectedIndex(index)}
          className={`border-less-select`}
          value={{
            value: value !== null ? value : "",
                  label:
                  (accountsList?.length && getAccountNameByID(value)) ||
                  "Select Account",
                }}
                labelInValue={true}
                loading={accountsLoading}
                size="middle"
                showSearch
                style={{ width: "100%"}}
                placeholder="Select Account"
                optionFilterProp="children"
                onChange={(val) => {
                  let allItems = [...invoiceItems];
                  allItems[index] = {
                    ...allItems[index],
                    accountId: val.value,
                  };
                  setInvoiceItems(allItems);
                }}
                >
                <>
                  {accountRowSelectedIndex === index &&
                    accountsList.map((acc: IAccountsResult, index: number) => {
                      return (
                        <Option key={index} value={acc.id}>
                          {acc.name}
                        </Option>
                      );
                    })}
                </>
              </CommonSelect>
            );
          },
        }
        : {
          width: 0,
        },
        {
      title: "Tax",
      dataIndex: "tax",
      key: "tax",
      // width: width > 1500 ? 150 : 130,
      align: "center",
      
      render: (value, record, index) => {
        return <>{value}</>;
      },
    },
    {
      title: "Amount",
      dataIndex: "total",
      // width: 170,
      key: "total",
      align: "center",
      render: (value, record, index) => (
        <>{typeof value === "number" ? moneyFormat(value) : value}</>
        ),
      },
      {
        title: "",
        key: "action",

        // width: 50,
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

  if (type === IInvoiceType.PURCHASE_ENTRY) {
    columns.splice(5, 0, {
      title: "Purchase Price",
      dataIndex: "purchasePrice",
      key: "purchasePrice",

      render: (value, record, index) => {
        return (
          <Editable
            disabled={!record.itemId}
            onChange={(value) => {
              clearTimeout(setStateTimeOut);

              setTimeout(() => {
                let allItems = [...invoiceItems];
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
                setInvoiceItems(allItems);
              }, 500);
            }}
            type="number"
            value={value}
            size={"middle"}
          />
        );
      },
    });
  }

  /* Scroll to last added item */

  const handleScroll = () => {
    let ele: HTMLElement = document.querySelector(".ant-table-tbody");

    ele.lastElementChild.scrollIntoView();
  };

  const handleAddRow = () => {
    let items = [...invoiceItems];
    items.push({ ...defaultItems, index: items.length });
    setInvoiceItems(items);
    setTimeout(() => {
      handleScroll();
    }, 600);
  };

  /* This function is responsible to remove invoice item from last index like (LIFO) */
  const removeRowFromLastIndex = () => {
    let allItems = [...invoiceItems];
    let lastIndex = allItems.length - 1;
    allItems.splice(lastIndex, 1);
    setInvoiceItems(allItems);
  };

  /* This function is responsible to clear all invoice items and reset form */

  const ClearAll = () => {
    AntForm.resetFields();
    setInvoiceItems([{ ...defaultItems }]);
    setPayment({ ...defaultPayment });
    AntForm.setFieldsValue({
      ...defaultFormData,
    });
    setPaymentReset(true);
    setTimeout(() => {
      setPaymentReset(false);
    }, 200);
  };

  useShortcut("i", handleAddRow);
  useShortcut("b", removeRowFromLastIndex);
  useShortcut("/", ClearAll);

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
        isFetching: itemsLoading || invoiceLoading,
      }}
    >
      {children}
    </PurchaseContext.Provider>
  );
};
