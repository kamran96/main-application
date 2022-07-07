import { CommonTable } from '../../../components/Table';
import React, { FC, useEffect, useState } from 'react';
import { Button, Select } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useMutation, useQuery } from 'react-query';
import { CsvImportAPi, getAllAccounts } from '../../../api';
import { IAccountsResult } from '@invyce/shared/types';

const { Option } = Select;

interface IProps {
  fileExtractedData: any;
  setStep: (payload: any) => void;
  contactKeysResponse: any;
  compareData: any;
  fileData: any;
}

export const CompareDataTable: FC<IProps> = ({
  fileExtractedData,
  setStep,
  contactKeysResponse,
  compareData,
  fileData,
}) => {
  const { mutate: uploadCsv, isLoading: uploadingCsv } =
    useMutation(CsvImportAPi);

  const [_fileData, _setFileData] = useState([]);

  // useEffect(()=>{

  // },[])

  console.log(fileExtractedData, 'fileExtractedData');

  const { data: AllAccounts } = useQuery(
    [`all-accounts`, 'ALL'],
    getAllAccounts
  );

  const debitedAccounts: IAccountsResult[] =
    (AllAccounts &&
      AllAccounts.data &&
      AllAccounts.data.result &&
      AllAccounts.data.result.filter(
        (acc) => acc?.secondaryAccount?.primaryAccount?.name === 'asset'
      )) ||
    [];
  const creditedAccounts: IAccountsResult[] =
    (AllAccounts &&
      AllAccounts.data &&
      AllAccounts.data.result &&
      AllAccounts.data.result.filter(
        (acc) =>
          acc?.secondaryAccount?.primaryAccount?.name === 'liability' ||
          acc?.secondaryAccount?.primaryAccount?.name === 'equity' ||
          acc?.secondaryAccount?.primaryAccount?.name === 'revenue'
      )) ||
    [];

  const onConfirmUpload = async () => {
    const formData = new FormData();
    formData.append('file', fileData);
    formData.append('compareData', JSON.stringify(compareData));
    formData.append('module', JSON.stringify('contact'));

    await uploadCsv(formData, {
      onSuccess: (data) => {
        console.log(data);
      },
    });
  };

  console.log(contactKeysResponse, 'contact keys');
  const getTitle = (colItem: string) => {
    if (contactKeysResponse?.data) {
      const key = compareData[colItem];
      const [filtered] = contactKeysResponse?.data?.filter(
        (ckey) => ckey?.keyName === key
      );
      return filtered ? filtered?.label : colItem;
    } else {
      return colItem;
    }
  };
  const columns: ColumnsType<any> =
    fileExtractedData?.length > 0
      ? Object.keys(compareData)
          .map((item) => {
            return {
              title: getTitle(item),
              dataIndex: item,
              key: item,
            };
          })
          .concat([
            {
              title: 'Debit Accounts',
              dataIndex: '',
              key: 'Debit Account',
              render: () => (
                <Select
                  size="large"
                  showSearch
                  style={{ width: '100%' }}
                  placeholder="Select Item"
                  optionFilterProp="children"
                  // onChange={() => console.log('hello')}
                >
                  {debitedAccounts.length &&
                    debitedAccounts.map((acc: IAccountsResult, index) => {
                      return (
                        <Option key={index} value={acc.id}>
                          {acc.name}
                        </Option>
                      );
                    })}
                </Select>
              ),
            },
            {
              title: 'Credit Accounts',
              dataIndex: '',
              key: 'Debit Account',
              render: () => (
                <Select
                  size="large"
                  showSearch
                  style={{ width: '100%' }}
                  placeholder="Select Item"
                  optionFilterProp="children"
                >
                  {creditedAccounts.length &&
                    creditedAccounts.map((acc: IAccountsResult, index) => {
                      return (
                        <Option key={index} value={acc.id}>
                          {acc.name}
                        </Option>
                      );
                    })}
                </Select>
              ),
            },
          ] as any)
      : [];

  return (
    <div className="TableWrapper">
      <CommonTable
        pagination={false}
        columns={columns}
        data={fileExtractedData}
      />
      <div className="CnfrmBtn">
        <Button className="btn" onClick={() => setStep(2)}>
          Back
        </Button>
        <Button
          type="primary"
          className="btn"
          onClick={onConfirmUpload}
          loading={uploadingCsv}
        >
          Proceed
        </Button>
      </div>
    </div>
  );
};
