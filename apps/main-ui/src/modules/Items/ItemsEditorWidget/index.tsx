/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC } from 'react';
import { CommonModal } from '../../../components';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import { ItemsForm } from './Form';

interface IProps {}

const ItemsEditorWidget: FC<IProps> = () => {
  /* user context API hook */
  const { itemsModalConfig, setItemsModalConfig } = useGlobalContext();

  return (
    <CommonModal
      width={600}
      title="Add Item"
      visible={itemsModalConfig.visibility}
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
export default ItemsEditorWidget;
