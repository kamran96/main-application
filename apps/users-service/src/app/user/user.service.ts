import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import * as Moment from 'moment';
import axios from 'axios';
import { AuthService } from '../auth/auth.service';
import { User } from '../schemas/user.schema';
import { UserToken } from '../schemas/userToken.schema';
import { IBaseUser, IPage, IRequest, IUser } from '@invyce/interfaces';
import { ParamsDto } from '../dto/rbac.dto';
import {
  InvitedUserDto,
  InvitedUserDetailDto,
  UserLoginDto,
  UserThemeDto,
  SendCodeDto,
  UserIdsDto,
} from '../dto/user.dto';
import { Response } from 'express';
import { UserStatuses } from '@invyce/global-constants';
import { SEND_FORGOT_PASSWORD } from '@invyce/send-email';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel,
    @InjectModel(UserToken.name) private userToken,
    @Inject('EMAIL_SERVICE') private readonly emailService: ClientProxy,

    private authService: AuthService
  ) {}

  async ListUsers(user: IBaseUser, query: IPage) {
    const { page_size, page_no, filters, purpose } = query;
    const ps: number = parseInt(page_size);
    const pn: number = parseInt(page_no);

    let users;

    if (purpose === 'ALL') {
      users = await this.userModel
        .find({
          status: UserStatuses.ACTIVE,
          organizationId: user.organizationId,
          branchId: user.branchId,
        })
        .populate('role')
        .populate('organization')
        .populate('branch');
    } else {
      if (filters) {
        const filterData = Buffer.from(filters, 'base64').toString();
        const data = JSON.parse(filterData);

        for (const i in data) {
          if (data[i].type === 'search') {
            const val = data[i].value?.split('%')[1];
            users = await this.userModel.find({
              status: UserStatuses.ACTIVE,
              organizationId: user.organizationId,
              [i]: { $regex: val },
            });
          } else if (data[i].type === 'date-between') {
            const start_date = i[1]['value'][0];
            const end_date = i[1]['value'][1];
            users = await this.userModel.find({
              status: UserStatuses.ACTIVE,
              organizationId: user.organizationId,
              [i]: { $gt: start_date, $lt: end_date },
            });
          } else if (data[i].type === 'compare') {
            users = await this.userModel.find({
              status: UserStatuses.ACTIVE,
              organization: user.organizationId,
              [i]: { $in: i[1]['value'] },
            });
          } else if (data[i].type === 'in') {
            users = await this.userModel.find({
              status: UserStatuses.ACTIVE,
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
          meta: 'pagination',
        };

        users = await this.userModel.paginate(
          { status: UserStatuses.ACTIVE, organizationId: user.organizationId },
          {
            offset: pn * ps - ps,
            limit: ps,
            populate: ['role', 'organization', 'branch'],
            customLabels: myCustomLabels,
          }
        );
      }
    }

    return users;
  }

  async FindUserById(userId: string, req: IRequest): Promise<IUser> {
    try {
      const user = await this.userModel
        .findOne({
          _id: userId,
          status: UserStatuses.ACTIVE,
        })
        .populate('role')
        .populate('organization')
        .populate('branch');

      let new_obj;
      if (user?.profile?.attachmentId) {
        let token;
        if (process.env.NODE_ENV === 'development') {
          const header = req.headers?.authorization?.split(' ')[1];
          token = header;
        } else {
          if (!req || !req.cookies) return null;
          token = req.cookies['access_token'];
        }

        const type =
          process.env.NODE_ENV === 'development' ? 'Authorization' : 'cookie';
        const value =
          process.env.NODE_ENV === 'development'
            ? `Bearer ${token}`
            : `access_token=${token}`;

        const attachmentId = user?.profile?.attachmentId;

        const request = {
          url: `http://localhost/attachments/attachment/${attachmentId}`,
          method: 'GET',
          headers: {
            [type]: value,
          },
        };

        const { data: attachment } = await axios(request as unknown);

        if (user?.profile?.attachmentId === attachment.id) {
          new_obj = {
            ...user.toObject(),
            profile: { ...user.profile?.toObject(), attachment },
          };
        }
      }

      return new_obj ? new_obj : user;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async InviteUserToOrganization(
    userDto: InvitedUserDto,
    userData: IBaseUser
  ): Promise<void> {
    const { users } = userDto;

    let insertedUser;
    for (const user of users) {
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
          isVerified: true,
          phoneNumber: user.phoneNumber,
        };
        await this.authService.AddUser(
          insertedUser,
          userData.organizationId,
          'email'
        );
      }
    }
  }

  async ResendInvitation(data: UserLoginDto, user: IBaseUser): Promise<void> {
    const dbUser = await this.userModel.findOne({
      email: data.email,
      organizationId: user.organizationId,
    });

    await this.authService.sendVerificationEmail(dbUser);
  }

  async VerifyInvitedUser(body: SendCodeDto): Promise<IUser> {
    try {
      const string = Buffer.from(body.code, 'base64').toString('ascii');
      const data = JSON.parse(string);

      const user_arr = [];
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

  async UpdateInvitedUser(
    userDto: InvitedUserDetailDto,
    params: ParamsDto,
    res: Response
  ): Promise<IUser[]> {
    try {
      const {
        fullname,
        country,
        phoneNumber,
        password,
        attachmentId,
        email,
        prefix,
        jobTitle,
        cnic,
        website,
        location,
        bio,
      } = userDto;

      const userId = params.id;
      const user = await this.userModel.findById(userId);
      await this.userModel.updateOne(
        { _id: userId },
        {
          password: password ? await bcrypt.hashSync(password) : user.password,
          isVerified: true,
          $set: {
            'profile.fullName': fullname || user?.profile?.fullName,
            'profile.country': country || user?.profile?.country,
            'profile.phoneNumber': phoneNumber || user?.profile?.phoneNumber,
            'profile.attachmentId': attachmentId || user?.profile?.attachmentId,
            'profile.prefix': prefix || user?.profile?.prefix,
            'profile.jobTitle': jobTitle || user?.profile?.jobTitle,
            'profile.cnic': cnic || user?.profile?.cnic,
            'profile.website': website || user?.profile?.website,
            'profile.location': location || user?.profile?.location,
            'profile.bio': bio || user?.profile?.bio,
          },
        }
      );

      const new_user = await this.authService.CheckUser({
        username: email ? email : user.username,
      });

      return await this.authService.Login(new_user, res);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async UpdateTheme(body: UserThemeDto, user: IBaseUser): Promise<void> {
    await this.userModel.updateOne({ _id: user.id }, { theme: body.theme });
  }

  async UpdateUserProfile(
    userDto: InvitedUserDetailDto,
    params: ParamsDto,
    res: Response
  ): Promise<IUser[]> {
    try {
      const {
        username,
        fullname,
        country,
        phoneNumber,
        password,
        attachmentId,
        email,
        prefix,
        jobTitle,
        cnic,
        website,
        location,
        bio,
      } = userDto;

      const userId = params.id;
      const user = await this.userModel.findById(userId);
      await this.userModel.updateOne(
        { _id: userId },
        {
          username: username || user.username,
          password: password ? await bcrypt.hashSync(password) : user.password,
          $set: {
            'profile.fullName': fullname || user?.profile?.fullName,
            'profile.country': country || user?.profile?.country,
            'profile.phoneNumber': phoneNumber || user?.profile?.phoneNumber,
            'profile.attachmentId': attachmentId || user?.profile?.attachmentId,
            'profile.prefix': prefix || user?.profile?.prefix,
            'profile.jobTitle': jobTitle || user?.profile?.jobTitle,
            'profile.cnic': cnic || user?.profile?.cnic,
            'profile.website': website || user?.profile?.website,
            'profile.location': location || user?.profile?.location,
            'profile.bio': bio || user?.profile?.bio,
          },
        }
      );

      const new_user = await this.authService.CheckUser({
        username: username ? username : email,
      });

      return await this.authService.Login(new_user, res);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async HoldAccount(user) {
    const twentyDays = Moment(Date.now()).subtract(20, 'days').format();

    const users = await this.userModel.find({
      isVerified: false,
      createdAt: { $lt: twentyDays },
      organizationId: user.organizationId,
    });

    for (const i of users) {
      await this.userModel.updateOne(
        { email: i.email },
        { status: UserStatuses.HOLD }
      );

      const payload = {
        to: i.email,
        from: 'no-reply@invyce.com',
        TemplateAlias: 'account-on-hold',
        TemplateModel: {
          user_name: i.profile.fullName,
        },
      };

      await this.emailService.emit(SEND_FORGOT_PASSWORD, payload);
    }

    return true;
  }

  // async TrailExpiring() {

  // }

  async DeleteUser(userIds: UserIdsDto): Promise<boolean> {
    for (const i of userIds.ids) {
      await this.userModel.updateOne(
        {
          _id: i,
        },
        { status: UserStatuses.DELETED }
      );
    }

    return true;
  }
}
