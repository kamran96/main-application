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
import { InvitedUser, ProfileDto, UserIdsDto } from '../dto/user.dto';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('test-task')
  async test() {
    await this.userService.testTask();
  }
  @UseGuards(JwtAuthGuard)
  @Get()
  async index(@Req() req: Request, @Query() { take, page_no, sort, query }) {
    try {
      const user = await this.userService.ListUser(
        req.user,
        take,
        page_no,
        sort,
        query,
      );

      if (user) {
        return {
          message: 'user fetched successfully.',
          result: user.item,
          pagination: user.pagination,
        };
      }
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async View(@Param() params, @Req() req: Request) {
    try {
      const user = await this.userService.FindUserById(params, req.user);

      if (user) {
        return {
          message: 'user fetched successfully.',
          result: user[0],
        };
      }

      throw new HttpException('Failed to get User', HttpStatus.BAD_REQUEST);
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  async createUserProfile(@Req() req: Request, @Body() profileDto: ProfileDto) {
    try {
      const profile = await this.userService.UpdateProfile(
        req.user,
        profileDto,
      );

      if (profile) {
        return {
          message: 'Profile updated successfully',
          result: profile,
        };
      }
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
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
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('/update-invited-user/:id')
  async updateVerifiedUser(@Body() userDto: InvitedUser, @Param() params) {
    try {
      const user = await this.userService.UpdateInvitedUser(userDto, params);

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
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async remove(@Body() userDto: UserIdsDto) {
    try {
      const user = await this.userService.DeleteUser(userDto);

      if (user) {
        return {
          message: 'Resource modified successfully.',
          status: 1,
        };
      }

      throw new HttpException('Failed to get Users', HttpStatus.BAD_REQUEST);
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/packages')
  async insertPackages() {
    const paywall = await this.userService.InsertPackages();

    if (paywall) {
      return {
        message: 'Successfull',
        status: true,
      };
    }
  }

  @Post('/currency')
  async insertCurrency() {
    const currency = await this.userService.InsertCurrencies();

    if (currency) {
      return {
        message: 'Successfull',
        status: true,
      };
    }
  }
}
