import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';

export * from './lib/auth-middleware.module';

dotenv.config();

let token;
let host;
@Injectable()
export class Authenticate extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: (req) => {
        // if (process.env.NODE_ENV === 'development') {
        // const header = req.headers?.authorization?.split(' ')[1];
        // token = header;
        // return header;
        // } else if (process.env['NODE' + '_ENV'] === 'production') {
        if (!req || !req.cookies) return null;
        token = req.cookies['access_token'];
        host = req.headers.host;
        return req.cookies['access_token'];
        // }
      },

      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload) {
    try {
      // const type =
      // process.env.NODE_ENV === 'development' ? 'Authorization' : 'cookie';
      // const value =
      // process.env.NODE_ENV === 'development'
      // ? `Bearer ${token}`
      // : `access_token=${token}`;

      console.log(process.env['NODE' + '_ENV'], 'nodeenv');
      console.log('fetching');

      const user = await axios.post(
        process.env['NODE' + '_ENV'] === 'production'
          ? 'http://users.default.svc.cluster.local/users/auth/access-controll'
          : `https://localhost/users/auth/access-controll`,
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

// export const Http = async () => {
//   const type =
//     process.env.NODE_ENV === 'development' ? 'Authorization' : 'cookie';
//   const value =
//     process.env.NODE_ENV === 'development'
//       ? `Bearer ${token}`
//       : `access_token=${token}`;

//   return await axios.create({
//     baseURL: 'http://localhost',
//     headers: {
//       [type]: value,
//     },
//   });
// };
