import { CommonTable } from '../../../components/Table';
import React, { FC } from 'react';
import { Button, Select } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useMutation, useQuery } from 'react-query';
import { CsvImportAPi, getAllAccounts } from '../../../api';
import { IAccountsResult } from '@invyce/shared/types';

const { Option } = Select;
interface IProps {
  fileExtractedData: any;
  setStep: (payload: any) => void;
  itemKeysResponse: any;
  compareData: any;
  fileData: any;
}

export const CompareDataTable: FC<IProps> = ({
  fileExtractedData,
  setStep,
  itemKeysResponse,
  compareData,
  fileData,
}) => {
  const { mutate: uploadCsv, isLoading: uploadingCsv } =
    useMutation(CsvImportAPi);

  const { data: AllAccounts } = useQuery(
    [`all-accounts`, 'All'],
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
      onSuccess: (data: any) => {
        console.log(data);
      },
    });
  };

  const getTitle = (colItem: string) => {
    if (itemKeysResponse?.data) {
      const key = compareData[colItem];
      const [filtered] = itemKeysResponse?.data?.filter(
        (ckey, cindex) => ckey?.keyName === key
      );
      return filtered ? filtered?.label : colItem;
    } else {
      return colItem;
    }
  };

  console.log(fileExtractedData, 'file extracted data');

  const columns: ColumnsType<any> =
    fileExtractedData?.length > 0
      ? Object.keys(compareData).map((item) => {
          return {
            title: getTitle(item),
            dataIndex: item,
            key: item,
          };
        })
      : [];

  return (
    <div className="TableWrapper">
      <CommonTable columns={columns} data={fileExtractedData} />
      <div className="CnfrmBtn">
        <Button className="btn" onClick={() => setStep(2)}>
          Back
        </Button>
        <Button type="primary" className="btn" onClick={onConfirmUpload}>
          Proceed
        </Button>
      </div>
    </div>
  );
};
