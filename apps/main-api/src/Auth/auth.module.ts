import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '../local.strategy';
import { AuthService } from './auth.service';
import { EmailModule } from '../Common/modules/email.module';
import { AuthController } from './auth.controller';
import { JwtStrategy } from '../jwt.strategy';
import { jwtConstants } from '../constants';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '12h' },
    }),
    EmailModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
