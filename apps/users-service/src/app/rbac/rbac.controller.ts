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
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  PermissionDto,
  PermissionIdsDto,
  RoleDto,
  RoleIdsDto,
  RolePermissionDto,
  ParamsDto,
} from '../dto/rbac.dto';
import {
  IRequest,
  IPermissionResponse,
  IRolePermissionWithResponse,
  IRoleWithParentWithResponse,
  IRoleWithResponse,
  IPage,
} from '@invyce/interfaces';
import { RbacService } from './rbac.service';

@Controller('rbac')
export class RbacController {
  constructor(private rbacService: RbacService) {}

  @Get('index-permissions')
  @UseGuards(JwtAuthGuard)
  async indexPermission(@Query() query: IPage): Promise<IPermissionResponse> {
    const permission = await this.rbacService.IndexPermissions(query);

    if (permission) {
      return {
        message: 'Permissions fetched successfull',
        status: 1,
        pagination: permission.pagination,
        result: permission.result,
      };
    }
  }

  @Get('/module')
  @UseGuards(JwtAuthGuard)
  async getModules(): Promise<IPermissionResponse> {
    const modules = await this.rbacService.GetDistinctModule();

    if (modules) {
      return {
        message: 'Successfull',
        status: 1,
        result: modules,
      };
    }
  }

  @Get('/role')
  @UseGuards(JwtAuthGuard)
  async getRoles(@Req() req: IRequest): Promise<IRoleWithResponse> {
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
  async test(@Req() req: IRequest): Promise<IRoleWithResponse> {
    await this.rbacService.InsertRoles(req.user.organizationId);
    await this.rbacService.InsertRolePermission(req.user.organizationId);

    return {
      message: 'Successfull.',
      status: 1,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/role/:id')
  async viewRole(@Param() params: ParamsDto): Promise<IRoleWithResponse> {
    const role = await this.rbacService.GetRole(params.id);

    if (role) {
      return {
        message: 'Successfull.',
        status: 1,
        result: role,
      };
    }
  }

  // @Get('/permission')
  // async getPermission(@Query() query: PageDto) {
  //   const permission = await this.rbacService.GetPermissions(
  //     query
  //   );

  //   if (permission) {
  //     return {
  //       message: 'Successfull',
  //       pagination: permission.pagination,
  //       result: permission.permission,
  //     };
  //   }
  // }

  @UseGuards(JwtAuthGuard)
  @Get('/permission/show')
  async showPermission(
    @Query() { type },
    @Req() req: IRequest
  ): Promise<IPermissionResponse> {
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
  async roleWithPermission(
    @Req() req: IRequest
  ): Promise<IRoleWithParentWithResponse> {
    const permission = await this.rbacService.GetRoleWithPermissions(req.user);

    if (permission) {
      return {
        message: 'Successfull',
        status: 1,
        result: permission,
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('role')
  async createRole(
    @Body() roleDto: RoleDto,
    @Req() req: IRequest
  ): Promise<IRoleWithResponse> {
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

  @UseGuards(JwtAuthGuard)
  @Post('/role-permission')
  async addRolePermission(
    @Body() rolePermissionDto: RolePermissionDto,
    @Req() req: IRequest
  ): Promise<IRolePermissionWithResponse> {
    const role_permission = await this.rbacService.AddRolePermission(
      rolePermissionDto,
      req.user
    );
    if (role_permission) {
      return {
        message: 'Successfull.',
        status: 1,
        result: role_permission,
      };
    }
  }

  @Post('/permission')
  @UseGuards(JwtAuthGuard)
  async createPermission(
    @Body() permissionDto: PermissionDto,
    @Req() req: IRequest
  ): Promise<IPermissionResponse> {
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
  async insertGlobalPermissions(): Promise<IPermissionResponse> {
    const permission = await this.rbacService.InsertGlobalPermissions();

    if (permission) {
      return {
        message: 'successfull',
        status: 1,
        result: permission,
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('/role/delete')
  async deleteRole(@Body() roleIdsDto: RoleIdsDto): Promise<IRoleWithResponse> {
    const role = await this.rbacService.DeleteRole(roleIdsDto);

    if (role) {
      return {
        message: 'Role deleted successfully.',
        status: 1,
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('/permission/delete')
  async deletePermission(
    @Body() permissionIdsDto: PermissionIdsDto
  ): Promise<IPermissionResponse> {
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
