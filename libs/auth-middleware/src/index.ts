import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
    console.log('calling...');
    super({
      jwtFromRequest: (req) => {
        if (!req || !req.cookies) return null;
        console.log(req.cookies['access_token'], 'token');
        token = req.cookies['access_token'];
        host = req.headers.host;
        return req.cookies['access_token'];
      },

      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload) {
    try {
      console.log('calling api...');
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

      console.log(user?.data?.result, 'user');

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
