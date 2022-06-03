import styled from 'styled-components';
import { FC, useState } from 'react';
import { CommonModal } from '../../../components';
import { ColumnsType } from 'antd/lib/table';
import { G } from '@react-pdf/renderer';
import { EditableSelect } from '../../../components/Editable';
import { Option } from '../../../components/CommonSelect';
import { EditableTable } from '@invyce/editable-table';
import { Heading } from '@invyce/shared/components';
import Paragraph from 'antd/lib/typography/Paragraph';
import { Icon } from '@iconify/react';
import questionIcon from '@iconify/icons-fe/question';
import { Tooltip } from 'antd';

interface IProps {
  visibility: boolean;
  onCancel: () => void;
  compareKeys: any[];
  documentKeys: any[];
}
export const CompareDataModal: FC<IProps> = ({
  visibility,
  onCancel,
  compareKeys,
  documentKeys,
}) => {
  const [compareData, setCompareData] = useState<any>({});

  console.log(compareData, 'check compare data');

  if (visibility && compareKeys?.length && documentKeys?.length) {
    const columns: ColumnsType<any> = [
      {
        title: 'Columns',
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
        title: 'Compare',
        dataIndex: '',
        key: 'compareData',
        render: (text: string, record: any) => {
          return (
            <EditableSelect
              style={{ width: '100%' }}
              onChange={(value) => {
                setCompareData((prevState) => {
                  const state = { ...prevState };
                  state[value?.value] = record.keyName;
                  return state;
                });
              }}
              showSearch
              placeholder="Select Header"
              optionFilterProp="children"
            >
              {documentKeys.map((key: any) => {
                return <Option value={key}>{key}</Option>;
              })}
            </EditableSelect>
          );
        },
      },
    ];

    return (
      <CommonModal
        onCancel={onCancel}
        visible={visibility}
        footer={false}
        width={800}
      >
        <CompareDataModalWrapper>
          <Heading type="form">Compare Data Segments</Heading>
          <Paragraph className="mt-20">
            We need your help to understand which Header attributes refers to
            which property by selecting your header attribute to the following
            table sections.{' '}
          </Paragraph>
          <EditableTable
            columns={columns as any}
            data={compareKeys}
            dragable={() => null}
          />
        </CompareDataModalWrapper>
      </CommonModal>
    );
  } else return null;
};

export const CompareDataModalWrapper = styled.div``;
