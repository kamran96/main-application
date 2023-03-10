export default `
/* Custom GLOBAL Styles on PRINT */

  /* * {
    color: #121212 !important;
  } */

  * {
    font-family: "Roboto Slab", serif !important;
  }

  .print_format_wrapper{
    background: white !important;
    height: 100vh !important; 
  }
  

  /* Print Header styles */
  /* Used For all prints */
  .print_header_area .header_company_logo {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    -ms-border-radius: 50%;
    -o-border-radius: 50%;
  }

  .print_header_area {
    padding: 30px;
  }
  .hasbg {
    background: #f7fbff !important;
    padding: 30px;
  }
  /* Used For all prints ends here */

  /* ************* TOPBAR WITH LOGO DETAILS styles ********************** */
  .topbar_logo_details_wrapper .logo {
    display: flex;
    align-items: flex-start;
  }
  .topbar_logo_details_wrapper .company_details {
    padding: 0px 22px;
  }
  .topbar_logo_details_wrapper .company_details .company_name {
    color: #143c69;
    font-size: 25px;
    margin: 0;
    font-weight: 800;
  }
  .topbar_logo_details_wrapper .company_details p {
    font-size: 16px;
    line-height: 19px;
    color: #6f6f84;
    margin-bottom: 5px;
  }

  /* ************* TOPBAR WITH LOGO DETAILS ENDS HERE ********************** */

  /* ************* ADDRESS BAR STYLES ********************** */
  table.address_bar_table {
    text-align: right;
    width: 100%;
  }
  table.address_bar_table tr td p {
    margin-bottom: 5px;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 19px;
    text-align: right;
    color: #6f6f84;
  }
  /* ************* ADDRESS BAR STYLES ENDS HERE ********************** */

  /* ************* BLOCK DESIGN LOGO STYLES ********************** */
  .BlockDesignLogo .company_name {
    color: #143c69;
    font-size: 25px;
    margin: 0;
    font-weight: 800;
    margin-top: 5px;
  }
  /* ************* BLOCK DESIGN LOGO STYLES  ENDS HERE********************** */

  /* print header styles ends here */

  .print-mv-40 {
    margin: 2.5rem 0 !important;
  }

  .border_none {
    border: none !important;
  }

  
  .common_print_header {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    padding: 10px 0 !important;
    border-bottom: 1px dashed #ededed !important;
  }
  .common_print_header .logo {
    margin-right: 0.65rem !important;
  }

  .common_print_header .logo img {
    width: 5rem !important;
    height: 5rem !important;
  }

  .common_print_header .org_details .branch_name {
    color: #9d9d9d !important;
    font-weight: bold !important;
    font-size: 0.8rem !important;
  }
  .common_print_header .organization_details table {
    width: 16rem !important;
  }
  .common_print_header .organization_details table tr th {
    padding-right: 0.5rem !important;
    display: flex !important;
    align-items: flex-start !important;
    font-size: 11px !important;
  }
  .common_print_header .organization_details table tr td {
    font-size: 11px !important;
    padding-left: 0.5rem !important;
  }
  .common_print_header .border_none,
  th,
  td {
    border: none !important;
  }

  /* print - table */

  .print_table_styles table {
    width: 100% !important;
    border: 1px solid #dedede !important;
    border-bottom: 0px !important;
  }
  .print_table_styles table thead tr {
    width: 100% !important;
    border: 1px solid #dedede !important;
    border-bottom: 0px !important;
  }
  .print_table_styles table thead tr th {
    font-size: 11px !important;
    padding: 4px 3px 4px 8px !important;
    border: 1px solid #dedede !important;
    background: #ededed !important;
  }
  .print_table_styles table tbody tr td {
    font-size: 11px !important;
    padding: 4px 3px 4px 8px !important;
    white-space: nowrap !important;
    border: 1px solid #dedede !important;
  }
 

  .ant-table-selection-column,
  .table_top,
  .ant-pagination,
  .footer {
    display: none !important;
  }

  /* Print Format */
  .parent_table {
    width: 100%;
    border: none !important;
  }

  .parent_table tfoot {
    border: none !important;
  }
  .parent_table tfoot tr {
    border: none !important;
  }
  .parent_table tfoot tr td {
    border: none !important;
  }
  .parent_table tfoot tr th {
    border: none !important;
  }

  .footer_data {
    position: fixed;
    bottom: 0 !important;
    width: 100% !important;
    left: 0 !important;
    z-index: 1111 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    /* padding:  0; */
    /* border-top: 1px solid #dadada; */
  }

  .footer_data .footer_details {
    color: #9d9d9d !important;
    font-size: 9px !important;
  }

  /* print view purchase order / invoice styles */

  #purchase_order_print_view .main_wrapper {
    padding: 30px 30px 0 30px;
  }
  #purchase_order_print_view ._invoice_desc_right tr td {
    font-size: 11px !important;
    padding-left: 16px !important;
  }

  #purchase_order_print_view ._invoice_desc_right tr th .billed_title {
    font-size: 14px !important;
    white-space: nowrap !important;
  }

  #purchase_order_print_view ._invoice_desc_right tr th {
    font-size: 11px !important;
    padding: 3px 0 !important;
    display: flex !important;
  }

  #purchase_order_print_view .invoice_dispatch_details {
    padding-bottom: 18px !important;
  }
  #purchase_order_print_view
    .invoice_dispatch_details
    .billed
    ._main_table
    table
    .head {
    color: #6f6f84;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 17px;
  }
  #purchase_order_print_view .invoice_dispatch_details .billed ._main_table tr {
    display: flex;
    justify-content: space-between;
  }
  #purchase_order_print_view
    .invoice_dispatch_details
    .billed
    ._main_table
    tr
    td {
    flex: 1 1 20%;
  }
  #purchase_order_print_view
    .invoice_dispatch_details
    .billed
    ._main_table
    table
    .head
    p {
    margin-top: 5px;
  }
  #purchase_order_print_view
    .invoice_dispatch_details
    .billed
    ._main_table
    table
    td {
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 17px;
    padding: 4px 0;
  }

  #purchase_order_print_view
    .invoice_dispatch_details
    .billed
    ._main_table
    table
    td
    p {
    font-style: normal;
    font-size: 14px;
    line-height: 17px;
  }

  #purchase_order_print_view .table_list {
    width: 100% !important;
  }

  #purchase_order_print_view .table_list thead tr th {
    /* border: 1px solid #dedede !important; */
    font-size: 12px !important;
    padding: 10px 0 10px 10px !important;
    color: #ffffff !important;
    text-transform: uppercase;
    background-color: #143c69 !important;
  }
  #purchase_order_print_view .table_list tbody tr td {
    font-size: 14px !important;
    padding: 10px 0 10px 10px !important;
    color: #222234 !important;
    font-weight: 500;
  }
  #purchase_order_print_view .table_list tbody tr:nth-child(odd) td {
    background: #f9f9f9 !important;
  }
  #purchase_order_print_view .table_list tbody tr td p.item_name {
    font-style: normal !important;
    font-weight: normal !important;
    font-size: 13px !important;
    line-height: 17px !important;
    color: #222234 !important;
    margin-bottom: 2px;
  }
  #purchase_order_print_view .table_list tbody tr td p.item_desc {
    font-style: normal !important;
    font-weight: normal !important;
    font-size: 12px !important;
    line-height: 15px !important;
    color: #6f6f84 !important;
    margin-bottom: 2px;
  }

  #purchase_order_print_view .total {
    display: flex !important;
    justify-content: flex-end !important;
    /* margin: 0px 0 !important; */
  }
  #purchase_order_print_view .total .total_table {
    width: 250px !important;
  }
  /* #purchase_order_print_view .total .total_table tr:last-child th {
    border-top: 1px solid #9d9d9d !important;
    border-bottom: 1px solid #9d9d9d !important;
  }
  #purchase_order_print_view .total .total_table tr:last-child td {
    border-top: 1px solid #9d9d9d !important;
    border-bottom: 1px solid #9d9d9d !important;
  } */
  #purchase_order_print_view .total .total_table tr th {
    font-size: 12px !important;
    color: #6f6f84;
    font-weight: 600;
    letter-spacing: 0.9px;
    text-align: left !important;
  }
  #purchase_order_print_view .total .total_table tr td {
    font-size: 14px !important;
    padding-left: 20px !important;
    color: #222234;
    font-weight: 500;
    letter-spacing: 0.9px;
  }
  #purchase_order_print_view .total .total_table tr:last-child td {
    padding-top: 10px;
    border-top: 1px solid #bcb0c4 !important;
  }
  #purchase_order_print_view .total .total_table tr:last-child th {
    padding-top: 10px;
    border-top: 1px solid #bcb0c4 !important;
  }

  /* table print */

  .antd-table-print table {
    width: 100% !important;
    border: 1px solid #dedede !important;
    border-bottom: 0px !important;
  }
  .antd-table-print thead tr {
    width: 100% !important;
    border-bottom: 0px !important;
  }
  .antd-table-print thead tr th {
    font-size: 11px !important;
    padding: 4px 3px 4px 8px !important;
    border-bottom: 1px solid #dedede !important;
    background: #ededed !important;
  }
  .antd-table-print tbody tr td {
    font-size: 11px !important;
    padding: 4px 3px 4px 8px !important;
    white-space: nowrap !important;
    border-bottom: 1px solid #dedede !important;
    color: #333 !important;
  }
  a {
    color: #333 !important;
  }

  .ant-table-container table > thead > tr:first-child th:first-child {
    border-top-left-radius: 0px !important;
  }
  .ant-table-container table > thead > tr:first-child th:last-child {
    border-top-right-radius: 0px !important;
  }
  .ant-table-cell-scrollbar {
    display: none !important;
  }

  .ant-table-column-sorters {
    padding: 0 !important;
  }

  .ant-table-column-sorter {
    display: none !important;
  }

  .balancesheet-table {
    width: 100% !important;
    border: 1px solid #e8e8e8 !important;
  }

  .balancesheet-table thead tr th.main-title-head {
    font-style: normal !important;
    font-weight: 500 !important;
    font-size: 14px !important;
    line-height: 16px !important;
    letter-spacing: 0.05em !important;
    text-transform: capitalize !important;
    border: 1px solid #e8e8e8 !important;
    border-top: none !important;
    padding: 11px 20px !important;
    /* text heading color */
    color: #272727 !important;
  }

  .balancesheet-table tbody tr td:last-child {
    border-right: none !important;
  }

  .balancesheet-table tbody tr td {
    border-right: 1px solid #e8e8e8 !important;
    padding: 0px !important;
  }

  .balancesheet-table tbody tr td table thead th {
    border-right: 1px solid #e8e8e8 !important;
    padding: 11px 20px !important;
  }
  .balancesheet-table tbody tr td table tbody td {
    padding: 8px 0px 8px 22px !important;
  }
  .balancesheet-table tbody tr td table thead th:last-child {
    border-right: none !important;
  }

  .balancesheet-table tfoot tr td {
    border-top: 1px solid #e8e8e8 !important;
    border-right: 1px solid #e8e8e8 !important;
    padding: 11px 20px !important;
  }
  .balancesheet-table tfoot tr td p {
    font-size: 13px !important;
  }

  .balancesheet-table tfoot tr td:last-child {
    border-right: none !important;
  }

  .static-width {
    width: 160px !important;
  }

  .static-width-header {
    width: 160px !important;
  }

  .dark-text {
    color: #000 !important;
    font-style: normal !important;
    font-weight: normal !important;
    font-size: 13px !important;
    line-height: 15px !important;
    text-transform: capitalize !important;
    margin-top: 10px !important;
  }

  /* CASH FLOW STATEMENT */

  .cash_flow_table table {
    width: 100%;
  }

  .cash_flow_table table thead tr {
    background: #143c69;
  }
  .cash_flow_table table thead tr th {
    text-transform: capitalize;
    padding: 11px;
    background: #143c69;
  }
  .cash_flow_table table tbody tr td {
    padding: 15px 10px;
  }
  .cash_flow_table table tbody tr td:last-child {
    text-align: right;
    width: 230px;
    min-width: 230px;
  }
  .cash_flow_table table tbody tr:last-child td:last-child {
    padding-top: 30px;
  }
  .cash_flow_table table tbody tr:last-child td:last-child p {
    padding-top: 10px;
    border-top: 1px solid #e1e1e1;
  }


`;
