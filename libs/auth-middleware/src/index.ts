export * from './lib/auth-middleware.module';

import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';

require('dotenv').config();

let token;
let host;
@Injectable()
export class Authenticate extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: (req) => {
        if (!req || !req.cookies) return null;
        token = req.cookies['access_token'];
        host = req.headers.host;
        return req.cookies['access_token'];
      },

      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload): Promise<any> {
    try {
      const user = await axios.post(
        'http://localhost/users/auth/access-controll',
        {
          ...payload,
          service: host,
        },
        {
          headers: {
            cookie: `access_token=${token}`,
          },
        }
      );

      if (user?.data?.result?.statusCode === HttpStatus.OK) {
        return user?.data?.result?.user;
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
