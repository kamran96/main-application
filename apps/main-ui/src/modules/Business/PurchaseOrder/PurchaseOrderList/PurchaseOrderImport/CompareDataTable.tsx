import { CommonTable } from '@components';
import React, { FC } from 'react';
import { Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';

interface IProps {
  fileExtractedData: any;
  setStep: (payload: any) => void;
  itemKeysResponse: any;
  compareData: any;
}

export const CompareDataTable: FC<IProps> = ({
  fileExtractedData,
  setStep,
  itemKeysResponse,
  compareData,
}) => {
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
  const columns: ColumnsType<any> =
    fileExtractedData?.length > 0
      ? Object.keys(fileExtractedData[0]).map((item) => {
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
        <Button
          type="primary"
          className="btn"
          onClick={() => console.log('proceed')}
        >
          Proceed
        </Button>
      </div>
    </div>
  );
};
