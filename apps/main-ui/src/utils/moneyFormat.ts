import formatMoney from 'accounting-js/lib/formatMoney.js';
import { useGlobalContext } from '../hooks/globalContext/globalContext';
import { ICurrency } from '../modal/organization';

export default function (amount: number | string) {
  const { userDetails } = useGlobalContext();
  const currency: ICurrency = userDetails?.organization?.currency || {
    name: 'United States dollar',
    code: 'USD',
    symbol: '$',
    symbolNative: '$',
    id: null,
  };

  const valueToFormat =
  typeof amount === 'string' ? parseFloat(amount) : amount;

if (valueToFormat < 0) {
  return formatMoney(amount, {
    symbol: currency?.symbolNative,
    format: '%s(%v) ',
  });
} else {
  return formatMoney(amount, {
    symbol: currency?.symbolNative,
    format: '%s%v ',
  });
}
}
