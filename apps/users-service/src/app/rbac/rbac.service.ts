import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  IBaseUser,
  IPage,
  IPermission,
  IPermissionResponse,
  IRole,
  IRolePermission,
  IRoleWithParent,
} from '@invyce/interfaces';
import {
  PermissionDto,
  PermissionIdsDto,
  RoleDto,
  RoleIdsDto,
  RolePermissionDto,
} from '../dto/rbac.dto';

import { Permission } from '../schemas/permission.schema';
import { Role } from '../schemas/role.schema';
import { RolePermission } from '../schemas/rolePermission.schema';
import { User } from '../schemas/user.schema';

@Injectable()
export class RbacService {
  constructor(
    @InjectModel(Role.name) private roleModel,
    @InjectModel(Permission.name) private permissionModel,
    @InjectModel(RolePermission.name) private rolePermissionModel,
    @InjectModel(User.name) private userModel
  ) {}

  async IndexPermissions(queryData: IPage): Promise<IPermissionResponse> {
    const { page_no, page_size } = queryData;
    const pn: number = parseInt(page_no);
    const ps: number = parseInt(page_size);

    const myCustomLabels = {
      docs: 'result',
      totalDocs: 'total',
      limit: 'page_size',
      page: 'page_no',
      nextPage: 'next',
      prevPage: 'prev',
      totalPages: 'total_pages',
      meta: 'pagination',
    };

    return await this.permissionModel.paginate(
      { status: 1 },
      {
        offset: pn * ps - ps,
        limit: page_size,
        customLabels: myCustomLabels,
      }
    );
  }

  async CreateRole(roleDto: RoleDto, user: IBaseUser): Promise<IRole> {
    if (roleDto && roleDto.isNewRecord === false) {
      const role = await this.GetRole(roleDto.id);
      if (role) {
        await this.roleModel.updateOne(
          { _id: roleDto.id },
          { name: roleDto.name, description: roleDto.description }
        );

        return await this.GetRole(roleDto.id);
      }
    } else {
      const role = await this.roleModel.find({
        name: roleDto.name,
        organizationId: user.organizationId,
      });

      if (Array.isArray(role) && role.length > 0) {
        throw new HttpException('Role already exists.', HttpStatus.BAD_REQUEST);
      }

      const findAllRoles = await this.roleModel.find({
        organizationId: user.organizationId,
      });

      const roleToUpdate = findAllRoles.find((r) => r.level === roleDto.level);
      const parentRole = findAllRoles.filter((r) => r.level > roleDto.level);

      const newRole = new this.roleModel();
      newRole.name = roleDto.name;
      newRole.description = roleDto.description;
      newRole.level = roleDto.level;
      newRole.parentId = roleDto.parentId;
      newRole.organizationId = user.organizationId;
      newRole.status = 1;
      await newRole.save();

      await this.roleModel.updateOne(
        { _id: roleToUpdate._id },
        { parentId: newRole._id, level: roleDto.level + 1 }
      );

      if (parentRole.length > 0) {
        for (const i of parentRole) {
          await this.roleModel.updateOne(
            { _id: i._id },
            { level: i.level + 1 }
          );
        }
      }

      return newRole;
    }
  }

  async ShowPermission(type: string, user: IBaseUser): Promise<IPermission> {
    const permissions = await this.permissionModel
      .find({ module: type })
      .sort({ id: 'asc' });

    const roles = await this.rolePermissionModel
      .find({
        organizationId: user.organizationId,
      })
      .populate('roleId')
      .sort({ id: 'asc' });

    let obj = {};
    return permissions.map((p) => {
      for (const i of roles) {
        if (p._id.toString() === i.permissionId.toString()) {
          obj = {
            roleId: i.roleId._id,
            role: i.roleId.name,
            permissionId: p._id,
            parentId: i.roleId.parentId || null,
            hasPermission: i.hasPermission,
            rolePermissionId: i._id,
            title: p.title,
            description: p.description,
            module: p.module,
          };
        }
      }
      return obj;
    });
  }

  async GetRoles(user: IBaseUser): Promise<IRole[]> {
    const role = await this.roleModel
      .find({
        organizationId: user.organizationId,
      })
      .populate('parent')
      .sort({ level: 'ASC' });

    return role;
  }

  async GetRole(roleId: string): Promise<IRole> {
    return await this.roleModel.findById(roleId);
  }

  async GetRoleWithPermissions(user: IBaseUser): Promise<IRoleWithParent> {
    const parentRoles = await this.roleModel
      .find({ organizationId: user.organizationId })
      .sort({ level: 'ASC' });

    const parentRole = parentRoles.map((r) => r.name);

    const queryRoles = await this.rolePermissionModel
      .find({
        organizationId: user.organizationId,
      })
      .populate('roleId')
      .populate('permissionId')
      .sort({ id: 'asc' });

    const roles = queryRoles.map((r) => ({
      roleId: r.roleId._id,
      role: r.roleId.name,
      permissionId: r.permissionId._id,
      parentId: r.roleId.parentId || null,
      hasPermission: r.hasPermission,
      title: r.permissionId.title,
      description: r.permissionId.description,
      organizationId: r.organizationId,
      module: r.permissionId.module,
    }));
    return { parentRole, roles };
  }

