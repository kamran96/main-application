/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMemo, memo } from 'react';
import { FC } from 'react';
import { CommonModal } from '../../../components';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import { ItemsForm } from './Form';

interface IProps {
  visibility: boolean;
}
const _itemsEditorWidget: FC<IProps> = ({ visibility }) => {
  /* user context API hook */
  const { setItemsModalConfig } = useGlobalContext();

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

const ItemsEditorWidget = memo(_itemsEditorWidget, (prevProps, nextProps) => {
  return true;
});

export default ItemsEditorWidget;
