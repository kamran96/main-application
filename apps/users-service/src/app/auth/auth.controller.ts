import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import { UserLoginDto, UserRegisterDto } from '../dto/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  async Login(@Body() authDto: UserLoginDto) {
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

  @Post()
  async Register(@Body() authDto: UserRegisterDto) {
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
}
