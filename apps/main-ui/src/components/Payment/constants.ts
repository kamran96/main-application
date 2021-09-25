import dayjs from "dayjs";


export const defaultSettings = {
  credit: {
    totalAmount: 0,
    totalDiscount: 0,
    dueDate: dayjs(),
    paymentMode: 1,
  },
  full_pay: {
    totalAmount: 0,
    totalDiscount: 0,
    paymentType: 2,
    paymentMode: 2,
  },
  partial_pay: {
    totalAmount: 0,
    totalDiscount: 0,
    dueDate: dayjs(),
    paymentType: 2,
    amount: 0,
    paymentMode: 3,
  },
};
