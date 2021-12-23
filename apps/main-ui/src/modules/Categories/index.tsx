/* eslint-disable @typescript-eslint/no-unused-vars */
import deleteIcon from '@iconify/icons-carbon/delete';
import editSolid from '@iconify/icons-clarity/edit-solid';
import { Button } from 'antd';
import { FC, useEffect, useState } from 'react';
import { useQueryClient, useMutation, useQuery } from 'react-query';
import { deleteCategoryAPI, getCategoriesAPI } from '../../api';
import { ButtonTag } from '../../components/ButtonTags';
import { ConfirmModal } from '../../components/ConfirmModal';
import { Heading } from '../../components/Heading';
import { Rbac } from '../../components/Rbac';
import { PERMISSIONS } from '../../components/Rbac/permissions';
import { SmartFilter } from '../../components/SmartFilter';
import { CommonTable } from '../../components/Table';
import { useGlobalContext } from '../../hooks/globalContext/globalContext';
import { NOTIFICATIONTYPE } from '../../modal';
import { ICategoriesGetResponse } from '../../modal/categories';
import { ChildCategory } from './ChildCategories';
import { Columns } from './columns';
import { WrapperCategoriesContainer } from './styles';

const CategoriesContainer: FC = () => {
  const queryCache = useQueryClient();
  const [{ result, pagination }, setCategories] =
    useState<ICategoriesGetResponse>({
      result: [],
      pagination: {},
    });

  const { mutate: mutateDeleteCategory, isLoading: isDeletingCategory } =
    useMutation(deleteCategoryAPI);

  const [filterBar, setFilterBar] = useState(false);

  const [confirmModal, setConfirmModal] = useState(false);

  const [selectedRow, setSelectedRow] = useState([]);
  const { setCategoryModalConfig, notificationCallback } = useGlobalContext();
  const [categoryConfig, setCategoryConfig] = useState({
    page: 1,
    page_size: 20,
    query: '',
    sortid: 'id',
  });
  const { page, page_size, query, sortid } = categoryConfig;

  const {
    isLoading,
    data: resolvedData,
    isFetching,
  } = useQuery(
    [
      `categories-list?page_no=${page}&sort=${sortid}&page_size=${page_size}&query=${query}`,
      page,
      sortid,
      page_size,
      query,
    ],
    getCategoriesAPI,
    {
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    if (resolvedData && resolvedData.data && resolvedData.data.result) {
      let { result } = resolvedData.data;
      result = result.map((item, index) => {
        return { ...item, key: item.id };
      });

      setCategories({ ...resolvedData.data, result });
    }
  }, [resolvedData]);

  const k: any = {};

  // k.newMethod();
  const handleDeleteCategory = async () => {
    const payload = {
      ids: [...selectedRow],
      isLeaf: false,
    };

    await mutateDeleteCategory(payload, {
      onSuccess: () => {
        notificationCallback(
          NOTIFICATIONTYPE.SUCCESS,
          `Leaf Category deleted Successfully`
        );

        (queryCache.invalidateQueries as any)((q) =>
          q?.startsWith('categories-list')
        );
        setConfirmModal(false);
        setSelectedRow([]);
      },
      onError: (errr) => {
        console.log(errr);
      },
    });
  };

  const renderCustomTopbar = () => {
    return (
      <div className=" pv-10 flex justifySpaceBetween alignCenter">
        <div className="edit">
          <div className="flex alignCenter ">
            <Rbac permission={PERMISSIONS.CATEGORIES_CREATE}>
              <ButtonTag
                disabled={!selectedRow.length || selectedRow.length > 1}
                onClick={() =>
                  setCategoryModalConfig(true, null, selectedRow[0], false)
                }
                title="Edit"
                icon={editSolid}
                size={'middle'}
              />
            </Rbac>
            <ButtonTag
              className="mr-10"
              disabled={!selectedRow.length}
              onClick={() => setConfirmModal(true)}
              title="Delete"
              icon={deleteIcon}
              size={'middle'}
            />
            {/* <MoreActions /> */}
          </div>
        </div>

        <SmartFilter
          onClose={() => setFilterBar(false)}
          visible={filterBar}
          formSchema={{}}
        />
      </div>
    );
  };

  const handleRowSelect = (item) => {
    setSelectedRow(item.selectedRowKeys);
  };

  return (
    <WrapperCategoriesContainer>
      <div className="pv-10 flex justifySpaceBetween alignCenter">
        <Heading type="table">Categories Manager</Heading>
        <Button
          onClick={() => setCategoryModalConfig(true)}
          type="primary"
          size="middle"
        >
          Add Category
        </Button>
      </div>
      <CommonTable
        loading={isLoading || isFetching}
        customTopbar={renderCustomTopbar()}
        columns={Columns}
        data={result}
        hasfooter={false}
        pagination={false}
        enableRowSelection
        onSelectRow={handleRowSelect}
        expandable={{
          expandedRowRender: (record, index) => {
            // const childCategories: ITransactionItem[] =
            //   record.transaction_items;
            return <ChildCategory id={record.id} />;
          },
        }}
      />
      <ConfirmModal
        loading={isDeletingCategory}
        visible={confirmModal}
        onCancel={() => setConfirmModal(false)}
        onConfirm={handleDeleteCategory}
        type="delete"
        text="Are you sure want to delete selected Category?"
      />
    </WrapperCategoriesContainer>
  );
};

const CategoriesRoot = () => {
  return <CategoriesContainer />;
};

export default CategoriesRoot;
