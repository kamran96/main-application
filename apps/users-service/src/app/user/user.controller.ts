import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { IPage, IRequest, IUserWithResponse } from '@invyce/interfaces';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ParamsDto } from '../dto/rbac.dto';
import {
  InvitedUserDetailDto,
  InvitedUserDto,
  SendCodeDto,
  UserThemeDto,
} from '../dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async index(
    @Req() req: IRequest,
    @Query() query: IPage
  ): Promise<IUserWithResponse> {
    const user = await this.userService.ListUsers(req.user, query);

    if (user) {
      return {
        message: 'User fetched successfully.',
        status: true,
        result: user.users,
        pagination: user.pagination,
      };
    }
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async show(
    @Param() params: ParamsDto,
    @Req() req: IRequest
  ): Promise<IUserWithResponse> {
    try {
      const user = await this.userService.FindUserById(params.id, req);

      if (user) {
        return {
          message: 'User fetched successfully.',
          status: true,
          result: user,
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
  @Post('invite')
  async inviteUsers(
    @Body() userDto: InvitedUserDto,
    @Req() req: IRequest
  ): Promise<IUserWithResponse> {
    try {
      const user = this.userService.InviteUserToOrganization(userDto, req.user);

      if (user) {
        return {
          message: 'successfull.',
          status: true,
        };
      }
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('/resend-invitation')
  @UseGuards(JwtAuthGuard)
  async resendInvitation(
    @Body() userDto: InvitedUserDetailDto,
    @Req() req: IRequest
  ): Promise<IUserWithResponse> {
    try {
      const user = await this.userService.ResendInvitation(userDto, req.user);

      if (user !== undefined) {
        return {
          message: 'Invitation send successfully.',
          status: true,
        };
      }
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('/verify-invited-user')
  async verifyInvitedUser(
    @Body() body: SendCodeDto
  ): Promise<IUserWithResponse> {
    try {
      const user = await this.userService.VerifyInvitedUser(body);

      if (user) {
        return {
          message: 'User verified successfully.',
          result: user,
          status: true,
        };
      }
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('update-theme')
  @UseGuards(JwtAuthGuard)
  async updateTheme(
    @Body() body: UserThemeDto,
    @Req() req: IRequest
  ): Promise<IUserWithResponse> {
    const user = await this.userService.UpdateTheme(body, req.user);

    if (user !== undefined) {
      return {
        message: 'Updated theme successfully.',
        status: true,
      };
    }
  }

  @Put('profile/:id')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Body() userDto: InvitedUserDetailDto,
    @Param() params: ParamsDto,
    @Res() res: Response
  ): Promise<IUserWithResponse> {
    try {
      const user = await this.userService.UpdateUserProfile(
        userDto,
        params,
        res
      );

      if (user) {
        return {
          message: 'User updated successfully.',
          result: user,
          status: true,
        };
      }
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put('/update-invited-user/:id')
  @UseGuards(JwtAuthGuard)
  async updateVerifiedUser(
    @Body() userDto: InvitedUserDetailDto,
    @Param() params: ParamsDto,
    @Res() res: Response
  ): Promise<IUserWithResponse> {
    try {
      const user = await this.userService.UpdateInvitedUser(
        userDto,
        params,
        res
      );

      if (user) {
        return {
          message: 'User updated successfully.',
          result: user,
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
}
