export class RoleDto {
  id: number;
  name: string;
  description: string;
  level: number;
  parentId: number;
  isNewRecord: boolean;
}

export class PermissionDto {
  title: string;
  description: string;
  module: string;
}

export class RoleIdsDto {
  ids: Array<number>;
}

export class PermissionIdsDto {
  ids: Array<number>;
}

export class RolePermissionDto {
  roleId: number;
  permissionId: number;
  hasPermission: boolean;
  rolePermissionId: number;
}
