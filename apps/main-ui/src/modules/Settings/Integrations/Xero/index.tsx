import { Button, Checkbox, Modal } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import styled from 'styled-components';
import XeroLogo from '../../../../assets/xero.png';
import { H3, H4, P, Seprator, CommonModal } from '@components';
import {
  XeroCopyModulesAPI,
  XeroIntegrationAPI,
  XeroVerification,
} from '../../../../api';
import { useGlobalContext } from '../../../../hooks/globalContext/globalContext';
import {
  IBaseAPIError,
  ISupportedRoutes,
  NOTIFICATIONTYPE,
} from '@invyce/shared/types';
import { IThemeProps } from '../../../../hooks/useTheme/themeColors';
import { useHistory } from 'react-router-dom';

export const Xero: FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [step, setStep] = useState(1);
  const [importList, setImportList] = useState([]);
  const {
    mutate: mutateIntegration,
    isLoading,
    data,
  } = useMutation(XeroIntegrationAPI);

  const { mutate: muateteCopyModules, isLoading: xeroCopyingModules } =
    useMutation(XeroCopyModulesAPI);

  const {
    mutate: verifyXero,
    data: verify,
    isLoading: verifyLoading,
  } = useMutation(XeroVerification);
  const { notificationCallback } = useGlobalContext();
  const history = useHistory();
  const { location } = history;

  useEffect(() => {
    if (location?.search && location?.search.includes('xero=verified')) {
      const items = JSON?.parse(
        atob(location?.search?.split('?xero=verified&fetchItems=')[1])
      );
      setImportList(() => {
        setModalVisible(true);

        return items?.map((item, index) => {
          return { name: item, fetch: false };
        });
      });
    }
  }, [location]);

  // useEffect(() => {
  //   if (verify?.data?.result) {
  //     const result = verify?.data?.result.modules.map((item, index) => {
  //       return { name: item, fetch: false };
  //     });
  //     setImportList(result);
  //     setModalVisible(true);
  //   }
  // }, [verify]);

  const modalDefault = localStorage.getItem('xero-modal');

  useEffect(() => {
    if (modalDefault && modalDefault !== undefined && modalDefault !== null) {
      setModalVisible(JSON.parse(modalDefault));
    }
  }, [modalDefault]);

  const reset = () => {
    setModalVisible(false);
    setImportList([]);
    setStep(1);
    history?.push(
      `/app${ISupportedRoutes.SETTINGS}${ISupportedRoutes.INTEGRATIONS}`
    );
  };

  const _xeroAuthenticate = async () => {
    await mutateIntegration(null, {
      onSuccess: (data) => {
        if (data?.data?.result) {
          const { result } = data?.data;
          window.location.replace(result);
        }
      },
    });
  };

  const _xeroCopyModules = async () => {
    const payload = {
      modules: [],
    };
    importList?.forEach((item, index) => {
      if (item?.fetch && true) {
        payload?.modules.push(item.name);
      }
    });

    await muateteCopyModules(payload, {
      onSuccess: (data) => {
        reset();
        notificationCallback(NOTIFICATIONTYPE.SUCCESS, 'Xero modules copied');
      },
      onError: (err: IBaseAPIError) => {
        if (err?.response?.data?.message) {
          const { message } = err?.response?.data;
          notificationCallback(NOTIFICATIONTYPE.ERROR, message);
        } else {
          notificationCallback(NOTIFICATIONTYPE.ERROR, 'Something went wrong');
        }
      },
    });
  };

  return (
    <WrapperCard>
      <div className="integration_card">
        <img className="service_logo" src={XeroLogo} alt={'xero logo'} />
        <H4>Xero</H4>
        <div className="description">
          <p className="paragraph">
            Pull contacts, items, balances, transactions, banks and other
            details by couple of clicks.
          </p>
        </div>
        <Button
          loading={verifyLoading || isLoading}
          onClick={_xeroAuthenticate}
          type="default"
          size="middle"
        >
          {verifyLoading ? 'verifying..' : 'Connect'}
        </Button>
      </div>
      <IntegrationModal
        onCancel={reset}
        visible={modalVisible}
        width={499}
        footer={false}
      >
        <WrapperXeroModal step={step}>
          <div className="main-wrapper">
            <div className="step-1">
              <div>
                <div className="flex alignCenter modal_titlehead">
                  <img className="logo" src={XeroLogo} alt="xero logo" />
                  <H3>Select to import files from xero</H3>
                </div>
                <Seprator />

                <div className="list-modules">
                  <ul>
                    <li>
                      <Checkbox
                        onChange={(e) => {
                          setImportList((prev) => {
                            return prev.map((item, index) => {
                              return { ...item, fetch: e.target.checked };
                            });
                          });
                        }}
                      />{' '}
                      All
                    </li>
                    {importList?.map((item, index) => {
                      return (
                        <li>
                          <Checkbox
                            onChange={(e) => {
                              const allItems = [...importList];
                              allItems[index] = {
                                ...allItems[index],
                                fetch: e.target.checked,
                              };
                              setImportList(allItems);
                            }}
                            checked={item?.fetch}
                          />{' '}
                          {item?.name}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
              <div className="xero_authenticate">
                <Button
                  onClick={reset}
                  type="default"
                  size="middle"
                  className="cancel mr-10"
                >
                  Cancel
                </Button>
                <Button
                  loading={xeroCopyingModules}
                  onClick={_xeroCopyModules}
                  type="primary"
                  size="middle"
                  className="import mr-10"
                >
                  Copy Modules
                </Button>
              </div>
            </div>
          </div>
        </WrapperXeroModal>
      </IntegrationModal>
    </WrapperCard>
  );
};

const WrapperCard: any = styled.div`
  .integration_card {
    background: ${(props: IThemeProps) =>
      props?.theme?.colors?.sidebarBg || '#ffff'};
    border-radius: 6px;
    display: flex;

    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    padding: 18px 17px;
    min-height: 270px;
    max-height: 270px;
    align-items: center;
    text-align: center;
    .service_logo {
      width: 60px;
      height: 60px;
    }

    .description p {
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 141.19%;
      /* or 20px */

      text-align: center;

      color: ${(props: IThemeProps) =>
        props?.theme?.colors?.textTd || '#303030'};
      margin: 0;
    }
  }
`;

type DivProps = JSX.IntrinsicElements['div'];

interface WrapperXeroWrapperProps extends DivProps {
  step?: number;
}

const WrapperXeroModal = styled.div<WrapperXeroWrapperProps>`
  overflow: hidden;
  .main-wrapper {
    min-height: 387px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0px;
    transition: 0.6s all ease-in-out;
    margin-left: ${(props: any) =>
      props?.step === 2 ? '-660px' : props?.step === 3 ? '-1320px' : '0'};

    .step-1 {
      /* margin-right: 70px; */
      opacity: ${(props: any) => (props?.step === 1 ? 1 : 0)};
      transition: 0.27s all ease-in-out;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding-bottom: 15px;

      .list-modules {
        ul {
          list-style: none;
          padding: 0;
          li {
            padding: 7px 23px;
            display: flex;
            width: 100%;
            flex-direction: row-reverse;
            justify-content: space-between;
            .ant-checkbox-wrapper {
              display: flex;
              align-items: flex-start;
              flex-direction: row-reverse;
              justify-content: space-between;
              .ant-checkbox-checked .ant-checkbox-inner {
                background-color: #1a497e;
                border-color: #1a497e;
              }
            }
            .ant-checkbox-wrapper:after {
              display: none;
            }
          }
          li:nth-child(even) {
            background: #fbfbfb;
          }
        }
      }
    }

    .modal_titlehead {
      padding: 13px 19px;

      .logo {
        width: 34px;
        height: 34px;
        margin-right: 7px;
      }
    }

    .description {
      margin-top: 20px;
      p {
        font-style: normal;
        font-weight: normal;
        font-size: 24px;
        line-height: 28px;

        color: #000000;
      }
    }

    .xero_authenticate {
      text-align: right;
      margin-top: 86px;
      button.import {
        background: linear-gradient(180deg, #164273 0%, #2f71bb 100%);
      }
    }
  }

  .ant-checkbox-wrapper:after {
    display: none !important;
  }
`;

const IntegrationModal = styled(CommonModal)`
  .ant-modal-body {
    padding: 0;
  }

  .ant-modal-content {
    padding: 0;
  }
`;
