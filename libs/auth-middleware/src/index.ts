import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { Host } from '@invyce/global-constants';

export * from './lib/auth-middleware.module';

dotenv.config();

let token;
let host;
@Injectable()
export class Authenticate extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: (req) => {
        console.log(process.env.JWT_SECRET, 'SECRET');
        if (!req || !req.cookies) return null;
        token = req.cookies['access_token'];
        host = req.headers.host;
        return req.cookies['access_token'];
      },

      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload) {
    const user = await axios.post(
      Host('users', 'users/auth/access-controll'),
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
  }
}
