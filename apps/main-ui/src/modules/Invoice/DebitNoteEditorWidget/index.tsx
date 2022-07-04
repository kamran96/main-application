import React, { FC } from 'react';
import { Heading } from '../../../components/Heading';
import { TableCard } from '../../../components/TableCard';
import { Breadcrumb } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import { BreadCrumbArea } from '../../../components/BreadCrumbArea';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import { DebitNoteEditor } from './Editor';
import { ISupportedRoutes } from '@invyce/shared/types';

export const DebitNoteEditorWidget: FC = () => {
  const history = useHistory();
  const { location } = history;
  const id =
    location?.pathname?.split(`app${ISupportedRoutes.ADD_DEBIT_NOTE}/`)[1] ||
    null;

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
