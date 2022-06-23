import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import { Host } from '@invyce/global-constants';

export * from './lib/auth-middleware.module';

dotenv.config();

let token;
let host;
let staticContent;
if (process.env['NODE' + '_ENV'] === 'production') {
  // read from a file

  const pathToStaticContent = path.join(
    __dirname,
    '../../../vault/secrets/creds'
  );

  if (pathToStaticContent) {
    const staticContentFromVault = fs.readFileSync(
      path.join(pathToStaticContent),
      {
        encoding: 'utf8',
      }
    );

    // static Content
    const staticContentWithoutLineBreaks = staticContentFromVault.replace(
      /[\r\n]/gm,
      ''
    );
    const staticContentObj = `{${staticContentWithoutLineBreaks}}`;
    staticContent = JSON.parse(staticContentObj);
  }
}
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
      secretOrKey: process.env.JWT_SECRET || staticContent.JWT_SECRET,
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
