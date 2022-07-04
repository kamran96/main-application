import { ColumnType } from 'antd/lib/list';
import { ColumnsType } from 'antd/lib/table';
import React, { FC, useState } from 'react';
import { CommonTable } from '../../../../components/Table';
import { Heading } from '../../../../components/Heading';
import { WrapperTaxList } from './styles';
import { ButtonTag } from '../../../../components/ButtonTags';
import editSolid from '@iconify-icons/clarity/edit-solid';
import deleteIcon from '@iconify/icons-carbon/delete';
import { TaxEditorWidget } from '../TaxEditorWidget';
import Button from 'antd/es/button';
import { useQuery } from 'react-query';
import { getTaxesListAPI } from '../../../../api';
import { ITaxResponse } from '../../../../modal/tax';
import { useEffect } from 'react';
export const TaxList: FC = () => {
  /* COMPONENT STATE */
  const [{ visibility, id }, setTaxForm] = useState({
    visibility: false,
    id: null,
  });
  const [taxListConfig, setTaxListConfig] = useState({
    page: 1,
    pageSize: 20,
    status: 1,
  });

  const [{ result, pagination }, setTaxRateResult] = useState<ITaxResponse>({
    result: [],
    pagination: {},
  });

  const { page, pageSize, status } = taxListConfig;

  const { data, isLoading } = useQuery(
    [
      `tax_rate?page=${page}&pageSize=${pageSize}&status=&{status}`,
      page,
      pageSize,
      status,
    ],
    getTaxesListAPI
  );

  useEffect(() => {
    if (data?.data?.result) {
      setTaxRateResult(data?.data);
    }
  }, [data]);

  const columns: ColumnsType<any> = [
    {
      title: 'Name',
      dataIndex: 'title',
      key: 'name',
      render: (data, row) => {
        return (
          <Button
            onClick={() => setTaxForm({ visibility: true, id: row?.id })}
            type="link"
          >
            {data ? data : ''}
          </Button>
        );
      },
    },
    {
      title: 'Tax Rates',
      dataIndex: 'taxRates',
      key: 'taxRates',
    },
  ];

  const commonTopbar = () => {
    return (
      <div className="flex alignCenter pv-10">
        <ButtonTag disabled title="Edit" icon={editSolid} size={'middle'} />
        <ButtonTag
          disabled
          className="mr-10"
          title="Delete"
          icon={deleteIcon}
          size={'middle'}
        />
      </div>
    );
  };

  return (
    <WrapperTaxList>
      <div className="flex justifySpaceBetween">
        <div>
          <Heading type="table">Tax Rates</Heading>
          <p>Manage Tax Rates</p>
        </div>
        <Button
          onClick={() => setTaxForm({ visibility: true, id: null })}
          type="primary"
          size="middle"
        >
          Add Tax
        </Button>
      </div>
      <CommonTable
        customTopbar={commonTopbar()}
        loading={isLoading}
        columns={columns}
        data={result}
        enableRowSelection
      />
      <TaxEditorWidget
        visibility={visibility}
        id={id}
        setVisibility={(visibility) => setTaxForm({ visibility, id: null })}
      />
    </WrapperTaxList>
  );
};
