import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  ForgetPasswordDto,
  PasswordDto,
  UserLoginDto,
  UserRegisterDto,
} from '../dto/user.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  async Login(
    @Body() authDto: UserLoginDto,
    @Res() res: Response,
    @Req() req: Request
  ) {
    try {
      await this.authService.ValidateUser(authDto, res);
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('/register')
  async Register(@Body() authDto: UserRegisterDto, @Res() res: Response) {
    try {
      const users = await this.authService.CheckUser(authDto);
      if (Array.isArray(users) && users.length > 0) {
        throw new HttpException(
          'Username has already being taken. Please try again with an alternate username.',
          HttpStatus.BAD_REQUEST
        );
      }
      await this.authService.AddUser(authDto);
      const user = await this.authService.ValidateUser(authDto, res);
      if (user) {
        return {
          message: 'Successfull',
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
  @Post('access-controll')
  async access(@Body() body, @Req() req: Request) {
    try {
      const user = await this.authService.AccessControll(body, req);

      if (user) {
        return {
          result: user,
        };
      }
      throw new HttpException('Authentication Falied', HttpStatus.BAD_REQUEST);
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/check')
  async check(@Req() req: Request) {
    try {
      const user = await this.authService.Check(req);

      if (user) {
        return {
          message: 'Validated successfully',
          status: true,
          result: user.user,
          token: user.token,
        };
      }
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('/resend-otp')
  async resendOtp(@Body() body) {
    try {
      const user: any = this.authService.ResendOtp(body);

      if (user) {
        return {
          message: 'Successfull',
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

  @Post('logout')
  async logout(@Res() res: Response) {
    // res.setHeader('Set-Cookie', await this.authService.Logout());
    return await this.authService.Logout(res);
  }

  @Post('/forget-password')
  async forgetPassword(@Body() userDto: ForgetPasswordDto): Promise<any> {
    try {
      const user: any = this.authService.ForgetPassword(userDto);

      if (user) {
        return {
          message: 'Successfull',
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

  @Post('/change-password')
  async changePassword(@Body() userDto: PasswordDto): Promise<any> {
    try {
      const { password, confirmPassword } = userDto;

      if (password && confirmPassword && password === confirmPassword) {
        const user = await this.authService.ChangePassword(userDto);

        if (user) {
          return {
            message: 'Successfull',
            result: user,
          };
        }
      }
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('verify-otp')
  async verifyOtp(@Body() body) {
    try {
      // const user = await this.authService.VerifyOtp(body);
      // if (user.status === true) {
      //   return {
      //     message: 'You have been successfully registered',
      //     status: true,
      //   };
      // } else {
      //   throw new HttpException(
      //     'Verification code is incorrect, Click on resend to generate new verification code.',
      //     HttpStatus.BAD_REQUEST,
      //   );
      // }
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
