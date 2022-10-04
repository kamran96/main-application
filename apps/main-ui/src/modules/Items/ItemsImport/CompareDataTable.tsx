import { CommonTable } from '@components';
import { FC, useState } from 'react';
import { Button, Select } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { CsvImportAPi, getAllAccounts } from '../../../api';
import {
  IAccountsResult,
  NOTIFICATIONTYPE,
  ReactQueryKeys,
} from '@invyce/shared/types';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';

const { Option } = Select;
interface IProps {
  fileExtractedData: any;
  setStep: (payload: any) => void;
  itemKeysResponse: any;
  compareData: any;
  fileData: any;
  onSuccess: () => void;
}

export const CompareDataTable: FC<IProps> = ({
  fileExtractedData,
  setStep,
  itemKeysResponse,
  compareData,
  fileData,
  onSuccess,
}) => {
  const [targetAccounts, setTargetAccounts] = useState([]);
  const queryCache = useQueryClient();

  const { mutate: uploadCsv, isLoading: uploadingCsv } =
    useMutation(CsvImportAPi);

  const { itemsImportconfig, notificationCallback } = useGlobalContext();

  const { data: resAllAccounts } = useQuery(
    [`all-accounts`, `ALL`],
    getAllAccounts,
    {
      enabled: !!itemsImportconfig.visibility,
    }
  );

  const allLiabilitiesAcc: IAccountsResult[] =
    resAllAccounts?.data.result.filter(
      (item: IAccountsResult) =>
        item?.secondaryAccount?.primaryAccount?.name === 'liability'
    ) || [];

  const onConfirmUpload = async () => {
    const __ = targetAccounts.sort((a, b) => {
      return a.index - b.index;
    });

    const formData = new FormData();
    formData.append('file', fileData);
    formData.append('compareData', JSON.stringify(compareData));
    formData.append('module', JSON.stringify('items'));
    formData.append('targetAccounts', JSON.stringify(__));

    await uploadCsv(formData, {
      onSuccess: (data: any) => {
        notificationCallback(
          NOTIFICATIONTYPE.SUCCESS,
          'Items Imported Successfully'
        );
        onSuccess();
        ['item-id', ReactQueryKeys?.ITEMS_KEYS, 'all-items'].forEach((key) => {
          (queryCache?.invalidateQueries as any)((q) => q?.startsWith(key));
        });
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
              title: 'Accounts',
              dataIndex: '',
              key: 'Account',
              render: (data, row, index) => (
                <Select
                  size="middle"
                  disabled={false}
                  showSearch
                  style={{ width: '100%' }}
                  placeholder="Select Account"
                  optionFilterProp="children"
                  onChange={(value) => {
                    setTargetAccounts((prev) => {
                      const cloneState = [...prev];

                      const indexed = cloneState?.findIndex(
                        (i) => i?.index === index
                      );
                      if (indexed > -1) {
                        cloneState.splice(indexed, 1, {
                          index,
                          value,
                        });
                      } else {
                        cloneState.push({ index, value });
                      }
                      return cloneState;
                    });
                  }}
                >
                  {allLiabilitiesAcc.length &&
                    allLiabilitiesAcc.map(
                      (acc: IAccountsResult, index: number) => {
                        return (
                          <Option key={index} value={acc.id}>
                            {acc.name}
                          </Option>
                        );
                      }
                    )}
                </Select>
              ),
            },
          ] as any)
      : [];

  return (
    <div className="TableWrapper">
      <CommonTable
        columns={columns}
        data={fileExtractedData}
        pagination={false}
      />
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
