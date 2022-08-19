/* eslint-disable react-hooks/exhaustive-deps */
import { ButtonTag } from '../../../components/ButtonTags';
import { FC, useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import {
  deleteInvoiceDrafts,
  getAllContacts,
  getInvoiceListAPI,
} from '../../../api';
import { PurchaseListTopbar } from '../../../components/PurchasesListTopbar';
import { useRbac } from '../../../components/Rbac/useRbac';
import { SmartFilter } from '../../../components/SmartFilter';
import { CommonTable } from '../../../components/Table';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import { IContactTypes } from '../../../modal';
import {
  IInvoiceResponse,
  IInvoiceStatus,
  INVOICETYPE,
  ORDER_TYPE,
} from '../../../modal/invoice';
import { ISupportedRoutes } from '../../../modal/routing';
import { useCols } from './commonCol';
import InvoicesFilterSchema from './InvoicesFilterSchema';

interface IProps {
  columns?: any[];
}
export const ALLInvoiceList: FC<IProps> = ({ columns }) => {
  const [allInvoicesConfig, setAllInvoicesConfig] = useState({
    page: 1,
    query: '',
    sortid: 'id',
    page_size: 10,
  });

  const { rbac } = useRbac(null);

  const { routeHistory, setPaymentsModalConfig } = useGlobalContext();
  const { history } = routeHistory;

  const { PdfCols, _exportableCols } = useCols();

  useEffect(() => {
    if (routeHistory?.history?.location?.search) {
      let obj = {};
      const queryArr = history.location.search.split('?')[1].split('&');
      queryArr.forEach((item, index) => {
        const split = item.split('=');
        obj = { ...obj, [split[0]]: split[1] };
      });

      setAllInvoicesConfig({ ...allInvoicesConfig, ...obj });
    }
  }, [routeHistory]);

  const [invoiceFiltersSchema, setInvoiceFilterSchema] =
    useState(InvoicesFilterSchema);
  const [selectedRow, setSelectedRow] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);

  const [filterBar, setFilterBar] = useState<boolean>(false);

  const [{ result, pagination }, setAllInvoicesRes] =
    useState<IInvoiceResponse>({
      result: [],
      pagination: null,
    });

  const allContacts = useQuery([`all-contacts`, 'ALL'], getAllContacts);

  useEffect(() => {
    if (allContacts?.data?.data?.result) {
      const { result } = allContacts?.data?.data;
      const schema = invoiceFiltersSchema;
      schema.contactId.value = result.filter(
        (item) => item.contactType === IContactTypes.CUSTOMER
      );
      setInvoiceFilterSchema(schema);
    }
  }, [allContacts.data, invoiceFiltersSchema]);

  const { page, query, sortid, page_size } = allInvoicesConfig;

  const {
    isLoading,
    data: resolvedData,
    isFetching,
  } = useQuery(
    [
      `invoices-${ORDER_TYPE.SALE_INVOICE}-${INVOICETYPE.Approved}?page=${page}&query=${query}&sort=${sortid}&page_size=${page_size}`,
      ORDER_TYPE.SALE_INVOICE,
      IInvoiceStatus.approve,
      'ALL',
      page,
      page_size,
      query,
      sortid,
    ],
    getInvoiceListAPI,
    {
      keepPreviousData: true,
    }
  );
  const { mutate: mutateDeleteOrders, isLoading: deletingInvoice } =
    useMutation(deleteInvoiceDrafts);

  const onSelectedRow = (item) => {
    setSelectedRow(item.selectedRowKeys);
    if (item?.selectedRows?.length === 1) {
      console.log('in if');
      setSelectedContact(item?.selectedRows?.[0]?.contactId);
    }
  };

  useEffect(() => {
    if (resolvedData && resolvedData.data && resolvedData.data.result) {
      const { result } = resolvedData.data;
      const newResult = [];
      result.forEach((item, index) => {
        newResult.push({ ...item, key: item.id });
      });

      setAllInvoicesRes({ ...resolvedData.data, result: newResult });
    }
  }, [resolvedData]);

  //handleChangePaginations

  const onChangePagination = (pagination, filters, sorter: any, extra) => {
    if (sorter.order === 'false') {
      setAllInvoicesConfig({
        ...allInvoicesConfig,
        sortid: 'id',
        page: pagination.current,
        page_size: pagination.pageSize,
      });

      const route = `/app${ISupportedRoutes.INVOICES}?tabIndex=all&sortid=${sortid}&page=${pagination.current}&page_size=${pagination.pageSize}&query=${query}`;
      history.push(route);
    } else {
      if (sorter?.order === 'ascend') {
        const userData = [...result].sort((a, b) => {
          if (a[sorter?.field] > b[sorter?.field]) {
            return 1;
          } else {
            return -1;
          }
        });

        setAllInvoicesRes((prev) => ({ ...prev, result: userData }));
      } else {
        const userData = [...result].sort((a, b) => {
          if (a[sorter?.field] < b[sorter?.field]) {
            return 1;
          } else {
            return -1;
          }
        });

        setAllInvoicesRes((prev) => ({ ...prev, result: userData }));
      }
      setAllInvoicesConfig({
        ...allInvoicesConfig,
        page: pagination.current,
        page_size: pagination.pageSize,
        sortid:
          sorter && sorter.order === 'descend'
            ? `-${sorter.field}`
            : sorter?.order === 'asceend'
            ? sorter.field
            : 'id',
      });
      const route = `/app${ISupportedRoutes.INVOICES}?tabIndex=all&sortid=${
        sorter && sorter?.order === 'descend'
          ? `-${sorter?.field}`
          : sorter?.order === 'ascend'
          ? sorter.field
          : 'id'
      }&page=${pagination.current}&page_size=${pagination.pageSize}&filter=${
        sorter?.order
      }&query=${query}`;
      history.push(route);
    }
  };

  /* Functions Here */

  const renderTobarRight = () => {
    return (
      <div className="flex alignCenter">
        {/* <InvoiceImports/> */}
        <SmartFilter
          onFilter={(encode) => {
            setAllInvoicesConfig({ ...allInvoicesConfig, query: encode });
            const route = `/app${ISupportedRoutes.INVOICES}?tabIndex=all&sortid=null&page=1&page_size=20&sortid=${sortid}&query=${encode}`;
            history.push(route);
          }}
          onClose={() => setFilterBar(false)}
          visible={filterBar}
          formSchema={invoiceFiltersSchema}
        />
      </div>
    );
  };

  return (
    <CommonTable
      // themeScroll
      pdfExportable={{
        columns: PdfCols,
      }}
      className="border-top-none"
      topbarRightPannel={renderTobarRight()}
      hasPrint
      exportableProps={{
        fields: _exportableCols,
        fileName: 'approved-invoices',
      }}
      exportable
      printTitle={'Approved Invoices'}
      customTopbar={
        <div className="flex alignCenter">
          <PurchaseListTopbar
            disabled={!selectedRow.length}
            hideDeleteButton={true}
            renderSmartFilter={
              <SmartFilter
                onFilter={(encode) => {
                  setAllInvoicesConfig({
                    ...allInvoicesConfig,
                    query: encode,
                  });
                  const route = `/app${ISupportedRoutes.INVOICES}?tabIndex=all&sortid=null&page=1&page_size=20&sortid=${sortid}&query=${encode}`;
                  history.push(route);
                }}
                onClose={() => setFilterBar(false)}
                visible={filterBar}
                formSchema={invoiceFiltersSchema}
              />
            }
          />
          <ButtonTag
            disabled={selectedRow.length > 1}
            onClick={() => {
              setPaymentsModalConfig(true, null, {
                contactId: selectedContact,
                type: 'receivable',
                orders: selectedRow,
              });
            }}
            className="ml-5s"
            title="Create Payment"
            size="middle"
          />
        </div>
      }
      data={result}
      columns={columns}
      loading={isFetching || isLoading}
      onChange={onChangePagination}
      totalItems={pagination && pagination.total}
      pagination={{
        pageSize: page_size,
        position: ['bottomRight'],
        current: pagination && pagination.page_no,
        total: pagination && pagination.total,
      }}
      hasfooter={true}
      onSelectRow={onSelectedRow}
      enableRowSelection
    />
  );
};

export default ALLInvoiceList;
