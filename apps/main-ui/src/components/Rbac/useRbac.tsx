import React, { useMemo } from "react";
import { useGlobalContext } from "../../hooks/globalContext/globalContext";
import { IUser } from "../../modal";
import { RbacManager } from "./RbacManager";

export const useRbac = (permission: string) => {
  const { rolePermissions } = useGlobalContext();
  const role = useRole();
  const rbac = useMemo(() => {
    const __ = new RbacManager(permission, role, rolePermissions);
    return __;
  }, [permission, role, rolePermissions]);

  const can = () => {
    return rbac.can();
  };

  return { rbac, can };
};

const useRole = () => {
  const userDetails: IUser = useGlobalContext().userDetails;

  return (
    (userDetails && userDetails.role && userDetails.role.name) ||
    "onboarding-user"
  );
};
