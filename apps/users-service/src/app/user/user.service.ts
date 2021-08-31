import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { UserToken } from '../schemas/userToken.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel,
    @InjectModel(UserToken.name) private userToken
  ) {}
}
