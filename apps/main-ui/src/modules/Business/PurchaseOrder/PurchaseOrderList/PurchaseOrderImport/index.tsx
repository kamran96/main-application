import React, { FC } from 'react';
import { useGlobalContext } from '../../../../../hooks/globalContext/globalContext';
import { ButtonTag } from '@components';

export const PurchaseOrderImport: FC = (props) => {
  const { setPurchaseOrder } = useGlobalContext();
  return (
    <ButtonTag
      onClick={() => {
        setPurchaseOrder(true, 'purchaseOrder');
      }}
      className="mr-10"
      title="Import"
      size="middle"
    />
  );
};
