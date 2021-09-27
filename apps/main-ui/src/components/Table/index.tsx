import "./print.css";

import printIcon from "@iconify-icons/bytesize/print";
import {
  ExportTableButton,
  IExportFieldButtonProps,
  // Table,
} from "ant-table-extensions";
import { Table, Skeleton } from "antd";
import { ColumnsType } from "antd/es/table";
import { TableProps } from "antd/lib/table";
import React, {
  FC,
  ReactElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import printDiv, { ConvertDivToPDFAndDownload } from "../../utils/Print";
import { ButtonTag } from "../ButtonTags";
import { PrintFormat } from "../PrintFormat";
import { PrintHeaderFormat, TableDivisions } from "../PrintHeader";
import { Addressbar, TopbarLogoWithDetails } from "../PrintHeader/Formats";
import { PDFICON } from "../Icons";
import { WrapperTable, DefaultWrapper } from "./styles";
import { useWindowSize } from "../../utils/useWindowSize";
import { useReactToPrint } from "react-to-print";

interface IProps extends TableProps<any> {
  data?: any[];
  customTopbar?: React.ReactElement<any>;
  hasfooter?: boolean;
  renderFooter?: React.ReactElement<any> | any;
  hasTabs?: boolean;
  onSelectRow?: (item: any) => void;
  enableRowSelection?: boolean;
  totalItems?: number;
  customFooter?: React.ReactElement<any>;
  className?: string;
  defaultTopbar?: boolean;
  columns?: ColumnsType<any> | any;
  hasPrint?: boolean;
  topbarRightPannel?: ReactElement<any>;
  printTitle?: string;
  printColumns?: ColumnsType<any>;
  exportable?: boolean;
  exportableProps?: IExportFieldButtonProps;
  pdfExportable?: boolean;
  tableType?: "primary" | `default`;
  themeScroll?: boolean;
  loading?: boolean;
}

const defaultProps: IProps = {
  hasfooter: true,
  hasTabs: false,
  enableRowSelection: false,
  tableType: "primary",
};

export const CommonTable: FC<IProps> = ({
  columns,
  data,
  pagination,
  onSelectRow,
  customTopbar,
  hasfooter,
  renderFooter,
  hasTabs,
  enableRowSelection,
  totalItems,
  customFooter,
  className,
  hasPrint,
  topbarRightPannel,
  printTitle,
  printColumns,
  exportable,
  exportableProps,
  pdfExportable,
  themeScroll,
  loading,
  tableType = "primary",
  ...rest
} = defaultProps) => {


  /* *****************COMPONENT STATES ************** */
  const [scrollConfig, setScrollConfig] = useState<any>({
    y: "100vh",
  });

  const [{tableColumns, tableData}, setLoadingConfig] = useState({
    tableData: [],
    tableColumns: []
  })



  /* *****************COMPONENT STATES ENDS HERE************** */

  /* **************UTILITY CONSTANTS ************ */
  const _newData: any[] = data ? data : rest?.dataSource as any[];
  console.log(_newData, "new data")

  

  const _exportableProps: IExportFieldButtonProps = exportableProps
  ? {
      dataSource: _newData,
      columns: columns,
      ...exportableProps,
    }
  : {
      dataSource: _newData,
      columns: columns,
    };

const printScrollconfig = { ...rest, scroll: {} };


  const [width] = useWindowSize();
  
  const printRef = useRef();
  
  /* **************UTILITY CONSTANTS ENDS HERE ************ */

  /* *************COMPONENT LIFECYCLE HOOKS ************** */

  useEffect(()=>{
    if(loading){
     
     setLoadingConfig(()=>{
       let cols= columns?.map((col)=>{
         return {...col, render: ()=> <Skeleton title={false} paragraph={{rows:1}} active/>}
       })
 
       return {tableColumns: cols, tableData: [{},{},{}]}
     })
     
   }
 
   else if(!loading && _newData){
     setLoadingConfig({tableColumns: columns, tableData: _newData})
   }
   },[loading, _newData, columns])

   useEffect(() => {
    if (!rest.scroll && width < 1300 && themeScroll) {
      setScrollConfig({ ...scrollConfig, x: true });
    } else {
      setScrollConfig({ y: "100vh" });
    }
  }, [width, themeScroll, rest.scroll]);
  /* *************COMPONENT LIFECYCLE HOOKS ENDS HERE ************** */

  /* ***********************COMPONENT UTILITY FUNCTIONS *************** */
  
  const onPrint = () => {
    let printItem = printRef.current;

    printDiv(printItem);
  };

  const onPDF = () => {
    let printItem = printRef.current;

    ConvertDivToPDFAndDownload(printItem);
  };
  /* ***********************COMPONENT UTILITY FUNCTIONS ENDS HERE*************** */
  
  /* **************** JSX RETURNING FUNCTIONS **************** */
  
  const renderTable = () => {
    return (
      <>
        {customTopbar && (
          <div className={`table_top flex alignCenter ${className}`}>
            <div className="flex-1 mr-10">{customTopbar}</div>
            <div className="flex alignCenter">
              {exportable && (
                <div className="mr-10 flex alignCenter _exportable_button">
                  <ExportTableButton {..._exportableProps}>
                    Export to CSV
                  </ExportTableButton>
                </div>
              )}
              {hasPrint && (
                <ButtonTag
                className="mr-10"
                  onClick={onPrint}
                  title="Print"
                  size="middle"
                  icon={printIcon}
                />
              )}
              {pdfExportable && (
                <ButtonTag
                onClick={onPDF}
                className="mr-10"
                ghost
                title="Download PDF"
                  size="middle"
                  customizeIcon={<PDFICON className="flex alignCenter mr-10" />}
                />
                )}
              {topbarRightPannel}
            </div>
          </div>
        )}
        {enableRowSelection ? (
          <Table
          // scroll={rest.scroll ? rest.scroll : themeScroll ? scrollConfig : {}}
          rowSelection={{
            type: "checkbox",
            ...rest.rowSelection,
            onChange: (selectedRowKeys, selectedRows) => {
              onSelectRow({ selectedRows, selectedRowKeys });
            },
          }}
            pagination={pagination}
            columns={tableColumns}
            dataSource={tableData}
            loading={false}
            {...rest}
            />
            ) : (
          <Table
            // scroll={rest.scroll ? rest.scroll : themeScroll ? scrollConfig : {}}
            pagination={pagination}
            columns={tableColumns}
            dataSource={tableData}
            loading={false}
            // exportable
            // loading
            {...rest}
          />
          )}

        {hasfooter && (
          <div className="ant-table ant-table-default footer-border">
            <table>
              <thead className="ant-table-thead footer">
                <tr>
                  <td>
                    {renderFooter ? (
                      <>{renderFooter}</>
                      ) : (
                        <p className="total_count">{totalItems} Total Items</p>
                        )}
                  </td>
                </tr>
              </thead>
            </table>
          </div>
        )}
      </>
    );
  };
  /* **************** JSX RETURNING FUNCTIONS ENDS HERE **************** */
  
  /* JSX */
  return (
    <>
      <div className={"_visibleOnPrint"} ref={printRef}>
        <PrintFormat>
          <>
            <div className="mb-30">
              <PrintHeaderFormat hasbackgroundColor={true}>
                <TableDivisions
                  divisions={[
                    {
                      element: <TopbarLogoWithDetails />,
                    },
                    {
                      element: <Addressbar />,
                    },
                  ]}
                />
              </PrintHeaderFormat>
            </div>
            <div className={"antd-table-print"}>
              <Table
              
                pagination={pagination}
                columns={printColumns ? printColumns : columns}
                dataSource={[..._newData]}
                // loading
                {...printScrollconfig}
              />
            </div>
          </>
        </PrintFormat>
      </div>

      <WrapperTable
        scrollabletable={themeScroll}
        classname={`_disable_print`}
        pagination={pagination ? true : false}
      >
        {tableType === "default" ? (
          <DefaultWrapper>{renderTable()}</DefaultWrapper>
        ) : (
          renderTable()
        )}
      </WrapperTable>
    </>
  );
};
