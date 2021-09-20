import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  Query,
  Body,
  HttpException,
  HttpStatus,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  PermissionDto,
  PermissionIdsDto,
  RoleDto,
  RoleIdsDto,
  RolePermissionDto,
} from '../dto/rbac.dto';
import { RbacService } from './rbac.service';

@Controller('rbac')
export class RbacController {
  constructor(private rbacService: RbacService) {}

  @Get('/module')
  async getModules(@Req() req: Request) {
    const modules = await this.rbacService.GetDistinctModule();

    if (modules) {
      return {
        message: 'Successfull',
        status: 1,
        result: modules,
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/role')
  async getRoles(@Req() req: Request) {
    const roles = await this.rbacService.GetRoles(req.user);

    if (roles) {
      return {
        message: 'Successfull',
        status: 1,
        result: roles,
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/test')
  async test(@Req() req: any) {
    await this.rbacService.InsertRoles(req.user.organizationId);
    await this.rbacService.InsertRolePermission(req.user.organizationId);

    return {
      message: 'Successfull.',
      status: 1,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/role/:id')
  async viewRole(@Req() req: Request, @Param() params) {
    const role = await this.rbacService.GetRole(params.id, req.user);

    if (role) {
      return {
        message: 'Successfull.',
        status: 1,
        result: role[0] || [],
      };
    }
  }

  @Get('/permission')
  async getPermission(@Req() req: Request, @Query() { page_no, page_size }) {
    const permission = await this.rbacService.GetPermissions(
      page_no,
      page_size
    );

    if (permission) {
      return {
        message: 'Successfull',
        pagination: permission.pagination,
        result: permission.permission,
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/permission/show')
  async showPermission(@Query() { type }, @Req() req: Request) {
    const permission = await this.rbacService.ShowPermission(type, req.user);
    if (permission) {
      return {
        message: 'Successfull',
        status: 1,
        result: permission,
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/role-with-permission')
  async roleWithPermission(@Req() req: Request) {
    const permission = await this.rbacService.GetRoleWithPermissions(req.user);
    if (permission) {
      return {
        message: 'Successfull',
        status: 1,
        result: permission,
      };
    }
  }

  // @UseGuards(JwtAuthGuard)
  @Post('role')
  async createRole(@Body() roleDto: RoleDto, @Req() req: Request) {
    try {
      const role = await this.rbacService.CreateRole(roleDto, req.user);

      if (role) {
        return {
          message: 'Role added successfully',
          result: role,
          status: 1,
        };
      }
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // @UseGuards(JwtAuthGuard)
  @Post('/role-permission')
  async addRolePermission(
    @Body() rolePermissionDto: RolePermissionDto,
    @Req() req: Request
  ) {
    // const role_permission = await this.rbacService.AddRolePermission(
    //   rolePermissionDto,
    //   req.user,
    // );
    // if (role_permission) {
    //   return {
    //     message: 'Successfull.',
    //     status: 1,
    //     result: role_permission,
    //   };
    // }
  }

  // @UseGuards(JwtAuthGuard)
  @Post('/permission')
  async createPermission(
    @Body() permissionDto: PermissionDto,
    @Req() req: Request
  ) {
    try {
      const permission = await this.rbacService.CreatePermission(
        permissionDto,
        req.user
      );

      if (permission) {
        return {
          message: 'Permission added Successfully',
          result: permission,
          status: 1,
        };
      }
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('/insert-permission')
  async insertGlobalPermissions(@Req() req: any) {
    const permission = await this.rbacService.InsertGlobalPermissions();

    if (permission) {
      return {
        message: 'successfull',
        status: 1,
        result: permission,
      };
    }
  }

  // @UseGuards(JwtAuthGuard)
  @Put('/role/delete')
  async deleteRole(@Body() roleIdsDto: RoleIdsDto) {
    const role = await this.rbacService.DeleteRole(roleIdsDto);

    // if (role) {
    //   return {
    //     message: 'Role deleted successfully.',
    //     status: 1,
    //   };
    // }
  }

  // @UseGuards(JwtAuthGuard)
  @Put('/permission/delete')
  async deletePermission(@Body() permissionIdsDto: PermissionIdsDto) {
    const permission = await this.rbacService.DeletePermission(
      permissionIdsDto
    );

    if (permission) {
      return {
        message: 'Permission deleted successfully.',
        status: 1,
      };
    }
  }
}
