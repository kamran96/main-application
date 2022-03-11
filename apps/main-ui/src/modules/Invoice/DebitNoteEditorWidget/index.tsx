import React, { FC } from 'react';
import { Heading } from '../../../components/Heading';
import { TableCard } from '../../../components/TableCard';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import { ISupportedRoutes } from '../../../modal/routing';
import { BreadCrumbArea } from '../../../components/BreadCrumbArea';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import { DebitNoteEditor } from './Editor';

export const DebitNoteEditorWidget: FC = () => {
  const { routeHistory } = useGlobalContext();
  const { location } = routeHistory;
  const id = location?.pathname?.split(`/app/add-credit-note/`)[1] || null;

  return (
    <>
      <Heading>Debit Note</Heading>
      <BreadCrumbArea>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to={`/app${ISupportedRoutes.DEBIT_NOTES}`}>Debit Notes</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Debit Note</Breadcrumb.Item>
        </Breadcrumb>
      </BreadCrumbArea>
      <DebitNoteEditor id={id} type="CN" />
    </>
  );
};
