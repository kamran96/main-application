import { FC } from 'react';
import styled from 'styled-components';
import { Drawer } from 'antd';
import { ArrowButton } from '@components';

interface IProps {
  onClose: () => void;
  visible: boolean;
  data: any;
}

export const TransactionDetail: FC<IProps> = ({ onClose, visible, data }) => {
  const renderTitleArea = () => {
    return (
      <div className="flex alignCenter">
        <ArrowButton className="mr-10" onClick={() => null} iconType="left" />
        <ArrowButton onClick={() => null} iconType="right" />
      </div>
    );
  };
  return (
    <Drawer
      title={renderTitleArea()}
      placement="right"
      onClose={onClose}
      visible={visible}
      getContainer={false}
      mask={false}
      maskClosable={false}
      width={1000}
    >
      <WrapperTransactionDetails>transaction details</WrapperTransactionDetails>
    </Drawer>
  );
};

const WrapperTransactionDetails = styled.div``;
