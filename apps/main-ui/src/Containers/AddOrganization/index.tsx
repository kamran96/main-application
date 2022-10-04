import React from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../hooks/globalContext/globalContext';
import { OrganizationsList } from './AddOrganization';
import { OrganizationWidget } from './OrganizationWidget';

export const Organizations = () => {
  const { userDetails } = useGlobalContext();

  if (userDetails?.organizationId) {
    return <OrganizationsList />;
  } else {
    return <OrganizationWidget />;
  }
};