  async CreatePermission(
    permissionDto: PermissionDto,
    user: IBaseUser
  ): Promise<IPermission> {
    try {
      const permission = new this.permissionModel();
      permission.title = permissionDto.title;
      permission.description = permissionDto.description;
      permission.module = permissionDto.module;
      permission.organizationId = user.organizationId;
      permission.createdById = user.id;
      permission.updatedById = user.id;
      permission.status = 1;
      await permission.save();

      const roles = await this.roleModel.find({
        name: 'admin',
      });

      for (const i of roles) {
        const rolePermission = new this.rolePermissionModel();
        rolePermission.roleId = i.id;
        rolePermission.permissionId = permission.id;
        rolePermission.organizationId = user.organizationId;
        rolePermission.hasPermission = true;
        rolePermission.status = 1;
        await rolePermission.save();
      }

      return permission;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async GetDistinctModule(): Promise<IPermission[]> {
    return await this.permissionModel.find().distinct('module');
  }

  // async GetPermissions(page_no, page_size): Promise<any> {
  // const permissionRepo = getCustomRepository(PermissionRepository);
  // const permission = await permissionRepo.find({
  //   where: {
  //     // organizationId: user.organizationId,
  //   },
  //   take: page_size || 20,
  //   skip: page_no || 0,
  // });
  // const pagination = await this.pagination.paginate(
  //   permission,
  //   page_size,
  //   page_no
  // );
  // return {
  //   pagination,
  //   permission,
  // };
  // }

  async InsertRoles(organizationId: string): Promise<IRole[]> {
    try {
      const { roles } = await import('../rbac');

      const role_arr = [];
      let level = 1;
      for (const i of roles) {
        const role = new this.roleModel();
        role.name = i.name;
        role.organizationId = organizationId;
        role.level = level++;
        role.status = 1;
        await role.save();

        role_arr.push(role);
      }

      for (const i of roles) {
        const parentRole = role_arr.find((r) => r.name === i.parent);
        const role = role_arr.find((r) => r.name === i.name);

        if (parentRole) {
          const updateRole = {
            name: role.name,
            parentId: parentRole._id || null,
          };

          await this.roleModel.updateOne({ _id: role._id }, updateRole);
        }
      }

      return role_arr;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async InsertGlobalPermissions(): Promise<IPermission[]> {
    const { permissions } = await import('../rbac');

    const permissionArr = [];
    for (const i of permissions) {
      const permission = new this.permissionModel();
      permission.title = i.title;
      permission.description = i.description;
      permission.module = i.module;
      permission.status = 1;
      await permission.save();

      permissionArr.push(permission);
    }
    return permissionArr;
  }

  async InsertRolePermission(organizationId: string): Promise<void> {
    const { permissions } = await import('../rbac');

    const roles = await this.roleModel.find({ organizationId });

    let globalPermissions = await this.permissionModel
      .find()
      .sort({ _id: 'ASC' });

    console.log(globalPermissions, 'okkkayu');
    if (globalPermissions.length === 0) {
      globalPermissions = await this.InsertGlobalPermissions();
    }
    console.log(globalPermissions, 'asdfsd');

    for (const permission of permissions) {
      const pId = globalPermissions.find(
        (gp) => gp.description === permission.description
      );
      const roleId = roles.find((r) => r.name === permission.roles[0]);

      const rolePermission = new this.rolePermissionModel();
      rolePermission.roleId = roleId._id;
      rolePermission.permissionId = pId._id;
      rolePermission.organizationId = organizationId;
      rolePermission.hasPermission = true;
      rolePermission.status = 1;
      await rolePermission.save();
    }
  }

  async AddRolePermission(
    data: RolePermissionDto,
    user: IBaseUser
  ): Promise<IRolePermission> {
    await this.rolePermissionModel.updateOne(
      { _id: data.rolePermissionId },
      {
        roleId: data.roleId,
        permissionId: data.permissionId,
        hasPermission: data.hasPermission,
        organizationId: user.organizationId,
        status: 1,
      }
    );

    const rolePermission = await this.rolePermissionModel.find({
      _id: data.rolePermissionId,
    });

    return rolePermission;
  }

  async DeleteRole(roleIds: RoleIdsDto): Promise<boolean> {
    for (const i of roleIds.ids) {
      const role = await this.roleModel.findOne({
        _id: i,
      });
      const rolePermissions = await this.rolePermissionModel.findOne({
        roleId: i,
      });
      if (rolePermissions) {
        for (const i of rolePermissions) {
          await this.rolePermissionModel.updateOne(
            { _id: i.id },
            { roleId: role.parentId }
          );
        }
      }
      await this.roleModel.findOneAndDelete({ _id: i });
    }
    return true;
  }

  async DeletePermission(permissionIds: PermissionIdsDto): Promise<boolean> {
    for (const i of permissionIds.ids) {
      await this.permissionModel.findOneAndDelete({ id: i });
    }

    return true;
  }
}
