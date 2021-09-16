import { FilterType } from "../../../modal";

export default {
    secondaryAccountId: {
        type: FilterType.LIST_IDS,
          label: "Account Type",
          value: []
      },
  name: {
    type: FilterType.SEARCH,
    label: "Account Name",
    value: "",
    isFullSearch: true,
},
code: {
    type: FilterType.SEARCH,
    label: "Account Code",
    value: "",
    isFullSearch: false,
},
};
