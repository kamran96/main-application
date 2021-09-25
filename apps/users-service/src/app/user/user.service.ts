import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { AuthService } from '../auth/auth.service';
import { User } from '../schemas/user.schema';
import { UserToken } from '../schemas/userToken.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel,
    @InjectModel(UserToken.name) private userToken,
    @Inject('EMAIL_SERVICE') private readonly emailService: ClientProxy,

    private authService: AuthService
  ) {}

  async ListUsers(user, query) {
    const { page_size, page_no, filters, purpose } = query;
    let users;

    if (purpose === 'ALL') {
      users = await this.userModel
        .find({
          status: 1,
          organizationId: user.organizationId,
          // branchId: user.branchId,
        })
        .populate('role')
        .populate('organization')
        .populate('branch');
    } else {
      if (filters) {
        const filterData: any = Buffer.from(filters, 'base64').toString();
        const data = JSON.parse(filterData);

        for (let i in data) {
          if (data[i].type === 'search') {
            const val = data[i].value?.split('%')[1];
            users = await this.userModel.find({
              status: 1,
              organizationId: user.organizationId,
              [i]: { $regex: val },
            });
          } else if (data[i].type === 'date-between') {
            const start_date = i[1]['value'][0];
            const end_date = i[1]['value'][1];
            users = await this.userModel.find({
              status: 1,
              organizationId: user.organizationId,
              [i]: { $gt: start_date, $lt: end_date },
            });
          } else if (data[i].type === 'compare') {
            users = await this.userModel.find({
              status: 1,
              organization: user.organizationId,
              [i]: { $in: i[1]['value'] },
            });
          } else if (data[i].type === 'in') {
            users = await this.userModel.find({
              status: 1,
              organization: user.organizationId,
              [i]: { $in: i[1]['value'] },
            });
          }
        }
      } else {
        const myCustomLabels = {
          docs: 'users',
          totalDocs: 'total',
          limit: 'page_size',
          page: 'page_no',
          nextPage: 'next',
          prevPage: 'prev',
          totalPages: 'total_pages',
          pagingCounter: 'page_no',
          meta: 'pagination',
        };

        users = await this.userModel.paginate(
          { status: 1, organizationId: user.organizationId },
          {
            offset: page_no * page_size - page_size,
            limit: page_size,
            populate: ['role', 'organization', 'branch'],
            customLabels: myCustomLabels,
          }
        );
      }
    }

    return users;
  }

  async FindUserById(userId) {
    return await this.userModel
      .findOne({
        _id: userId,
      })
      .populate('role')
      .populate('organization')
      .populate('branch');
  }

  async InviteUserToOrganization(userDto, userData) {
    const { users } = userDto;

    let insertedUser;
    for (let user of users) {
      const dbUser = await this.userModel.find({
        email: user.email,
        organizationId: userData.organizationId,
      });

      if (dbUser.length === 0) {
        insertedUser = {
          username: user.username,
          email: user.email,
          password: '',

          roleId: user.roleId,
          branchId: user.branchId,
          fullName: user.fullname,
          country: user.country,
          phoneNumber: user.phoneNumber,
        };
        await this.authService.AddUser(
          insertedUser,
          userData.organizationId,
          'email'
        );
      }
    }

    return true;
  }

  async ResendInvitation(data, user) {
    const dbUser = await this.userModel.findOne({
      email: data.email,
      organizationId: user.organizationId,
    });

    await this.authService.sendVerificationEmail(dbUser);
    return true;
  }

  async VerifyInvitedUser(body) {
    try {
      const string = Buffer.from(body.code, 'base64').toString('ascii');
      const data = JSON.parse(string);

      let user_arr = [];
      if (data) {
        const { user: user_id } = data;

        const [user] = await this.userModel
          .find({
            _id: user_id,
          })
          .populate('role')
          .populate('organization')
          .populate('branch');

        if (user?.isVerified === true && user?.username !== null) {
          throw new HttpException(
            'User aleady registered please contact your admin.',
            HttpStatus.BAD_REQUEST
          );
        } else {
          user_arr.push(user);
        }
      }

      return user_arr[0];
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async UpdateInvitedUser(userDto, params, res) {
    try {
      const { username, fullName, country, phoneNumber, password } = userDto;

      await this.userModel.updateOne(
        { _id: params.id },
        {
          username,
          password: bcrypt.hashSync(password),
          isVerified: true,
          $set: {
            'profile.fullName': fullName,
            'profile.country': country,
            'profile.phoneNumber': phoneNumber,
          },
        }
      );

      const new_user = await this.authService.CheckUser({
        username,
      });

      const user = await this.authService.Login(new_user, res);

      return user;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
