import React from 'react';
import { useGlobalContext } from '../../hooks/globalContext/globalContext';
import { IUser } from '../../modal';
import { getCountryById } from '@invyce/shared/utils';

export const TopbarLogoWithDetails = () => {
  const { userDetails } = useGlobalContext();
  const _logo = userDetails?.profile?.attachment?.path;
  const organizationName = userDetails?.organization?.name;
  return (
    <div className="topbar_logo_details_wrapper">
      <table>
        <tr>
          <td className="logo">
            {_logo ? (
              <img
                className="header_company_logo"
                src={_logo}
                alt={'company_logo'}
              />
            ) : null}
          </td>
          <td className="company_details">
            <h2
              style={{ textTransform: 'capitalize' }}
              className="company_name"
            >
              {organizationName}
            </h2>
            <p>{userDetails?.profile?.phoneNumber}</p>
            <p>{userDetails?.profile?.email}</p>
            <p>{userDetails?.profile?.website || ''}</p>
          </td>
        </tr>
      </table>
    </div>
  );
};

export const Addressbar = () => {
  const { userDetails } = useGlobalContext();
  const { country } = userDetails?.organization?.address;
  const { city } = userDetails?.organization?.address;
  const { postalCode } = userDetails?.organization?.address;

  return (
    <table className="address_bar_table">
      <tr>
        <td>
          <p>{getCountryById(parseInt(country))?.name}</p>
        </td>
      </tr>
      <tr>
        <td>
          <p style={{ textTransform: 'capitalize' }}>{city}</p>
        </td>
      </tr>
      <tr>
        <td>
          <p>{postalCode}</p>
        </td>
      </tr>
    </table>
  );
};
export const BlockDesignLogo = () => {
  const userDetails: IUser = useGlobalContext().userDetails;
  const _logo = userDetails?.profile?.attachment?.path;
  const organizationName = userDetails?.organization?.name;
  return (
    <div
      style={{ textAlign: 'center', width: 'max-content' }}
      className="BlockDesignLogo"
    >
      <img className="header_company_logo" src={_logo} alt={'company_logo'} />
      <h2 className="company_name">{organizationName}</h2>
    </div>
  );
};

export const PrintTitle = ({ title }) => {
  return (
    <div className="printTitle">
      <h3>{title}</h3>
    </div>
  );
};
