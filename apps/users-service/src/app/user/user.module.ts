import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { MQ_HOST } from '@invyce/global-constants';
import { AuthModule } from '../auth/auth.module';
import { User, UserSchema } from '../schemas/user.schema';
import { UserToken, UserTokenSchema } from '../schemas/userToken.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthStrategy } from '../auth/auth.strategy';
import { Branch, BranchSchema } from '../schemas/branch.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserToken.name, schema: UserTokenSchema },
      { name: Branch.name, schema: BranchSchema },
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
    AuthModule,
  ],
  providers: [UserService, AuthStrategy],
  controllers: [UserController],
})
export class UserModule {}
