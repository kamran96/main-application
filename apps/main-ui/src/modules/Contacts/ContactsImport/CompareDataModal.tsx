import styled from 'styled-components';
import { FC, useState, useEffect } from 'react';
import { ColumnsType } from 'antd/lib/table';
import { G } from '@react-pdf/renderer';
import { Option, CommonModal, EditableSelect } from '@components';
import { EditableTable } from '@invyce/editable-table';
import { Heading } from '@invyce/shared/components';
import Paragraph from 'antd/lib/typography/Paragraph';
import { Icon } from '@iconify/react';
import questionIcon from '@iconify/icons-fe/question';
import { Button, Tooltip } from 'antd';
import deleteIcon from '@iconify/icons-carbon/delete';
import { ITheme, IThemeProps } from '@invyce/shared/invyce-theme';

const a = [
  {
    label: 'Account Number',
    keyName: 'accountNumber',
    description:
      'Please select a field which is related to Account Number of Contact',
  },
  {
    label: 'Payment Days Limit',
    keyName: 'paymentDaysLimit',
    description:
      'Please select a field which is related to Payment Days Limit of Contact',
  },
  {
    label: 'Balance',
    keyName: 'balance',
    description: 'Please select a field which is related to Balance of Contact',
  },
  {
    label: 'Sales Discount',
    keyName: 'salesDiscount',
    description:
      'Please select a field which is related to Sales Discount of Contact',
  },
  {
    label: 'Credit Limit Block',
    keyName: 'creditLimitBlock',
    description:
      'Please select a field which is related to Credit Limit Block of Contact',
  },
  {
    label: 'Credit Limit',
    keyName: 'creditLimit',
    description:
      'Please select a field which is related to Credit Limit of Contact',
  },
  {
    label: 'Web Link',
    keyName: 'webLink',
    description:
      'Please select a field which is related to Website Link of Contact',
  },
  {
    label: 'Skype Name',
    keyName: 'skypeName',
    description:
      'Please select a field which is related to Skype Name of Contact',
  },
  {
    label: 'Fax Number',
    keyName: 'faxNumber',
    description:
      'Please select a field which is related to Fax Number of Contact',
  },
  {
    label: 'Cell Number',
    keyName: 'cellNumber',
    description:
      'Please select a field which is related to Cell Number of Contact',
  },
  {
    label: 'Phone Number',
    keyName: 'phoneNumber',
    description:
      'Please select a field which is related to Phone Number of Contact',
  },
  {
    label: 'Cnic',
    keyName: 'cnic',
    description:
      'Please select a field which is related to National Identity of Contact',
  },
  {
    label: 'Business Name',
    keyName: 'businessName',
    description:
      'Please select a field which is related to Business Name of Contact',
  },
  {
    label: 'Contact Type',
    keyName: 'contactType',
    description: 'Please select a field which is related to Contact Type',
  },
  {
    label: 'Email',
    keyName: 'email',
    description: 'Please select a field which is related to Email of Contact',
  },
  {
    label: 'Name',
    keyName: 'name',
    description: 'Please select a field which is related to Name of Contact',
  },
];

interface IProps {
  visibility: boolean;
  onCancel: () => void;
  compareKeys?: any[];
  documentKeys: any[];
  OnConfrm: (payload: any) => void;
}
export const CompareDataModal: FC<IProps> = ({
  visibility,
  onCancel,
  compareKeys,
  documentKeys,
  OnConfrm,
}) => {
  const [compareData, setCompareData] = useState<any>({});

  const unUsedDocumentKeys = documentKeys.filter(
    (key) => !Object.keys(compareData).includes(key)
  );

  useEffect(() => {
    if (documentKeys?.length && compareKeys?.length) {
      const _compareData = {};
      const accessors: string[] = compareKeys.map((i) => i.keyName);
      accessors.forEach((i, index) => {
        if (documentKeys.includes(i)) {
          _compareData[i] = i;
        }
      });

      setCompareData(_compareData);
    }
  }, [documentKeys, compareKeys]);

  const columns: ColumnsType<any> = [
    {
      title: 'Fields from Database',
      dataIndex: 'label',
      key: 'label',
      render: (data, row, index) => {
        return (
          <div className="flex justifySpaceBetween alignCenter">
            <span>{data}</span>
            <Tooltip placement="topRight" title={row?.description}>
              <Icon style={{ width: 20, height: 20 }} icon={questionIcon} />
            </Tooltip>
          </div>
        );
      },
    },

    {
      title: 'Your Headers from file',
      dataIndex: '',
      key: 'compareData',
      render: (text: string, record: any, index: any) => {
        return (
          <EditableSelect
            value={
              Object.keys(compareData).includes(record?.keyName)
                ? record.keyName
                : null
            }
            allowClear
            style={{ width: '100%' }}
            onChange={(value) => {
              if (!value) {
                const stateValue = Object.values(compareData);
                const stateKeys = Object?.keys(compareData);
                const indexed = stateValue?.findIndex(
                  (i) => i === record?.keyName
                );
                if (indexed > -1) {
                  setCompareData((prevState) => {
                    const state = { ...prevState };

                    delete state[stateKeys[indexed]];

                    return state;
                  });
                }
              } else {
                setCompareData((prevState) => {
                  const state = { ...prevState };
                  const keyExistingIndex = Object.values(state).findIndex(
                    (val) => val === record.keyName
                  );
                  if (keyExistingIndex > -1) {
                    delete state[Object.keys(state)[keyExistingIndex]];
                  }

                  state[value?.value] = record.keyName;
                  return state;
                });
              }
            }}
            showSearch
            placeholder="Select Header"
            optionFilterProp="children"
          >
            {unUsedDocumentKeys?.map((key: any) => {
              return <Option key={key}>{key}</Option>;
            })}
          </EditableSelect>
        );
      },
    },
  ];

  if (visibility && documentKeys?.length) {
    return (
      <CompareDataModalWrapper>
        <Heading type="form">Compare Data Segments</Heading>
        <Paragraph className="mt-20">
          We need your help to understand which Header attributes refers to
          which property by selecting your header attribute to the following
          table sections.{' '}
        </Paragraph>
        <EditableTable
          rowClassName={(record, index) => {
            return Object.values(compareData).includes(record?.keyName)
              ? 'SelectedItem'
              : '';
          }}
          isMemo={false}
          customMount={unUsedDocumentKeys?.length}
          columns={columns as any}
          data={compareKeys.sort((a, b) => a.label.localeCompare(b.label))}
          dragable={() => null}
          scrollable={{ offsetY: 500, offsetX: 0 }}
        />
        <div className="CnfrmBtn">
          <Button className="btn" onClick={onCancel}>
            Back
          </Button>
          <Button
            disabled={!Object?.keys(compareData).length}
            type="primary"
            className="btn"
            onClick={() => OnConfrm(compareData)}
          >
            Confirm
          </Button>
        </div>
      </CompareDataModalWrapper>
    );
  } else return null;
};

export const CompareDataModalWrapper = styled.div`
  overflow-y: auto;
  .CnfrmBtn {
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
  }
  .btn {
    margin: 5px 4px;
  }
  .Icon {
    cursor: pointer;
  }
  .SelectedItem td {
    background-color: ${(props: IThemeProps) =>
      props?.theme?.colors?.$PRIMARY} !important;
    color: ${(props: IThemeProps) => props?.theme?.colors?.$WHITE}!important;

    .rendered-text {
      color: ${(props: IThemeProps) => props?.theme?.colors?.$WHITE}!important;
    }
  }
`;

// .ant-table-tbody > tr > td
