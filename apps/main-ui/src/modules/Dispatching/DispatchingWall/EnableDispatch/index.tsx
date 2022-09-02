import { Button, Switch } from 'antd';
import { IThemeProps } from '../../../../hooks/useTheme/themeColors';
import React, { FC } from 'react';
import styled from 'styled-components';
import { CommonModal } from '../../../../components';
import { Heading } from '../../../../components/Heading';
import { SelectCard } from '../../../../components/SelectCard';
import { Seprator } from '../../../../components/Seprator';
import { useGlobalContext } from '../../../../hooks/globalContext/globalContext';

export const EnableDispatchModal: FC = () => {
  const { dispatchConfigModal, setDispatchConfigModal } = useGlobalContext();
  const { visibility } = dispatchConfigModal;
  const { setreviewConfigModal } = useGlobalContext();

  return (
    <WrapperEnableDispatch>
      <CommonModal
        onCancel={() => setDispatchConfigModal(false)}
        visible={visibility}
        footer={false}
      >
        <Heading>Bank Branch</Heading>
        <Seprator />
        <ModalBodyWrapper>
          <SelectCard
            label={'Branch Name'}
            description={'Shahra -e - quaid azam'}
            changedValue={() => null}
          />
          <SelectCard
            label={'Branch Name'}
            description={'Shahra -e - quaid azam'}
            changedValue={() => null}
          />
          <SelectCard
            label={'Branch Name'}
            description={'Shahra -e - quaid azam'}
            changedValue={() => null}
          />
          <div className="branchCard">
            <div>
              <p className="further_branches">Future branches</p>
              <p className="dispatch_item">
                All future branches can dispatch items
              </p>
            </div>
            <div className="icon_area">
              <Switch size="small" />
            </div>
          </div>
          <Seprator />

          <div className="flex switch_check">
            <p className="description">Enable amount transaction</p>
            <Switch size="small" />
          </div>
          <div className="flex switch_check">
            <p className="description">Enable invention mode</p>
            <Switch size="small" defaultChecked />
          </div>
          <div className="next_btn">
            <Button
              onClick={() => {
                setreviewConfigModal(true);
                setDispatchConfigModal(false);
              }}
              className="next_color"
            >
              Next
            </Button>
          </div>
        </ModalBodyWrapper>
      </CommonModal>
    </WrapperEnableDispatch>
  );
};

export default EnableDispatchModal;

const WrapperEnableDispatch = styled.div``;

const ModalBodyWrapper = styled.div`
  padding: 18px 0;
  .branchCard {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    margin-top: 30px;
  }
  .further_branches {
    font-style: normal;
    font-weight: normal;
    font-size: 15px;
    line-height: 18px;
    letter-spacing: 0.04em;
    margin: 0;
  }

  .dispatch_item {
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 14px;
    letter-spacing: 0.04em;
    color: #716f6f;
    margin: 0;
  }
  .switch_check {
    margin-top: 20px;
    justify-content: space-between;
    .description {
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 16px;
      letter-spacing: 0.04em;
      margin: 0;
    }
  }
  .next_btn {
    text-align: right;
    margin-top: 20px;
    .next_color {
      background-color: ${(props: IThemeProps) =>
        props?.theme?.colors?.$Secondary};
      color: ${(props: IThemeProps) => props?.theme?.colors?.$WHITE};
    }
  }
`;
