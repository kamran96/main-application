import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { AuthService } from './auth.service';
import {
  IBaseUser,
  IRequest,
  IUser,
  IUserAccessControlResponse,
} from '@invyce/interfaces';

let data = {};
let staticContent;
if (process.env['NODE' + '_ENV'] === 'production') {
  // read from a file

  const pathToStaticContent = path.join(
    __dirname,
    '../../../vault/secrets/creds'
  );

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

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: (req) => {
        if (!req || !req.cookies) return null;
        data = {
          cookies: req.cookies,
        };
        return req.cookies['access_token'];
      },
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || staticContent.JWT_SECRET,
    });
  }

  async validate(payload: IBaseUser): Promise<IUser> {
    console.log('okkkk');
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
