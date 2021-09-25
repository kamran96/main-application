import { IRolePermissions } from "../../modal/rbac";

export class RbacManager {
  permission: string;
  role: string;

  rolePermissions: IRolePermissions[];

  constructor(permission, role, rolePermissions) {
    this.permission = permission;
    this.role = role;
    this.rolePermissions = rolePermissions;
  }

  can(permission?: string) {
    let hasPermission = true;
    const permissionLocal: string =
      permission?.trim() || this.permission?.trim();
    let permissionIndex = this.rolePermissions.findIndex(
      (i) => i.action === permissionLocal
    );

    if (permissionIndex > -1) {
      if (
        this.rolePermissions[permissionIndex].role === this.role ||
        this.rolePermissions[permissionIndex].parents.includes(this.role) ||
        this.role === "super-admin"
      ) {
        hasPermission = true;
      } else {
        hasPermission = false;
      }
    } else if (this.role === "super-admin" || this.role === "onboarding-user") {
      hasPermission = true;
    } else {
      hasPermission = false;
    }
    return hasPermission;
  }
}
