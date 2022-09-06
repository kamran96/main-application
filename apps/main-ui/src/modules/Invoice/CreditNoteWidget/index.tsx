import React, { FC } from 'react';
import { Heading, TableCard, BreadCrumbArea } from '@components';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import { ISupportedRoutes } from '@invyce/shared/types';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import { CreditNoteEditor } from './Editor';

export const CreditNoteEditorWidget: FC = () => {
  const { routeHistory } = useGlobalContext();
  const { location } = routeHistory;
  const id = location?.pathname?.split(`/app/add-credit-note/`)[1] || null;

  return (
    <>
      <Heading type="form">Credit Note</Heading>
      <BreadCrumbArea>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to={`/app${ISupportedRoutes.CREDIT_NOTES}`}>
              Credit Notes
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Credit Note</Breadcrumb.Item>
        </Breadcrumb>
      </BreadCrumbArea>
      <CreditNoteEditor id={id} type="CN" />
    </>
  );
};
