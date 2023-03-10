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
import { MQ_HOST } from '@invyce/global-constants';
import { JWT_SECRET, EXPIRES } from '../app.module';

@Module({
  controllers: [AuthController],
  imports: [
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret:
          JWT_SECRET !== undefined
            ? JWT_SECRET
            : configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: EXPIRES ? EXPIRES + 'h' : process.env.EXPIRES + 'h',
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
          urls: [MQ_HOST()],
          queue: 'email_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    ClientsModule.register([
      {
        name: 'REPORT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'report_queue',
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
