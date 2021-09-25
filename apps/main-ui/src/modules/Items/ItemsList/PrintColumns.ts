import { ColumnsType } from "antd/es/table";
import { IPrice, ITemsResult, ITEM_TYPE } from "../../../modal/items";
import { plainToClass } from "class-transformer";

export const PrintColumns: ColumnsType<any> = [
  {
    title: "#",
    dataIndex: "",
    render: (item, row, index) => {
      return index + 1;
    },
  },
  {
    title: "Item Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Category",
    dataIndex: "categoryName",
    key: "categoryName",
  },
  {
    title: "Code",
    dataIndex: "code",
    key: "code",
  },
  {
    title: "Purchase Price ",
    dataIndex: "ppurchasePricerice",
    key: "purchasePrice",
  },
  {
    title: "Sale Price ",
    dataIndex: "salePrice",
    key: "salePrice",
  },
  {
    title: "Item Type ",
    dataIndex: "itemType",
    key: "itemType",
    sorter: false,
    showSorterTooltip: false,
    render: (data) => {
      return data === ITEM_TYPE.PRODUCT
        ? "Product"
        : data === ITEM_TYPE.SERVICE
        ? "Service"
        : "";
    },
  },
  {
    title: "Stock",
    dataIndex: "showStock",
    align: "center",
  },
];
