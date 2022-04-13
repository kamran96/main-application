import React, { FC, ReactElement } from 'react';
import { useRbac } from './useRbac';

interface IProps {
  permission: string;
  children: ReactElement<any>;
}

export const Rbac: FC<IProps> = ({ permission, children }) => {
  const { can } = useRbac(permission);

  if (can()) {
    return children;
  } else {
    return null;
  }
};
