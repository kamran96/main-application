import dayjs from "dayjs";
import { PaymentMode } from "../../modal";

export default {
  itemId: null,
  description: "",
  quantity: 1,
  unitPrice: 0,
  purchasePrice: 0,
  itemDiscount: "0",
  tax: "0",
  total: 0,
  costOfGoodAmount: 0,
  index: 0,
  accountId: null,
};

export const defaultPayment = {
  paymentMode: PaymentMode.CREDIT,
  totalAmount: 0,
  totalDiscount: 0,
  dueDate: dayjs(),
};

export const defaultFormData = {
  issueDate: dayjs(),
  currency: "PKR",
  invoiceDiscount: 0,
};
