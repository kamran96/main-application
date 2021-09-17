import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AuthService } from '../auth/auth.service';
import { User } from '../schemas/user.schema';
import { UserToken } from '../schemas/userToken.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel,
    @InjectModel(UserToken.name) private userToken,
    private authService: AuthService
  ) {}

  async FindUserById(userId) {
    return await this.userModel
      .findOne({
        _id: userId,
      })
      .populate('role')
      .populate('organization')
      .populate('branch');
  }
}
