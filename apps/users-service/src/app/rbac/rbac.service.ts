import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
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

  async CreateRole(roleDto, organizationId) {
    const role = await this.roleModel.find({
      name: roleDto.name,
      //   organizationId: roleData.organizationId
    });

    if (Array.isArray(role) && role.length > 0) {
      throw new HttpException('Role already exists.', HttpStatus.BAD_REQUEST);
    }

    const findAllRoles = await this.roleModel.find({
      organizationId: organizationId,
    });

    const roleToUpdate = findAllRoles.find((r) => r.level === roleDto.level);
    const parentRole = findAllRoles.filter((r) => r.level > roleDto.level);

    const newRole = new this.roleModel();
    newRole.name = roleDto.name;
    newRole.description = roleDto.description;
    newRole.level = roleDto.level;
    newRole.parentId = roleDto.parentId;
    newRole.organizationId = organizationId;
    newRole.status = 1;
    await newRole.save();

    await this.roleModel.updateOne(
      { _id: roleToUpdate._id },
      { parentId: newRole._id, level: roleDto.level + 1 }
    );

    if (parentRole.length > 0) {
      for (let i of parentRole) {
        await this.roleModel.updateOne({ _id: i._id }, { level: i.level + 1 });
      }
    }

    return newRole;
  }

  async ShowPermission(type) {
    const queryRoles = await this.rolePermissionModel
      .find({
        organizationId: '612793a5afc58999fe3c7d5c',
      })
      .populate('roleId')
      .populate('permissionId', { module: type });

    const roles = queryRoles.map((r) => ({
      roleId: r.roleId._id,
      role: r.roleId.name,
      permissionId: r.permissionId._id,
      parentId: r.roleId.parentId || null,
      hasPermission: r.hasPermission,
      title: r.permissionId.title,
      description: r.permissionId.description,
      module: r.permissionId.module,
    }));
    return roles;
  }

  async GetRole(roleId, organizationId) {
    const role = this.roleModel.find({
      id: roleId,
      organizationId: organizationId,
    });

    return role;
  }

  async CreatePermission(permissionDto): Promise<any> {
    try {
      const permission = new this.permissionModel();
      permission.title = permissionDto.title;
      permission.description = permissionDto.description;
      permission.module = permissionDto.module;
      //   permission.organizationId = permissionData.organizationId;
      //   permission.createdById = permissionData.userId;
      //   permission.updatedById = permissionData.userId;
      permission.status = 1;
      await permission.save();

      const roles = await this.permissionModel.find({
        name: 'admin',
      });

      for (let i of roles) {
        const rolePermission = new this.rolePermissionModel();
        rolePermission.roleId = i.id;
        rolePermission.permissionId = permission.id;
        rolePermission.organizationId = i.organizationId;
        rolePermission.hasPermission = true;
        rolePermission.status = 1;
        await rolePermission.save();
      }

      return permission;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async GetDistinctModule(): Promise<any> {
    return await this.permissionModel.find().distinct('module');
  }

  async GetRoles(): Promise<any> {
    const role = await this.roleModel
      .find({
        organizationId: '612793a5afc58999fe3c7d5c',
      })
      .sort({ level: 'ASC' });

    return role;
  }

  async GetRoleWithPermissions() {
    const parentRoles = await this.roleModel
      .find({ organizationId: '612793a5afc58999fe3c7d5c' })
      .sort({ level: 'ASC' });

    const parentRole = parentRoles.map((r) => r.name);

    const queryRoles = await this.rolePermissionModel
      .find({
        organizationId: '612793a5afc58999fe3c7d5c',
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
      module: r.permissionId.module,
    }));
    return { parentRole, roles };
  }

  async GetPermissions(page_no, page_size): Promise<any> {
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
  }

  async InsertRoles(organizationId, userId = null): Promise<any> {
    try {
      const { roles } = await import('../rbac');

      let role_arr = [];
      let level = 1;
      for (let i of roles) {
        const role = new this.roleModel();
        role.name = i.name;
        role.organizationId = organizationId;
        role.level = level++;
        role.status = 1;
        await role.save();

        role_arr.push(role);
      }

      for (let i of roles) {
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

      if (userId) {
        const user = await this.userModel.findById(userId);

        const [adminRole] = role_arr.filter((r) => r.name === 'admin');

        await this.userModel.updateOne(
          { id: user._id },
          { roleId: adminRole._id }
        );
      }

      return role_arr;
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async InsertGlobalPermissions() {
    const { permissions } = await import('../rbac');

    let permissionArr = [];
    for (let i of permissions) {
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

  async InsertRolePermission(organizationId) {
    const { permissions } = await import('../rbac');

    const roles = await this.roleModel.find({ organizationId });

    const globalPermissions = await this.permissionModel
      .find()
      .sort({ id: 'ASC' });

    for (let permission of permissions) {
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

  async DeleteRole(roleIds) {
    // for (let i of roleIds.ids) {
    //   const [role] = await roleRepo.find({
    //     where: {
    //       id: i,
    //     },
    //   });
    //   const rolePermissions = await rolePermissionRepo.find({
    //     where: {
    //       roleId: i,
    //     },
    //   });
    //   if (rolePermissions.length > 0) {
    //     for (let i of rolePermissions) {
    //       await rolePermissionRepo.update(
    //         { id: i.id },
    //         { roleId: role.parentId }
    //       );
    //     }
    //   }
    //   await roleRepo.delete({ id: i });
    // }
    // return true;
  }

  async DeletePermission(permissionIds) {
    for (let i of permissionIds.ids) {
      //   await this.permissionModel.delete({ id: i });
    }

    return true;
  }
}
