import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NestMiddleware,
} from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { Host } from '@invyce/global-constants';
import { IRequest } from '@invyce/interfaces';
import { NextFunction, Response } from 'express';

export * from './lib/auth-middleware.module';

dotenv.config();

let host;
@Injectable()
export class Authenticate implements NestMiddleware {
  async use(req: IRequest, res: Response, next: NextFunction) {
    try {
      const token = req.cookies['access_token'];

      if (!token) {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }

      const user = await axios.post(
        Host('users', 'users/auth/access-controll'),
        {
          service: host,
        },
        {
          headers: {
            cookie: `access_token=${token}`,
          },
        }
      );

      if (user?.data?.result?.statusCode === HttpStatus.OK) {
        req.user = user?.data?.result?.user;
        next();
      }

      if (user?.data?.result?.statusCode === HttpStatus.FORBIDDEN) {
        throw new HttpException(
          user?.data?.result?.message,
          user?.data?.result?.statusCode
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
