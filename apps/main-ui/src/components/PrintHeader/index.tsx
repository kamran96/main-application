import dayjs from 'dayjs';
import React, { FC, ReactElement } from 'react';

import { useGlobalContext } from '../../hooks/globalContext/globalContext';
import { IUser } from '../../modal';
import { Heading } from '../Heading';
import { BoldText } from '../Para/BoldText';

interface IProps {
  title?: string;
  date?: any;
}

export const PrintHeader: FC<IProps> = ({
  title,
  date = dayjs().format('MMMM D, YYYY'),
}) => {
  const userDetails: IUser = useGlobalContext().userDetails;
  const _logo = userDetails?.profile?.attachment?.path;

  return (
    <div className="common_print_header">
      <table style={{ width: '100%' }}>
        <tbody>
          <tr>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

interface IPrintHeaderFormat {
  children: ReactElement<any>;
  hasbackgroundColor: boolean;
}
export const PrintHeaderFormat: FC<IPrintHeaderFormat> = ({
  children,
  hasbackgroundColor = true,
}) => {
  return (
    <div className={`print_header_area ${hasbackgroundColor ? 'hasbg' : ''}`}>
      {children}
    </div>
  );
};

interface IDivision {
  element: ReactElement<any>;
}
interface IDivisionsProps {
  divisions: IDivision[];
}
export const TableDivisions: FC<IDivisionsProps> = ({ divisions }) => {
  return (
    <table style={{ width: '100%' }}>
      <tbody>
        <tr>
          {divisions?.map((item, index) => {
            return <td key={index}>{item?.element}</td>;
          })}
        </tr>
      </tbody>
    </table>
  );
};
