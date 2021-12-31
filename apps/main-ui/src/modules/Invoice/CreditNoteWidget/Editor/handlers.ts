export const handleCheckValidation = (invoiceItems, Requires, onChange) => {
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
        const indexed =
          (activeItem?.errors?.length && activeItem?.errors?.indexOf(key)) ||
          -1;
        if (indexed !== -1 && activeItem?.errors?.length) {
          activeItem?.errors?.splice(indexed, 1);
        }
      }
    });

    mutatedItems.push(activeItem);
  });

  onChange(mutatedItems);

  return errors;
};

export const RemovedErrors = (errors: any[], key: string | string[]) => {
  if (!errors?.length) {
    errors = [];
  }

  if (Array.isArray(key)) {
    key.forEach((k) => {
      const index = (errors.indexOf(k) && errors?.length) || -1;
      if (index > -1) {
        errors.splice(index, 1);
      }
    });
  } else {
    const index = (errors.indexOf(key) && errors?.length) || -1;
    if (index > -1) {
      errors.splice(index, 1);
    }
  }
  return errors;
};
