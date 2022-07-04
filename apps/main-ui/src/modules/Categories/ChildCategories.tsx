import bxLayerPlus from '@iconify-icons/bx/bx-layer-plus';
import deleteIcon from '@iconify/icons-carbon/delete';
import editSolid from '@iconify/icons-clarity/edit-solid';
import Icon from '@iconify/react';
import { Button, Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import dayjs from 'dayjs';
import { FC, useState } from 'react';
import { useQueryClient, useMutation, useQuery } from 'react-query';
import styled from 'styled-components';

import { deleteCategoryAPI, getChildCategoriesAPI } from '../../api';
import { getAllUsers } from '../../api/users';
import { ButtonTag } from '../../components/ButtonTags';
import { ConfirmModal } from '../../components/ConfirmModal';
import { CommonTable } from '../../components/Table';
import { useGlobalContext } from '../../hooks/globalContext/globalContext';
import { Color, NOTIFICATIONTYPE } from '../../modal';

interface IProps {
  id?: number;
}

export const ChildCategory: FC<IProps> = ({ id }) => {
  const queryCache = useQueryClient();
  const { data, isLoading } = useQuery(
    [`child-categories`, id],
    getChildCategoriesAPI
  );

  const [confirmModal, setConfirmModal] = useState(false);

  const [selectedRow, setSelectedRow] = useState([]);

  const { mutate: mutateDeleteCategory, isLoading: deletingCategory } =
    useMutation(deleteCategoryAPI);

  const { setCategoryModalConfig, setAttributeConfig, notificationCallback } =
    useGlobalContext();

  const result =
    (data &&
      data.data &&
      data.data.result.map((item) => {
        return { ...item, key: item.id };
      })) ||
    [];

  const handleDeleteCategory = async () => {
    const payload = {
      ids: [...selectedRow],
      isLeaf: true,
    };

    try {
      await mutateDeleteCategory(payload, {
        onSuccess: () => {
          notificationCallback(
            NOTIFICATIONTYPE.SUCCESS,
            `Leaf Category deleted Successfully`
          );

          (queryCache.invalidateQueries as any)((q) =>
            q?.startsWith('child-categories')
          );
          setConfirmModal(false);
          setSelectedRow([]);
        },
      });
    } catch (error) {
      if (error && error.response)
        notificationCallback(
          NOTIFICATIONTYPE.ERROR,
          `${error.response.data.message}`
        );
    }
  };

  const columns: ColumnsType<any> = [
    { title: 'Category', dataIndex: 'title', key: 'title' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    {
      title: 'Created Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (data, row, index) => (
        <>{dayjs(data).format('MM/DD/YYYY h:mm A')}</>
      ),
    },
    {
      width: 40,
      render: (data, row, index) => (
        <Tooltip placement="top" title={'Add Attribute'}>
          <i
            className="flex alignCenter justifyCenter attribute-icon pointer"
            onClick={() => setAttributeConfig(true, row)}
          >
            <Icon icon={bxLayerPlus} style={{ fontSize: 24 }} />
          </i>
        </Tooltip>
      ),
    },
  ];

  const renderCustomTopbar = () => {
    return (
      <div className={'add_action flex alignCenter justifySpaceBetween pv-10 '}>
        <div className="edit">
          <div className="flex alignCenter ">
            {true && (
              <>
                <ButtonTag
                  onClick={() =>
                    setCategoryModalConfig(true, id, selectedRow[0], true)
                  }
                  disabled={!selectedRow.length || selectedRow.length > 1}
                  title="Edit"
                  icon={editSolid}
                  size={'middle'}
                />
                <ButtonTag
                  className="mr-10"
                  disabled={!selectedRow.length}
                  onClick={() => setConfirmModal(true)}
                  title="Delete"
                  icon={deleteIcon}
                  size={'middle'}
                />
              </>
            )}
          </div>
        </div>

        <Button
          onClick={() => setCategoryModalConfig(true, id, null, true)}
          type="dashed"
          size="small"
        >
          Add Child
        </Button>
      </div>
    );
  };
  const handleRowSelect = (row) => {
    setSelectedRow(row.selectedRowKeys);
  };
  return (
    <WrapperChildCategory>
      <CommonTable
        loading={isLoading}
        enableRowSelection
        onSelectRow={handleRowSelect}
        customTopbar={renderCustomTopbar()}
        data={result}
        columns={columns}
        pagination={false}
        expandable={{
          expandedRowRender: (record, index) => {
            // const childCategories: ITransactionItem[] =
            //   record.transaction_items;
            return <AttributesTable attributes={record?.attributes || []} />;
          },
        }}
      />

      <ConfirmModal
        loading={deletingCategory}
        visible={confirmModal}
        onCancel={() => setConfirmModal(false)}
        onConfirm={handleDeleteCategory}
        type="delete"
        text="Are you sure want to delete selected Category?"
      />
    </WrapperChildCategory>
  );
};

const AttributesTable = ({ attributes }) => {
  const { data } = useQuery([`all-users`, 'ALL'], getAllUsers);

  const finduserById = (id) => {
    const { result } = data.data;
    const [filtered] = result.filter((item) => item.id === id);
    if (filtered) {
      return filtered.name;
    } else {
      return id;
    }
  };

  const columns: ColumnsType<any> = [
    { title: '#', width: 30, render: (data, row, index) => <>{index + 1}</> },
    { title: 'title', dataIndex: 'title', key: 'title' },
    { title: 'Value Type', dataIndex: 'valueType', key: 'valueType' },
    {
      title: 'Created By',
      dataIndex: 'createdById',
      key: 'createdById',
      render: (data, row, index) => (
        <>{data && data.data && data.data.result && finduserById(data)}</>
      ),
    },
    {
      title: 'Values',
      dataIndex: 'values',
      key: 'values',
      render: (data, row, index) => <>{data ? data : '-'}</>,
    },
  ];

  return (
    <CommonTable
      data={attributes}
      columns={columns}
      pagination={false}
      hasfooter={false}
    />
  );
};

const WrapperChildCategory = styled.div`
  .attribute-icon {
    color: ${Color.$GRAY};
    transition: 0.4s all ease-in-out;
  }
  .attribute-icon:hover {
    color: ${Color.$PRIMARY};
  }
`;
