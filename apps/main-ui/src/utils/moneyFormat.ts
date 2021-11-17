import formatMoney from 'accounting-js/lib/formatMoney.js';
import { useGlobalContext } from '../hooks/globalContext/globalContext';
import { ICurrency } from '../modal/organization';

export default function (amount: number | string) {
  const { userDetails } = useGlobalContext();
  const currency: ICurrency = userDetails?.organization?.currency || {
    name: 'United States dollar',
    code: 'USD',
    symbol: '$',
    id: null,
  };

  return formatMoney(amount, { symbol: currency?.symbol, format: '%v %s' });
}
