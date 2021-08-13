import {
  GoneException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { EntityManager, getCustomRepository, In } from 'typeorm';
import { RolePermissions } from '../entities';
import { IPermission, IRole } from '../interfaces';
import {
  PermissionRepository,
  RolePermissionRepository,
  RoleRepository,
  UserRepository,
} from '../repositories';
import { Pagination } from '../Common/services/pagination.service';

enum RoleType {
  admin = 'admin',
  manager = 'manager',
  sales_man = 'sales-man',
}

@Injectable()
export class RbacService {
  constructor(private manager: EntityManager, private pagination: Pagination) {}

  async CreateRole(roleDto, roleData): Promise<any> {
    try {
      const roleRepo = getCustomRepository(RoleRepository);

      if (roleDto.isNewRecord === false) {
        // we need to update role

        const role = await this.GetRole(roleDto.id, roleData.organizationId);
        if (Array.isArray(role) && role.length > 0) {
          // const updatedRole = {...role}

          await roleRepo.update(
            { id: roleDto.id },
            { name: roleDto.name, description: roleDto.description },
          );
        }

        return await this.GetRole(roleDto.id, roleData.organizationId);
      } else {
        // we need to create a new role

        const role = await roleRepo.find({
          where: {
            name: roleDto.name,
            organizationId: roleData.organizationId,
          },
        });

        if (Array.isArray(role) && role.length > 0) {
          throw new HttpException(
            'Role already exists.',
            HttpStatus.BAD_REQUEST,
          );
        }

        const findAllRoles = await roleRepo.find({
          where: {
            organizationId: roleData.organizationId,
          },
        });

        const roleToUpdate = findAllRoles.find(r => r.level === roleDto.level);
        const parentRole = findAllRoles.filter(r => r.level > roleDto.level);

        const newRole = await roleRepo.save({
          name: roleDto.name,
          description: roleDto.description,
          level: roleDto.level,
          parentId: roleDto.parentId,
          organizationId: roleData.organizationId,
          status: 1,
        });

        await roleRepo.update(
          { id: roleToUpdate.id },
          { parentId: newRole.id, level: roleDto.level + 1 },
        );

        if (parentRole.length > 0) {
          for (let i of parentRole) {
            await roleRepo.update({ id: i.id }, { level: i.level + 1 });
          }
        }

        return newRole;
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async GetRole(roleId, organizationId) {
    const role = getCustomRepository(RoleRepository).find({
      where: {
        id: roleId,
        organizationId: organizationId,
      },
    });

    return role;
  }
  async CreatePermission(permissionDto, permissionData): Promise<IPermission> {
    try {
      const permissionRepo = getCustomRepository(PermissionRepository);

      const permission = await permissionRepo.save({
        title: permissionDto.title,
        description: permissionDto.description,
        module: permissionDto.module,
        organizationId: permissionData.organizationId,
        createdById: permissionData.userId,
        updatedById: permissionData.userId,
        status: 1,
      });

      const roles = await getCustomRepository(RoleRepository).find({
        where: {
          name: 'admin',
        },
      });

      for (let i of roles) {
        await getCustomRepository(RolePermissionRepository).save({
          roleId: i.id,
          permissionId: permission.id,
          organizationId: i.organizationId,
          hasPermission: true,
          status: 1,
        });
      }

      return permission;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async GetDistinctModule(user): Promise<any> {
    const permissionRepo = getCustomRepository(PermissionRepository);
    const module = await permissionRepo
      .createQueryBuilder()
      .select('module')
      .distinct(true)
      .getRawMany();

    return module;
  }

  async GetRoles(user): Promise<any> {
    const role = await this.manager.query(`
    with recursive ce as (
      select r.id as "roleId", r.name ,r."parentId" as parent, r.description
      from roles r
      where "organizationId"=${user.organizationId} and "parentId" is null
      union all
      select rl.id, rl.name, "parentId", rl.description from roles rl
       join ce on "roleId" = rl."parentId"
    )
    select * from ce`);

    return role;
  }

  async GetRoleWithPermissions(user) {
    const parentRoles = await this.manager.query(`
    with recursive ce as (
      select r.id as "rId", r.name as role, r."parentId" as parent
      from roles r
      where "organizationId"=${user.organizationId} and "parentId" is null
      union all
      select rl.id, name, "parentId" from roles rl
       join ce on "rId" = rl."parentId"
    )
    select * from ce`);

    const roles = await this.manager.query(`
          select r.id as "roleId", r.name as role, p.id as "permissionId", r."parentId", rp."hasPermission", p.title, p.description, p.module
          from roles r
          left join role_permissions rp on r.id = rp."roleId"
          left join permissions p on p.id = rp."permissionId"
          where rp."organizationId" = ${user.organizationId}
          order by rp.id asc
          `);

    const parentRole = parentRoles.map(r => r.role);
    return { parentRole, roles };
  }

  async GetPermissions(user, page_no, page_size): Promise<any> {
    const permissionRepo = getCustomRepository(PermissionRepository);
    const permission = await permissionRepo.find({
      where: {
        // organizationId: user.organizationId,
      },
      take: page_size || 20,
      skip: page_no || 0,
    });

    const pagination = await this.pagination.paginate(
      permission,
      page_size,
      page_no,
    );

    return {
      pagination,
      permission,
    };
  }

  async InsertRoles(organizationId, userId = null): Promise<any> {
    try {
      const { roles } = await import('../rbac');
      const roleRepo = getCustomRepository(RoleRepository);

      let role_arr = [];
      let level = 1;
      for (let i of roles) {
        const role = await roleRepo.save({
          name: i.name,
          organizationId,
          level: level++,
          status: 1,
        });
        role_arr.push(role);
      }

      for (let i of roles) {
        const parentRole = role_arr.find(r => r.name === i.parent);
        const role = role_arr.find(r => r.name === i.name);

        if (parentRole) {
          await roleRepo.update(
            { id: role.id },
            { name: role.name, parentId: parentRole.id },
          );
        }
      }

      if (userId) {
        const [user] = await getCustomRepository(UserRepository).find({
          where: { id: userId },
        });

        const [adminRole] = role_arr.filter(r => r.name === 'admin');

        await getCustomRepository(UserRepository).update(
          { id: user.id },
          { roleId: adminRole.id },
        );
      }

      return role_arr;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async InsertGlobalPermissions() {
    const { permissions } = await import('../rbac');
    const permissionRepo = getCustomRepository(PermissionRepository);

    let permissionArr = [];
    for (let i of permissions) {
      const permission = await permissionRepo.save({
        title: i.title,
        description: i.description,
        module: i.module,
        // organizationId: organizationId,
        status: 1,
      });

      permissionArr.push(permission);
    }
    return permissionArr;
  }

  async InsertRolePermission(organizationId) {
    const { permissions } = await import('../rbac');

    const permissionRepo = getCustomRepository(PermissionRepository);
    const roleRepo = getCustomRepository(RoleRepository);
    const rolePermissionRepo = getCustomRepository(RolePermissionRepository);

    const roles = await roleRepo.find({ where: { organizationId } });

    const globalPermissions = await permissionRepo.find({
      order: {
        id: 'ASC',
      },
    });

    for (let permission of permissions) {
      const pId = globalPermissions.find(
        gp => gp.description === permission.description,
      );
      const roleId = roles.find(r => r.name === permission.roles[0]);

      await rolePermissionRepo.save({
        roleId: roleId.id,
        permissionId: pId.id,
        organizationId,
        hasPermission: true,
        status: 1,
      });
    }
  }

  async FilterRole(roles, role_type) {
    const [role] = roles.filter(r => r.name == role_type);
    return role;
  }

  async DeleteRole(roleIds) {
    const roleRepo = getCustomRepository(RoleRepository);
    const rolePermissionRepo = getCustomRepository(RolePermissionRepository);

    for (let i of roleIds.ids) {
      const [role] = await roleRepo.find({
        where: {
          id: i,
        },
      });

      const rolePermissions = await rolePermissionRepo.find({
        where: {
          roleId: i,
        },
      });

      if (rolePermissions.length > 0) {
        for (let i of rolePermissions) {
          await rolePermissionRepo.update(
            { id: i.id },
            { roleId: role.parentId },
          );
        }
      }

      await roleRepo.delete({ id: i });
    }

    return true;
  }

  async DeletePermission(permissionIds) {
    const permissionRepo = getCustomRepository(PermissionRepository);

    for (let i of permissionIds.ids) {
      await permissionRepo.delete({ id: i });
    }

    return true;
  }

  async ShowPermission(type, user) {
    const roles = await this.manager.query(`
    select r.id as "roleId", r.name as role, p.id as "permissionId", r."parentId", rp."hasPermission", rp.id as "rolePermissionId", p.title, p.description, p.module
    from roles r
    left join role_permissions rp on r.id = rp."roleId"
    left join permissions p on p.id = rp."permissionId"
    where p.module = '${type}'
    and rp."organizationId" = ${user.organizationId}
    order by rp.id asc
    `);

    // const parentRoles = await this.manager.query(`
    // with recursive ce as (
    //   select r.id as "roleId", r.name ,r."parentId" as parent
    //   from roles r
    //   where "organizationId"=${user.organizationId} and "parentId" is null
    //   union all
    //   select rl.id, rl.name, "parentId" from roles rl
    //    join ce on "roleId" = rl."parentId"
    // )
    // select * from ce`);

    // const parentRole = parentRoles.map(r => r.name);
    return roles;
  }

  async AddRolePermission(data, user) {
    const rolePermissionRepo = getCustomRepository(RolePermissionRepository);
    // const rolePermission = await rolePermissionRepo.save({
    //   roleId: data.roleId,
    //   permissionId: data.permissionId,
    //   hasPermission: data.hasPermission,
    //   organizationId: user.organizationId,
    // });

    await this.manager.update(
      RolePermissions,
      { id: data.rolePermissionId },
      {
        roleId: data.roleId,
        permissionId: data.permissionId,
        hasPermission: data.hasPermission,
        organizationId: user.organizationId,
        status: 1,
      },
    );

    const [rolePermission] = await rolePermissionRepo.find({
      where: {
        id: data.rolePermissionId,
      },
    });

    return rolePermission;
  }
}
