import React from "react";
import { useGlobalContext } from "../../hooks/globalContext/globalContext";
import { IUser } from "../../modal";

interface IProps {}

export const TopbarLogoWithDetails = () => {
  const userDetails: IUser = useGlobalContext().userDetails;
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
                alt={"company_logo"}
              />
            ) : null}
          </td>
          <td className="company_details">
            <h2
              style={{ textTransform: "capitalize" }}
              className="company_name"
            >
              {organizationName}
            </h2>
            <p>322-232-2323</p>
            <p>email@email.com</p>
            <p>www.abcdefg.com</p>
          </td>
        </tr>
      </table>
    </div>
  );
};

export const Addressbar = () => {
  return (
    <table className="address_bar_table">
      <tr>
        <td>
          <p>4945 Forest Avenue</p>
        </td>
      </tr>
      <tr>
        <td>
          <p>New York</p>
        </td>
      </tr>
      <tr>
        <td>
          <p>10004</p>
        </td>
      </tr>
      <tr>
        <td>
          <p>United States</p>
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
      style={{ textAlign: "center", width: "max-content" }}
      className="BlockDesignLogo"
    >
      <img className="header_company_logo" src={_logo} alt={"company_logo"} />
      <h2 className="company_name">{organizationName}</h2>
    </div>
  );
};
