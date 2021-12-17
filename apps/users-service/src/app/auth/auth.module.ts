import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User, UserSchema } from '../schemas/user.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserToken, UserTokenSchema } from '../schemas/userToken.schema';
import { AuthStrategy } from './auth.strategy';
// import { Authenticate } from '@invyce/auth-middleware';

@Module({
  controllers: [AuthController],
  imports: [
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: process.env.EXPIRES + 'h',
        },
      }),
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserToken.name, schema: UserTokenSchema },
    ]),
    ClientsModule.register([
      {
        name: 'EMAIL_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'email_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  providers: [AuthService, AuthStrategy],
  exports: [AuthService, AuthStrategy],
})
export class AuthModule {}
