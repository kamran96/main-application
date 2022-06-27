import React, { FC, useState } from 'react';
import { CommonModal } from '../../../components';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import { useMutation, useQuery } from 'react-query';
import { getItemsKeysApi } from '../../../../src/api';
import { ReactQueryKeys } from '../../../../src/modal';
import styled, { keyframes } from 'styled-components';
import { Button } from 'antd';
import Icon from '@iconify/react';
import bookHalf from '@iconify/icons-bi/book-half';
import downloadIcon from '@iconify/icons-bi/download';
import { InvoiceImportManager } from '../../Invoice/InvoiceImportManager';
import { CompareDataModal } from './CompareDataModal';
import { ColumnsType } from 'antd/lib/table';
import { CommonTable } from '../../../components/Table';
import { CompareDataTable } from './CompareDataTable';

interface Idata {
  xero: {
    link: string;
    text: string;
  };
  quickbook: {
    link: string;
    text: string;
  };
}

const data: Idata = {
  xero: {
    link: 'You can download template file',
    text: 'You’re selected file customers.csv. click process to import contacts from xero file format.',
  },
  quickbook: {
    link: 'You can download template file quik',
    text: 'You’re selected file customers.csv. click process to import contacts from quickbook file format.',
  },
};

export const ItemsImportWidget: FC = () => {
  const { itemsImportconfig, setItemsImportconfig } = useGlobalContext();
  const { visibility } = itemsImportconfig;
  const [step, setStep] = useState<number>(1);
  const [fileData, setFileData] = useState<File>();
  const [fileExtractedData, setFileExtractedData] = useState([]);
  const [compareDataModal, setCompareDataModel] = useState<boolean>(false);
  const [compareData, setCompareData] = useState<any>({});

  const { data: itemKeysResponse, isLoading: itemKeysLoading } = useQuery(
    [ReactQueryKeys.ITEMS_KEYS],
    getItemsKeysApi,
    {
      enabled: !!compareDataModal,
    }
  );

  const [state, setState] = useState(data?.xero);

  return (
    <CommonModal
      visible={visibility}
      title="Import Items"
      width={800}
      onCancel={() => {
        setItemsImportconfig(false, null);
      }}
      footer={false}
    >
      <WrapperModalContent step={step}>
        <div className="container">
          <div className="modal-icon">
            <Icon className="Icon" icon={bookHalf} width="80" color="#2395E7" />
          </div>
          <div className="modal-text">
            <Icon className="Icon" icon={downloadIcon} color="#6D7D88" />
            <h2>Import from popular cvs formats</h2>
          </div>
          <div className="modal-btns">
            <button
              className={state?.link === data.xero.link ? 'active' : ''}
              onClick={() => {
                state?.link === data.xero.link
                  ? setState(null)
                  : setState(data.xero);
              }}
            >
              Xero
            </button>
            <button
              className={state?.link === data.quickbook.link ? 'active' : ''}
              onClick={() => {
                state?.link === data.quickbook.link
                  ? setState(null)
                  : setState(data.quickbook);
              }}
            >
              Quickbook
            </button>
          </div>
          {state && (
            <div className="render-content">
              <div className="download">
                <h4>{state.link}</h4>
                &nbsp;
                <a>here</a>
              </div>
              <InvoiceImportManager
                headers={`Item Name,Code,Purchase Price,Sale Price,Item Type,Stock,Status`.split(
                  ','
                )}
                onLoad={(payload, file) => {
                  setFileData(file);
                  setFileExtractedData(payload);
                  console.log(payload, 'payload');
                }}
              />
              <div className="text">
                <p>{state.text}</p>
              </div>
              <Button
                size="large"
                className="btn"
                disabled={!fileData}
                onClick={(e) => {
                  e?.preventDefault();
                  setStep(2);
                  setCompareDataModel(true);
                }}
                type="primary"
              >
                Process File
              </Button>
            </div>
          )}
        </div>

        <div className="CompareModal">
          <CompareDataModal
            documentKeys={
              fileExtractedData?.length
                ? Object.keys(fileExtractedData?.[0])
                : []
            }
            compareKeys={itemKeysResponse?.data || []}
            onCancel={() => {
              setStep(1);
              setCompareDataModel(false);
            }}
            OnConfrm={(data: any) => {
              setStep(3);
              setCompareData(data);
            }}
            visibility={compareDataModal}
          />
        </div>
        <CompareDataTable
          setStep={() => setStep(2)}
          fileExtractedData={fileExtractedData}
          compareData={compareData}
          itemKeysResponse={itemKeysResponse}
        />
      </WrapperModalContent>
    </CommonModal>
  );
};
export default ItemsImportWidget;

