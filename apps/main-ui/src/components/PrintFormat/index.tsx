import React, { FC, ReactElement } from 'react';

import { BoldText } from '../Para/BoldText';
import { P } from '../Typography';
import './print.css';
import './balancesheet.css';
import './printTopbar.css';
import './invoicesprint.css';

interface IProps {
  children: ReactElement<any>;
}

export const PrintFormat: FC<IProps> = ({ children }) => {
  return (
    <div className="print_format_wrapper">
      <table
        style={{ borderBottom: 'none', width: '100%' }}
        className="parent_table"
      >
        <tr>
          <td style={{ width: '100%' }}>{children}</td>
        </tr>
        <tfoot style={{ border: 'none !important' }}>
          <td style={{ visibility: 'hidden' }}>footer</td>
        </tfoot>
      </table>
      <div
        style={{ paddingTop: '8px', paddingBottom: '8px' }}
        className="footer_data _visibleOnPrint"
      >
        <P className="footer_details mr-10">Powered by </P>
        <BoldText style={{ fontSize: '9px' }}>&nbsp;uConnect Pvt(Ltd)</BoldText>
      </div>
    </div>
  );
};
