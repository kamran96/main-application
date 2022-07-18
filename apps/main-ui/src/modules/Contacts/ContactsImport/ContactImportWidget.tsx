import bookHalf from '@iconify/icons-bi/book-half';
import downloadIcon from '@iconify/icons-bi/download';
import { Icon } from '@iconify/react';
import { FC } from 'react';
import { useState } from 'react';
import { WrapperModalContent } from './style';
import { CommonModal } from '../../../components';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import { InvoiceImportManager } from '../../Invoice/InvoiceImportManager';
import { useQuery } from 'react-query';
import { ReactQueryKeys } from '../../../modal';
import { getContactKeysAPI } from '../../../api';
import { CompareDataModal } from './CompareDataModal';
import { Button } from 'antd';
import { CompareDataTable } from './CompareDataTable';
import { downloadCSV } from '../../../utils/downloadCSVFile';

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

export const ContactImportWidget: FC = () => {
  const { contactsImportConfig, setContactsImportConfig } = useGlobalContext();
  const { visibility } = contactsImportConfig;
  const [step, setStep] = useState<number>(1);
  const [fileData, setFileData] = useState<File>();
  const [fileExtractedData, setFileExtractedData] = useState([]);
  const [compareDataModal, setCompareDataModel] = useState<boolean>(false);
  const [compareData, setCompareData] = useState<any>({});

  // API callsback Hooks

  const { data: contactKeysResponse, isLoading: contactKeysLoading } = useQuery(
    [ReactQueryKeys.CONTACTS_KEYS],
    getContactKeysAPI,
    {
      enabled: !!compareDataModal,
    }
  );

  const [state, setState] = useState(data?.xero);

  const onDownloadTemplate = () => {
    const headers = [
      [
        'name',
        'email',
        'contactType',
        'cnic',
        'phoneNumber',
        'cellNumber',
        'faxNumber',
        'skypeName',
        'webLink',
        'creditLimit',
        'creditLimitBlock',
        'salesDiscount',
        'balance',
        'accountNumber',
        'paymentDaysLimit',
        'businessName',
      ],
    ];
    downloadCSV(headers);
  };

  return (
    <CommonModal
      visible={visibility}
      title="Import Contacts"
      width={step === 3 ? 1366 : 800}
      onCancel={() => {
        setContactsImportConfig(false, null);
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
                {/* <Button onClick={onDownloadTemplate} type="link">here</Button> */}
                <a onClick={onDownloadTemplate}>here</a>
              </div>
              <InvoiceImportManager
                headers={`Contact,Email,Company Name,Contact Type,Credit Limit,Credit Block Limit,Balance`.split(
                  ','
                )}
                onLoad={(payload, file) => {
                  setFileData(file);
                  setFileExtractedData(payload);
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
            compareKeys={contactKeysResponse?.data || []}
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
          contactKeysResponse={contactKeysResponse}
          compareData={compareData}
          fileExtractedData={fileExtractedData && fileExtractedData}
          setStep={() => setStep(2)}
          fileData={fileData}
        />
      </WrapperModalContent>
    </CommonModal>
  );
};

export default ContactImportWidget;
