export const CalculatePercentage = (value: number, percentage: number) => {
  return value - (percentage / 100) * value;
};

export const CalculateDiscountPerItem = (value: number, percentage: number) => {
  return (percentage / 100) * value;
};

export const getPriceWithTax = (price: number, taxPercent: number) => {
  return price + (taxPercent / 100) * price;
};

export const checkisPercentage = (value: string) => {
  const splitedData = value && value.split('%');
  if (splitedData.length === 2) {
    return {
      value: splitedData[0],
      isPercentage: true,
    };
  } else {
    return {
      value: value ? value : '0',
      isPercentage: false,
    };
  }
};

export const calculateInvoice = (
  price?: number,
  tax?: string,
  discount?: string
) => {
  const taxV = checkisPercentage(tax);
  const disV = checkisPercentage(discount);

  if (taxV.isPercentage && disV.isPercentage) {
    const withPriceAndDiscount = CalculatePercentage(
      price,
      parseFloat(disV.value)
    );
    const priceWithDisandTax = getPriceWithTax(
      withPriceAndDiscount,
      parseFloat(taxV.value)
    );

    return priceWithDisandTax;
  } else if (taxV.isPercentage && !disV.isPercentage) {
    const withPriceAndDiscount = price - parseFloat(disV.value);
    const priceWithDisandTax = getPriceWithTax(
      withPriceAndDiscount,
      parseFloat(taxV.value)
    );

    return priceWithDisandTax;
  } else if (!taxV.isPercentage && disV.isPercentage) {
    const withPriceAndDiscount = CalculatePercentage(
      price,
      parseFloat(disV.value)
    );
    const priceWithDisandTax = withPriceAndDiscount + parseFloat(taxV.value);

    return priceWithDisandTax;
  } else if (!taxV.isPercentage && !disV.isPercentage) {
    const withPriceAndDiscount = price - parseFloat(disV.value);
    const priceWithDisandTax = withPriceAndDiscount + parseFloat(taxV.value);

    return priceWithDisandTax;
  } else {
    return null;
  }
};

export const totalDiscountInInvoice = (array, key, type) => {
  const discountArray = [];
  Array.isArray(array) &&
    array.length &&
    array.forEach((item) => {
      const keyItem = (item && item[key]) || '0';
      const v = checkisPercentage(keyItem);
      const priceAccessor =
        type === 'POE' ? item.purchasePrice : item.unitPrice;
      if (v.isPercentage) {
        const val = CalculateDiscountPerItem(
          priceAccessor,
          parseFloat(v.value)
        );
        discountArray.push(val * item.quantity);
      } else {
        const val = priceAccessor - priceAccessor + parseFloat(v.value);
        discountArray.push(val * item.quantity);
      }
    });

  return discountArray.length ? discountArray.reduce((a, b) => a + b) : 0;
};

export const getCostofGoodSold = (
  price?: number,
  discount?: any,
  quantity?: number
) => {
  const v = checkisPercentage(discount);

  if (v.isPercentage) {
    return CalculateDiscountPerItem(price, parseFloat(v.value)) * quantity;
  } else if (!v.isPercentage) {
    return (price - quantity) * discount;
  } else {
    return null;
  }
};
