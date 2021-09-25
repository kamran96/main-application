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
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InvitedUser } from '../dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async index(@Req() req: Request, @Query() query) {
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
  async show(@Param() params) {
    const user = await this.userService.FindUserById(params.id);

    if (user) {
      return {
        message: 'User fetched successfully.',
        status: true,
        result: user,
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('invite')
  async inviteUsers(@Body() userDto, @Req() req: Request) {
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
  async resendInvitation(@Body() userDto: InvitedUser, @Req() req: Request) {
    try {
      const user = await this.userService.ResendInvitation(userDto, req.user);

      if (user) {
        return {
          message: 'Invitation send successfully.',
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

  @Post('/verify-invited-user')
  async verifyInvitedUser(@Body() body) {
    try {
      const user = await this.userService.VerifyInvitedUser(body);

      if (user) {
        return {
          message: 'User verified successfully.',
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

  @Put('/update-invited-user/:id')
  async updateVerifiedUser(
    @Body() userDto: InvitedUser,
    @Param() params,
    @Res() res: Response
  ) {
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
