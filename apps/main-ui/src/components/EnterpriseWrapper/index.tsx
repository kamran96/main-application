import { FC, ReactElement } from 'react';
import { useGlobalContext } from '../../hooks/globalContext/globalContext';
import { IOrganizationType } from '../../modal/organization';

interface IProps {
  enable: boolean | IOrganizationType[];
  children: ReactElement<any>;
}

export const EnterpriseWrapper: FC<IProps> = ({ enable, children }) => {
  const { userDetails } = useGlobalContext();

  const { organization } = userDetails;
  // organization.organizationType

  if (
    (typeof enable === 'boolean' && enable === true) ||
    (Array.isArray(enable) && enable.includes(organization.organizationType))
  ) {
    return children;
  } else {
    return null;
  }
};
