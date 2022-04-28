import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  IBaseUser,
  IRequest,
  IUser,
  IUserAccessControlResponse,
} from '@invyce/interfaces';
import e = require('express');

let data = {};
@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: (req) => {
        // if (process.env['NODE' + '_ENV'] === 'development') {
        //   const header = req.headers?.authorization?.split(' ')[1];
        //   data = {
        //     headers: req.headers,
        //     cookies: null,
        //   };
        //   return header;
        // } else if (process.env['NODE' + '_ENV'] === 'production') {
        if (!req || !req.cookies) return null;
        data = {
          cookies: req.cookies,
          headers: null,
        };
        return req.cookies['access_token'];
        // }
      },
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: IBaseUser): Promise<IUser> {
    try {
      const newData = { ...data, user: payload };
      const user: IUserAccessControlResponse =
        await this.authService.AccessControll(newData as IRequest);

      if (user?.statusCode === HttpStatus.OK) {
        return user?.user;
      }

      if (user?.statusCode === HttpStatus.FORBIDDEN) {
        throw new HttpException(user?.message, user?.statusCode);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
