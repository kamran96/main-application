/* eslint-disable react-hooks/exhaustive-deps */
import { FC } from 'react';
import { CommonModal } from '../../../components';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import { PaymentsForm } from './form';

export const PaymentsEditorWidget: FC = () => {
  const { paymentsModalConfig, setPaymentsModalConfig } = useGlobalContext();

  return (
    <CommonModal
      visible={paymentsModalConfig.visibility}
      onCancel={() => setPaymentsModalConfig(false)}
      width={'1020px'}
      footer={false}
      title="Payments"
    >
      <PaymentsForm />
    </CommonModal>
  );
};
export default PaymentsEditorWidget;
