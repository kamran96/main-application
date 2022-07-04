export const difference = (num1: number, num2: number) => {
  return Math.abs(num1 - num2);
};
export const addition = (num1: number, num2: number) => {
  return Math.abs(num1 + num2);
};
export const kValue = (value?: number | string) => {
  if (value >= 1000) {
    let splitedValue =
      typeof value === 'number'
        ? JSON.stringify(value).split('')
        : value.split('');

    let spliceIndex = splitedValue.length - 3;

    splitedValue.splice(spliceIndex, 3);

    return `${splitedValue.join('')}k`;
  } else {
    return value;
  }
};

export const isNumber = (number) => {
  return isNaN(number) === true;
};

export const isString = (value) => {
  return typeof value === 'string' && true;
};

export const updateArray = (array: any[], index: number, values: any) => {
  array[index] = values;
};

export const addRightBar = () => {
  let ele: HTMLElement = document?.querySelector('.content')!;

  if (ele) {
    ele?.classList?.add('rightbar-space-370px');
  }
};
export const removeRightBar = () => {
  let ele: HTMLElement = document?.querySelector('.content')!;

  if (ele) {
    ele?.classList?.remove('rightbar-space-370px');
  }
};
