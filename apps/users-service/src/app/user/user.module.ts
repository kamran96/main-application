import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import { UserToken, UserTokenSchema } from '../schemas/userToken.schema';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserToken.name, schema: UserTokenSchema },
    ]),
  ],
  providers: [UserService],
})
export class UserModule {}
