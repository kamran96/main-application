import { FC, useState, useEffect } from 'react';
import { ColumnsType } from 'antd/lib/table';
import { G } from '@react-pdf/renderer';
import { Option, EditableSelect } from '@components';
import { EditableTable } from '@invyce/editable-table';
import { Heading } from '@invyce/shared/components';
import Paragraph from 'antd/lib/typography/Paragraph';
import { Icon } from '@iconify/react';
import questionIcon from '@iconify/icons-fe/question';
import { Button, Tooltip } from 'antd';
import deleteIcon from '@iconify/icons-carbon/delete';
import styled from 'styled-components';
import { ITheme, IThemeProps } from '@invyce/shared/invyce-theme';

const a = [
  {
    label: 'Name',
    keyName: 'name',
    description: 'Please select a field which is related to Name of Item',
  },
  {
    label: 'Code',
    keyName: 'code',
    description: 'Please select a field which is related to code of Item',
  },
  {
    label: 'Item Type',
    keyName: 'itemType',
    description: 'Please select a field which is related to itemType of Items',
  },
  {
    label: 'Opening Stock',
    keyName: 'openingStock',
    description:
      'Please select a field which is related to Opening Stock of Items',
  },
  {
    label: 'Bar Code',
    keyName: 'barcode',
    description: 'Please select a field which is related to Bar Code of Items',
  },
  {
    label: 'Description',
    keyName: 'description',
    description:
      'Please select a field which is related to description of Items',
  },
  {
    label: 'Minimum Stock',
    keyName: 'minimumStock',
    description:
      'Please select a field which is related to Minimum Stock of Items',
  },
  {
    label: 'Purchase Price',
    keyName: 'purchasePrice',
    description:
      'Please select a field which is related to Purchase Price of Items',
  },
  {
    label: 'Sale Price',
    keyName: 'salePrice',
    description: 'Please select a field which is related to salePrice of Items',
  },
  {
    label: 'Tax',
    keyName: 'tax',
    description: 'Please select a field which is related to tax of Items',
  },
  {
    label: 'discount',
    keyName: 'Discount',
    description:
      'Please select a field which is related to Discount of Contact',
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
  compareKeys = a,
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
    // {
    //   title: 'Action',
    //   dataIndex: 'action',
    //   key: 'action',
    //   render: () => {
    //     return <Icon className="Icon" icon={deleteIcon} />;
    //   },
    // },
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
    align-items: center;
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
