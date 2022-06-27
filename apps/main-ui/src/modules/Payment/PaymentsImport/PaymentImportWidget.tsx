import React, { FC, useState } from 'react';
import { CommonModal } from '../../../components';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import { useMutation, useQuery } from 'react-query';
import { getPaymentKeysApi } from '../../../../src/api/payment';
import { ReactQueryKeys } from '../../../../src/modal';
import { WrapperModalContent } from './style';
import { Button } from 'antd';
import Icon from '@iconify/react';
import bookHalf from '@iconify/icons-bi/book-half';
import downloadIcon from '@iconify/icons-bi/download';
import { InvoiceImportManager } from '../../Invoice/InvoiceImportManager';
import { CompareDataModal } from './CompareDataModal';
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

const PaymentImportWidget: FC = () => {
  const { paymentsImportConfig, setPaymentsImportConfig } = useGlobalContext();
  const { visibility } = paymentsImportConfig;
  const [step, setStep] = useState<number>(1);
  const [fileData, setFileData] = useState<File>();
  const [fileExtractedData, setFileExtractedData] = useState([]);
  const [compareDataModal, setCompareDataModel] = useState<boolean>(false);
  const [compareData, setCompareData] = useState<any>({});

  const { data: itemKeysResponse, isLoading: itemKeysLoading } = useQuery(
    [ReactQueryKeys.PAYMENTS_KEYS],
    getPaymentKeysApi,
    {
      enabled: !!compareDataModal,
    }
  );

  const [state, setState] = useState(data?.xero);

  return (
    <CommonModal
      visible={visibility}
      title="Import Payments"
      width={800}
      onCancel={() => {
        setPaymentsImportConfig(false, null);
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
export default PaymentImportWidget;
