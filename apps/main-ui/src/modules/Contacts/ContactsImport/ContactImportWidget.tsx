import bookHalf from '@iconify/icons-bi/book-half';
import downloadIcon from '@iconify/icons-bi/download';
import bxSearchAlt from '@iconify/icons-bx/bx-search-alt';
import { Icon } from '@iconify/react';
import { FC } from 'react';
import React, { useState } from 'react';
import { WrapperModalContent } from "./styles"
import { CommonModal } from '../../../components';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import { InvoiceImportManager } from '../../Invoice/InvoiceImportManager';
import { useMutation, useQuery } from 'react-query';
import { ReactQueryKeys } from '../../../modal';
import { CsvImportAPi, getContactKeysAPI } from '../../../api';
import { CompareDataModal } from './CompareDataModal';
import { Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { CommonTable } from '../../../components/Table';

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

  const { data: contactKeysResponse, isLoading: contactKeysLoading } = useQuery(
    [ReactQueryKeys.CONTACTS_KEYS],
    getContactKeysAPI,
    {
      enabled: !!compareDataModal,
    }
  );

  // const onConfirmUpload = async (compareData) => {
  //   const formData = new FormData();
  //   formData.append('file', fileData);
  //   formData.append('compareData', JSON.stringify(compareData));

  //   await uploadCsv(formData);
  // };
  
  const [state, setState] = useState(data?.xero);

  const getTitle = (colItem: string) => {
    if (contactKeysResponse?.data) {
      const key = compareData[colItem];
      const [filtered] = contactKeysResponse?.data?.filter(
        (ckey, cindex) => ckey?.keyName === key
      );
      return filtered ? filtered?.label : colItem;
    } else {
      return colItem;
    }
  };
  const columns: ColumnsType<any> =
    fileExtractedData?.length > 0
      ? Object.keys(fileExtractedData[0]).map((item) => {
          return {
            title: getTitle(item),
            dataIndex: item,
            key: item,
          };
        })
        .concat([
          {
            title: 'Debit',
            dataIndex: 'debit',
            key: 'debit',
            render: () =><>Test</>
          },
          {
            title: 'Credit',
            dataIndex: 'credit',
            key: 'credit',
            render: () =><>Test</>
          },
        ] as any)
      : [];

  return (
    <CommonModal
      visible={visibility}
      title="Import Contacts"
      width={800}
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
                <a>here</a>
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

        <div className="TableWrapper">
          <CommonTable columns={columns} data={fileExtractedData} />
          <div className="CnfrmBtn">
            <Button className="btn" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button
              type="primary"
              className="btn"
              onClick={() => console.log('proceed')}
            >
              Proceed
            </Button>
          </div>
        </div>
      </WrapperModalContent>
    </CommonModal>
  );
};

export default ContactImportWidget;
