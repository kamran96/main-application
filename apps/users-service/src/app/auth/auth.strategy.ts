import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

let data = {};
let token;
@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: (req) => {
        if (process.env.NODE_ENV === 'development') {
          const header = req.headers?.authorization?.split(' ')[1];
          data = {
            headers: req.headers,
            cookies: null,
          };
          return header;
        } else {
          if (!req || !req.cookies) return null;
          token = req.cookies['access_token'];
          data = {
            cookies: req.cookies,
            headers: null,
          };
          return req.cookies['access_token'];
        }
      },
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any): Promise<any> {
    const newData = { ...data, user: payload };
    const user = await this.authService.AccessControll('', newData);

    if (user?.statusCode === HttpStatus.OK) {
      return user?.user;
    }

    if (user?.statusCode === HttpStatus.FORBIDDEN) {
      throw new HttpException(user?.message, user?.statusCode);
    }
  }
}