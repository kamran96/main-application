import { Breadcrumb, Col, Row } from 'antd';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';

import { BreadCrumbArea, Heading, TableCard } from '@components';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import { ISupportedRoutes } from '@invyce/shared/types';
import { ContactsForm } from './ContactsForm';
import { WrapperContactsEditor } from './styles';

export const ContactsEditorWidget: FC = () => {
  const { routeHistory } = useGlobalContext();

  const id =
    routeHistory &&
    routeHistory.location &&
    routeHistory.location.pathname.split('/')[3];

  return (
    <WrapperContactsEditor>
      <Heading type="form">
        {id ? 'Update Contact' : 'Create New Contact'}
      </Heading>
      <BreadCrumbArea>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to={`/app${ISupportedRoutes.CONTACTS}`}>Contacts</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>New Contact</Breadcrumb.Item>
        </Breadcrumb>
      </BreadCrumbArea>
      <TableCard>
        <Row gutter={24}>
          <Col span={18} offset={3}>
            <ContactsForm id={id} />
          </Col>
        </Row>
      </TableCard>
    </WrapperContactsEditor>
  );
};
