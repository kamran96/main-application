import { FilterType } from "../../../modal";

export default {
  name: {
    type: FilterType.SEARCH,
    label: "Item Name",
    value: "",
    isFullSearch: true,
  },
  categoryId: {
    type: FilterType.LIST_IDS,
    label: "Category",
    value: [],
  },
  attributes: {
    type: "NESTED_FORM",
    label: "Attributes",
    value: [],
  },
  code: {
    type: FilterType.SEARCH,
    label: "Code",
    value: "",
    isFullSearch: false,
  },
  itemType: {
    type: FilterType.COMPARE,
    label: "Type",
    value: [
      { value: 1, name: "Product" },
      { value: 2, name: "Service" },
    ],
  },
};
