/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC } from 'react';
import { CommonModal } from '@components';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import { ItemsForm } from './Form';

const ItemsEditorWidget: FC = () => {
  /* user context API hook */
  const { setItemsModalConfig, itemsModalConfig } = useGlobalContext();
  const { visibility } = itemsModalConfig;

  return (
    <CommonModal
      width={600}
      title="Add Item"
      visible={visibility}
      onCancel={() => {
        setItemsModalConfig(false);
      }}
      cancelText={'Cancel'}
      okText={'Add Item'}
      okButtonProps={{ loading: false }}
      footer={false}
    >
      <ItemsForm />
    </CommonModal>
  );
};

// const ItemsEditorWidget = memo(_itemsEditorWidget, (prevProps, nextProps) => {
//   return true;
// });

export default ItemsEditorWidget;
