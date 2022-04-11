import {
  Controller,
  HttpCode,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Req,
} from '@nestjs/common';
import {
  ForgetPasswordDto,
  PasswordDto,
  UserLoginDto,
  UserRegisterDto,
} from '../dto/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  async login(@Body() authDto: UserLoginDto) {
    try {
      const user: any = await this.authService.ValidateUser(authDto);

      return {
        message: 'Login Successfull.',
        result: user,
      };
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @HttpCode(201)
  @Post('register')
  async register(@Body() authDto: UserRegisterDto) {
    try {
      const users = await this.authService.CheckUser(authDto);
      if (Array.isArray(users) && users.length > 0) {
        throw new HttpException(
          'Username has already being taken. Please try again with an alternate username.',
          HttpStatus.BAD_REQUEST
        );
      }
      await this.authService.AddUser(authDto);
      const user = await this.authService.ValidateUser(authDto);
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
      const user = await this.authService.VerifyOtp(body);

      if (user.status === true) {
        return {
          message: 'You have been successfully registered',
          status: true,
        };
      } else {
        throw new HttpException(
          'Verification code is incorrect, Click on resend to generate new verification code.',
          HttpStatus.BAD_REQUEST
        );
      }
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
