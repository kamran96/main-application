import { List } from 'antd';
import { IThemeProps } from '../../../../hooks/useTheme/themeColors';
import React, { FC } from 'react';
import styled from 'styled-components';
import { CommonModal, Heading, Seprator } from '@components';
import { useGlobalContext } from '../../../../hooks/globalContext/globalContext';

export const ReviewModal: FC = () => {
  const { reviewConfigModal, setreviewConfigModal, Colors } =
    useGlobalContext();
  const { visibility } = reviewConfigModal;

  return (
    <CommonModal
      onCancel={() => setreviewConfigModal(false)}
      visible={visibility}
      footer={false}
    >
      <WrapperReviewModal>
        <Heading>Review Account</Heading>
        <Seprator />
        <List bordered>
          <List.Item className="header">
            <div>Title</div>
            <div>Code</div>
          </List.Item>
          <List.Item>
            <div>Junaid Ahmed</div>
            <div>563</div>
          </List.Item>
          <List.Item>
            <div>Kamran jan</div>
            <div>2349</div>
          </List.Item>
        </List>
      </WrapperReviewModal>
    </CommonModal>
  );
};
export default ReviewModal;
const WrapperReviewModal = styled.div`
  margin-bottom: 128px;
  .header {
    background-color: ${(props: IThemeProps) =>
      props?.theme?.colors?.$Secondary};
    color: ${(props: IThemeProps) => props?.theme?.colors?.$WHITE};
    margin: -1px;
  }
`;