type DivProps = JSX.IntrinsicElements['div'];

interface ModalWrapper extends DivProps {
  step?: number;
}

const WrapperModalContent = styled.div<ModalWrapper>`
  display: flex;
  padding-bottom: 1rem;
  overflow: hidden;
  height: 41rem;

  .container {
    transition: 0.6s all ease-in-out;
    width: ${(props: any) => (props?.step === 1 ? '100%' : 0)};
    opacity: ${(props: any) => (props?.step === 1 ? 1 : 0)};
    display: flex;
    align-items: center;
    min-height: 0;
    flex-direction: column;
    transform: ${(props: any) =>
      props?.step === 2 ? 'translateX(-100%)' : 'translateX(0)'};
  }

  .CompareModal {
    width: ${(props: any) => (props?.step === 2 ? '100%' : 0)};
    opacity: ${(props: any) => (props?.step === 2 ? 1 : 0)};
    transform: ${(props: any) =>
      props?.step === 2
        ? 'translateX(0)'
        : props?.step === 3
        ? 'translateX(-100%)'
        : 'translateX(100%)'};
    transition: 0.4s ease-in-out;
    height: 100vh;
  }
  .TableWrapper {
    width: ${(props: any) => (props?.step === 3 ? '100%' : 0)};
    opacity: ${(props: any) => (props?.step === 3 ? 1 : 0)};
    transform: ${(props: any) =>
      props?.step === 3 ? 'translateX(0)' : 'translateX(100%)'};
    transition: 0.4s ease-in-out;

    .CnfrmBtn {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
    .btn {
      margin: 5px 4px;
    }
  }
  .modal-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background: rgba(35, 149, 231, 0.08);
    width: 222px;
    height: 222px;
    margin-bottom: 44px;
  }
  .modal-text {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 17px;
    h2 {
      margin: 0px 0px 0px 10px;
      font: 500 18px/27px Poppins;
      color: #101010;
    }
  }
  .modal-btns {
    margin: 0px 0px 14px 0px;
    button {
      background: #d8d8d8;
      border-radius: 4px;
      font: normal normal normal 18px/24px Poppins;
      text-align: center;
      letter-spacing: 0.04em;
      text-transform: capitalize;
      color: #2d2d2d;
      border: none;
      width: 9.5rem;
      padding: 10px 0px;
      margin: 7px;
      cursor: pointer;
    }
    .active {
      background: #2395e7;
      box-shadow: 0px 6px 30px rgba(3, 3, 3, 0.2);
      color: white;
    }
  }
  .render-content {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    .download {
      margin: 0px 0px 44px 15px;
      display: flex;
      align-items: center;
      h4 {
        font: normal normal normal 13px/19px Poppins;
        color: #000000;
        margin: 0px;
      }
      a {
        cursor: pointer;
      }
    }
    .btn {
      margin-left: 90%;
      margin-top: 2rem;
    }
    .input {
      margin: 0px 0px 8px 15px;
      display: flex;
      align-items: center;
      .Icon {
      }
      .input-label {
        font: 500 15px/22px Poppins;
        color: #2395e7;
        margin-left: 12px;
        cursor: pointer;
        input {
          display: none;
        }
      }
    }
    .text {
      margin: 0px 0px 14px 15px;
      p {
        font: normal 13px/21px Poppins;
        color: #000000;
      }
    }
    button {
      font: normal 14px/24px Poppins;
      text-align: center;
      letter-spacing: 0.02em;
      color: #ffffff;
      width: 8rem;
      border-radius: 4px;
      border: none;
      margin: 0px 0px 0px 15px;
    }
  }
`;
