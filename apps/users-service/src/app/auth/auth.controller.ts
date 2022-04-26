import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ForgetPasswordDto,
  PasswordDto,
  SendOtp,
  UserLoginDto,
  UserRegisterDto,
} from '../dto/user.dto';
import { AuthService } from './auth.service';
import { GlobalAuthGuard } from '@invyce/global-auth-guard';
import {
  IUser,
  IRequest,
  IUserCheck,
  IUserWithResponse,
  IUserWithResponseAndStatus,
} from '@invyce/interfaces';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  async Login(
    @Body() authDto: UserLoginDto,
    @Res() res: Response
  ): Promise<void> {
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
  async Register(
    @Body() authDto: UserRegisterDto,
    @Res() res: Response
  ): Promise<IUser | IUserWithResponse> {
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

  @UseGuards(GlobalAuthGuard)
  @Post('access-controll')
  async access(@Req() req: IRequest): Promise<IUserWithResponseAndStatus> {
    try {
      const user = await this.authService.AccessControll(req);

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

  @Get('/check')
  @UseGuards(GlobalAuthGuard)
  async check(@Req() req: IRequest): Promise<IUserCheck> {
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

  @UseGuards(GlobalAuthGuard)
  @Post('/resend-otp')
  async resendOtp(@Body() body: SendOtp): Promise<void> {
    try {
      return this.authService.ResendOtp(body);
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @UseGuards(GlobalAuthGuard)
  @Post('logout')
  async logout(@Res() res: Response): Promise<Response> {
    return this.authService.Logout(res);
  }

  @UseGuards(GlobalAuthGuard)
  @Post('/forget-password')
  async forgetPassword(@Body() userDto: ForgetPasswordDto) {
    try {
      return this.authService.ForgetPassword(userDto);
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // @UseGuards(GlobalAuthGuard)
  @Post('/change-password')
  async changePassword(
    @Body() userDto: PasswordDto
  ): Promise<IUserWithResponse> {
    try {
      const { password, confirmPassword } = userDto;

      if (password && confirmPassword && password === confirmPassword) {
        const user = await this.authService.ChangePassword(userDto);

        if (user) {
          return {
            message: 'Successfull',
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

  @Post('/google-login')
  async googleLogin(@Body() data, @Res() res: Response) {
    return this.authService.GoogleLogin(data, res);
  }

  @UseGuards(GlobalAuthGuard)
  @Post('/request-change')
  async changeEmailOtp(@Body() data, @Req() req: IRequest) {
    return this.authService.ChangeEmailOtp(data, req.user);
  }

  @UseGuards(GlobalAuthGuard)
  @Post('verify-otp')
  async verifyOtp(@Body() body: SendOtp): Promise<IUserWithResponse> {
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

  @UseGuards(GlobalAuthGuard)
  @Post('request-change-verify')
  async requestChangeVerify(@Body() body: SendOtp): Promise<IUserWithResponse> {
    return this.authService.RequestChangeVerify(body);
  }

  @UseGuards(GlobalAuthGuard)
  @Post('/gen-authenticator')
  async GoogleAuthenticator(): Promise<unknown> {
    return this.authService.GenerateGoogleAuthenticatorToken();
  }

  @UseGuards(GlobalAuthGuard)
  @Post('/authenticator')
  async verifyGoogleAuthenticatorToken(
    @Body() body,
    @Req() req: IRequest
  ): Promise<unknown> {
    const resp = await this.authService.VerifyGoogleAuthenticatorToken(
      body,
      req.user
    );

    if (resp === true) {
      return {
        message: 'Successfull added',
        status: true,
      };
    } else {
      throw new HttpException('Authentication Failed', HttpStatus.BAD_REQUEST);
    }
  }
}
