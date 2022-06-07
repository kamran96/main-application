import bookHalf from '@iconify/icons-bi/book-half';
import downloadIcon from '@iconify/icons-bi/download';
import bxSearchAlt from '@iconify/icons-bx/bx-search-alt';
import { Icon } from '@iconify/react';
import { FC } from 'react';
import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

import { CommonModal } from '../../../components';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import { InvoiceImportManager } from '../../Invoice/InvoiceImportManager';
import { useQuery } from 'react-query';
import { ReactQueryKeys } from '../../../modal';
import { getContactKeysAPI } from '../../../api';
import { CompareDataModal } from './CompareDataModal';
import { Button } from 'antd';

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

export const ContactImportWidget: FC = () => {
  const { contactsImportConfig, setContactsImportConfig } = useGlobalContext();
  const { visibility } = contactsImportConfig;
  const [fileData, setFileData] = useState<File>();
  const [fileExtractedData, setFileExtractedData] = useState([]);
  const [compareDataModal, setCompareDataModel] = useState<boolean>(false);

  const { data: contactKeysResponse, isLoading: contactKeysLoading } = useQuery(
    [ReactQueryKeys],
    getContactKeysAPI,
    {
      enabled: !!compareDataModal,
    }
  );

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
  const [state, setState] = useState(data?.xero);
  const [step, setStep] = useState<number>(1);
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
        {
          <div className="CompareModal">
            <CompareDataModal
              documentKeys={
                fileExtractedData?.length
                  ? Object.keys(fileExtractedData?.[0])
                  : []
              }
              // compareKeys={contactKeysResponse?.data || []}
              onCancel={() => {
                setStep(1);
                setCompareDataModel(false);
              }}
              OnConfrm={() => console.log('hello')}
              visibility={compareDataModal}
            />
          </div>
        }
      </WrapperModalContent>
    </CommonModal>
  );
};

export default ContactImportWidget;

type DivProps = JSX.IntrinsicElements['div'];

interface ModalWrapper extends DivProps {
  step?: number;
}

const WrapperModalContent = styled.div<ModalWrapper>`
  display: flex;
  padding-bottom: 1rem;
  overflow: hidden;
  height: 100vh;
  
  .container {
    transition: 0.6s all ease-in-out;
    width: ${(props: any) => (props?.step === 1 ? '100%' : 0)};
    opacity: ${(props: any) => (props?.step === 2 ? 0 : 1)};
    display: flex;
    align-items: center;
    min-height: 0;
    flex-direction: column;
    transform: ${(props: any) =>
      props?.step === 2 ? 'translateX(-100%)' : 'translateX(0)'};
  }

  .CompareModal {
    width: ${(props: any) => (props?.step === 2 ? '100%' : 0)};
    opacity: ${(props: any) => (props?.step === 1 ? 0 : 1)};
    transform: ${(props: any) =>
      props?.step === 1 ? 'translateX(100%)' : 'translateX(0)'};
    transition: 0.4s ease-in-out;
    height: 100vh;
    margin-top: 1rem;
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
