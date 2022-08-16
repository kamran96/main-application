/* eslint-disable react-hooks/exhaustive-deps */
import lineChart from '@iconify-icons/fe/line-chart';
import deleteIcon from '@iconify/icons-carbon/delete';
import editSolid from '@iconify/icons-clarity/edit-solid';
import { Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { plainToClass } from 'class-transformer';
import { FC, useEffect, useMemo, useState } from 'react';
import { useQueryClient, useMutation, useQuery } from 'react-query';
import { deleteItems, getAllCategories, getItemsList } from '../../../api';
import { ButtonTag } from '../../../components/ButtonTags';
import { ConfirmModal } from '../../../components/ConfirmModal';
import { Heading } from '../../../components/Heading';
import { Rbac } from '../../../components/Rbac';
import { PERMISSIONS } from '../../../components/Rbac/permissions';
import { SmartFilter } from '../../../components/SmartFilter';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import { ICategory, NOTIFICATIONTYPE } from '../../../modal';
import {
  IItemsResponse,
  IItemsResult,
  ITemsResult,
  ITEM_TYPE,
} from '../../../modal/items';
import { ISupportedRoutes } from '../../../modal/routing';
import moneyFormat from '../../../utils/moneyFormat';
import { useWindowSize } from '../../../utils/useWindowSize';
import { CommonTable } from './../../../components/Table';
import filterSchema from './filterSchema';
import { PrintColumns, PDFColumns } from './PrintColumns';
import { ItemsListWrapper } from './styles';
import packageIcon from '@iconify-icons/feather/package';
import ItemsImport from '../ItemsImport';
import { ItemsViewContainer } from './ItemDrawerView';

export const ItemsList: FC = () => {
  /* HOOKS */
  const queryCache = useQueryClient();
  const [filterbar, setFilterbar] = useState<boolean>(false);
  const [itemsFilterningSchema, setItemsFilteringSchema] =
    useState(filterSchema);
  const [itemsConfig, setItemsConfig] = useState({
    query: '',
    page: 1,
    sortid: 'id',
    page_size: 20,
  });
  const [sortedInfo, setSortedInfo] = useState(null);
  const { page, sortid, query, page_size } = itemsConfig;
  // const [mutateCheckEmail, resCheckEmail] = useMutation(uploadPdfAPI);

  const [{ pagination, result }, setItemsResponse] = useState<IItemsResponse>({
    pagination: {},
    result: [],
  });

  const __data = useMemo(() => {
    return result;
  }, [result]);
  const [selectedRow, setSelectedRow] = useState([]);
  const [confirmModal, setConfirmModal] = useState<boolean>(false);
  const [showItemDetails, setShowItemsDetails] = useState({
    visibility: false,
    id: null,
  });

  const { mutate: mutateDeleteItems, isLoading: isDeletingItem } =
    useMutation(deleteItems);
  const [width, height] = useWindowSize();
  const [scrollConfig, setScrollConfig] = useState({
    y: `100vh`,
  });

  /* Print Ref */

  /* user manager CONTEXT API */
  const {
    setItemsModalConfig,
    notificationCallback,
    routeHistory,
    setPricingModalConfig,
  } = useGlobalContext();
  const { history } = routeHistory;

  useEffect(() => {
    if (history?.location?.search) {
      let obj = {};
      const queryArr = history.location.search.split('?')[1].split('&');
      queryArr.forEach((item, index) => {
        const split = item.split('=');
        obj = { ...obj, [split[0]]: split[1] };
      });
      setItemsConfig({ ...itemsConfig, ...obj });

      const filterType = history.location.search.split('&');
      const filterIdType = filterType[0];
      const filterOrder = filterType[3]?.split('=')[1];

      if (filterIdType?.includes('-')) {
        const fieldName = filterIdType?.split('=')[1].split('-')[1];
        setSortedInfo({
          order: filterOrder,
          columnKey: fieldName,
        });
      } else {
        const fieldName = filterIdType?.split('=')[1];
        setSortedInfo({
          order: filterOrder,
          columnKey: fieldName,
        });
      }
    }
  }, [history, routeHistory?.location?.search]);

  const { data: allCategoriesData } = useQuery(
    [`all-categories`],
    getAllCategories
  );

  const resolvedCategories: ICategory[] =
    (allCategoriesData &&
      allCategoriesData.data &&
      allCategoriesData.data.result) ||
    [];

  useEffect(() => {
    if (resolvedCategories && resolvedCategories.length) {
      const filteringSchema = {
        ...filterSchema,
      };
      setItemsFilteringSchema(filteringSchema);
    }
  }, [resolvedCategories]);

  const pageSize =
    typeof page_size === 'string' ? parseInt(page_size) : page_size;

  const {
    isLoading,
    data: resolvedData,
    isFetching,
  } = useQuery([`items-list`, page, sortid, query, pageSize], getItemsList, {
    cacheTime: Infinity,
    keepPreviousData: true,
  });

  const handleItemsConfig = (pagination, filters, sorter: any, extra) => {
    if (sorter.order === undefined) {
      setItemsConfig({
        ...itemsConfig,
        sortid: 'id',
        page: pagination.current,
        page_size: pagination.pageSize,
      });

      history.push(
        `/app${ISupportedRoutes.ITEMS}?sortid=${sortid}&page=${pagination.current}&page_size=${pagination.pageSize}&query=${query}`
      );
    } else {
      if (sorter?.order === 'ascend') {
        const userData = [...result].sort((a, b) => {
          if (a[sorter?.field] > b[sorter?.field]) {
            return 1;
          } else {
            return -1;
          }
        });
        setSortedInfo({
          order: sorter.order,
          columnKey: sorter.columnKey,
        });
        setItemsConfig((prev) => ({ ...prev, result: userData }));
      } else {
        const userData = [...result].sort((a, b) => {
          if (a[sorter?.field] < b[sorter?.field]) {
            return 1;
          } else {
            return -1;
          }
        });
        setSortedInfo({
          order: sorter.order,
          columnKey: sorter.columnKey,
        });
        setItemsConfig((prev) => ({ ...prev, result: userData }));
      }

      history.push(
        `/app${ISupportedRoutes.ITEMS}?sortid=${
          sorter && sorter.order === 'descend'
            ? `-${sorter.field}`
            : sorter.field
        }&page=${pagination.current}&page_size=${pagination.pageSize}&filter=${
          sorter.order
        }&query=${query}`
      );

      setItemsConfig({
        ...itemsConfig,
        sortid: sorter.order === 'descend' ? `-${sorter.field}` : sorter.field,
      });
    }
  };

  useEffect(() => {
    if (resolvedData && resolvedData.data && resolvedData.data.result) {
      const response: IItemsResponse = resolvedData.data;
      const result: IItemsResult[] | any = [];
      // response.result.forEach((item) => {
      //   result.push({ ...item, key: item.id });
      // });

      response.result.forEach((item: IItemsResult) => {
        const categoryName = item?.category?.title || '';
        let prices = item?.price;
        prices = { ...prices, priceId: prices?.id };
        delete prices?.id;
        const items = plainToClass(ITemsResult, item);

        const obj = Object.assign(items, prices);

        result.push({
          ...obj,
          categoryName,
          key: item.id,
          showStock: items.getStock(),
        });
      });

      setItemsResponse({ ...response, result });
    }
  }, [resolvedData]);

  const handleDelete = async () => {
    const payload = {
      ids: [...selectedRow],
    };
    try {
      await mutateDeleteItems(payload, {
        onSuccess: () => {
          notificationCallback(
            NOTIFICATIONTYPE.SUCCESS,
            'Item Deleted Successfully'
          );
          ['all-items', 'items-list'].forEach((key) => {
            (queryCache.invalidateQueries as any)((q) => q?.startsWith(key));
          });
          setConfirmModal(false);
        },
      });
    } catch (error) {
      notificationCallback(NOTIFICATIONTYPE.ERROR, 'Error');
    }
  };

  const columns: ColumnsType<IItemsResult> = [
    {
      title: '#',
      dataIndex: '',
      width: 60,
      render: (item, row, index) => {
        return index + 1;
      },
    },
    {
      title: 'Item Name',
      dataIndex: 'name',
      width: 300,
      key: 'name',
      sorter: true,
      sortOrder: sortedInfo?.columnKey === 'name' && sortedInfo?.order,
      render: (data, row, index) => {
        return (
          <div
            onClick={() =>
              setShowItemsDetails({ visibility: true, id: row?.id })
            }
            style={{ color: '#2395E7', cursor: 'pointer' }}
          >
            {data}
          </div>
        );
      },
    },
    // {
    //   title: 'Category',
    //   dataIndex: 'categoryName',
    //   key: 'categoryName',
    //   render: (data, row, index) => data,
    // },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      sorter: true,
      sortOrder: sortedInfo?.columnKey === 'code' && sortedInfo?.order,
    },
    {
      title: 'Purchase Price',
      dataIndex: 'purchasePrice',
      key: 'purchasePrice',
      sorter: true,
      sortOrder: sortedInfo?.columnKey === 'purchasePrice' && sortedInfo?.order,
      render: (price, row, index) => {
        return (price && moneyFormat(price)) || '-';
      },
    },
    {
      title: 'Sale Price',
      dataIndex: 'salePrice',
      key: 'salePrice',
      sorter: true,
      sortOrder: sortedInfo?.columnKey === 'salePrice' && sortedInfo?.order,
      render: (price, row, index) => {
        return (price && moneyFormat(price)) || '-';
      },
    },
    {
      title: 'Item Type',
      dataIndex: 'itemType',
      key: 'itemType',
      sorter: true,
      sortOrder: sortedInfo?.columnKey === 'itemType' && sortedInfo?.order,
      render: (data, row, index) => {
        return (
          <div>
            {data === ITEM_TYPE.PRODUCT
              ? 'Product'
              : data === ITEM_TYPE.SERVICE
              ? 'Service'
              : '-'}
          </div>
        );
      },
    },
    {
      title: 'Stock',
      dataIndex: 'showStock',
      sorter: true,
      sortOrder: sortedInfo?.columnKey === 'showStock' && sortedInfo?.order,
      render: (data, row, index) => {
        return data ? data : '0';
      },
    },

    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      sortOrder: sortedInfo?.columnKey === 'purchasePrice' && sortedInfo?.order,
      render: (status) => {
        return status === 1 ? 'Active' : 'Deactive';
      },
    },
  ];

  const onSelectedRow = (item) => {
    setSelectedRow(item);
  };

  const renderTopbarRightPannel = () => {
    return (
      <div className="flex alignCenter justifySpaceBetween">
        <ItemsImport />
        {/* <ButtonTag
          // className="mr-10"
          // disabled={!selectedRow.length || selectedRow.length > 1}
          onClick={() =>
            history?.push(`/app${ISupportedRoutes?.INVENTORY_MANAGEMENT}`)
          }
          title="Manage Inventory"
          icon={packageIcon}
          size="middle"
        /> */}
        <SmartFilter
          onFilter={(encode) => {
            const route = `/app/items?sortid=${sortid}&page=1&page_size=20&query=${encode}`;
            history.push(route);
            setItemsConfig({ ...itemsConfig, query: encode });
          }}
          onClose={() => setFilterbar(false)}
          visible={filterbar}
          formSchema={itemsFilterningSchema}
        />
      </div>
    );
  };

  const renderCustomTopbar = () => {
    return (
      <div className="custom_topbar">
        <div className="edit">
          <div className="flex alignCenter ">
            <Rbac permission={PERMISSIONS.ITEMS_CREATE}>
              <ButtonTag
                className="mr-10"
                disabled={!selectedRow.length || selectedRow.length > 1}
                onClick={() => setItemsModalConfig(true, selectedRow[0])}
                title="Edit"
                icon={editSolid}
                size="middle"
              />
            </Rbac>
            <Rbac permission={PERMISSIONS.ITEMS_CREATE}>
              <ButtonTag
                className="mr-10"
                disabled={!selectedRow.length}
                onClick={() =>
                  setPricingModalConfig(true, {
                    id: selectedRow,
                    action: 'UPDATE',
                  })
                }
                title="Update Pricing"
                icon={lineChart}
                size="middle"
              />
            </Rbac>
            <Rbac permission={PERMISSIONS.ITEMS_DELETE}>
              <ButtonTag
                className="mr-10"
                disabled={!selectedRow.length}
                onClick={() => setConfirmModal(true)}
                title="Delete"
                icon={deleteIcon}
                size="middle"
              />
            </Rbac>
            {/* <Rbac permission={PERMISSIONS.ITEMS_DELETE}> */}
            {/* <DuplicateModal
              itemsData={copyItemsList()}
              disabled={!selectedRow.length}
            /> */}
            {/* </Rbac> */}
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (width < 1300) {
      setScrollConfig((prev) => {
        return { ...prev, x: true };
      });
    } else {
      setScrollConfig({ y: '100vh' });
    }
  }, [width]);

  const printCols = useMemo(() => {
    return PrintColumns;
  }, []);

  return (
    <ItemsListWrapper>
      <div className="_disable_print">
        <div className="flex alignCenter justifySpaceBetween mb-10">
          <Heading type="table">Items</Heading>
          <div className="_disable_print">
            <Rbac permission={PERMISSIONS.ITEMS_CREATE}>
              <Button
                onClick={() => setItemsModalConfig(true)}
                type="primary"
                size={'middle'}
              >
                Add Item
              </Button>
            </Rbac>
          </div>
        </div>
        <CommonTable
          className="customized-table"
          rowKey={(record) => record.id}
          key={'table1'}
          pdfExportable={{
            columns: PDFColumns,
          }}
          exportable
          printColumns={printCols}
          printTitle={'Items List'}
          customTopbar={renderCustomTopbar()}
          topbarRightPannel={renderTopbarRightPannel()}
          hasPrint
          loading={isLoading}
          data={__data}
          columns={columns}
          onChange={handleItemsConfig}
          pagination={{
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100', '150'],
            pageSize: pagination && pagination.page_size,
            position: ['bottomRight'],
            current: pagination.page_no,
            total: pagination && pagination.total,
          }}
          totalItems={pagination && pagination.total}
          hasfooter={true}
          rowSelection={{ onChange: onSelectedRow }}
          enableRowSelection
        />
        {showItemDetails && (
          <ItemsViewContainer
            showItemDetails={showItemDetails}
            setShowItemsDetails={setShowItemsDetails}
          />
        )}
        <ConfirmModal
          loading={isDeletingItem}
          visible={confirmModal}
          onCancel={() => setConfirmModal(false)}
          onConfirm={handleDelete}
          type="delete"
          text="Are you sure want to delete selected Item?"
        />
      </div>
    </ItemsListWrapper>
  );
};
