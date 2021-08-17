import { FilterType } from "../../../../modal";

export default {
  date: {
    type: FilterType.DATE_BETWEEN,
    label: "Filter By Date",
    value: "",
  },
  dateIn: {
    type: FilterType.DATE_IN,
    label: "Filter Adjusted Balance Sheet",
    value: "",
  },
};
