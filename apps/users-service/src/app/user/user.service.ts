import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  Res,
} from '@nestjs/common';
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
import { Host, UserStatuses } from '@invyce/global-constants';
import {
  EMAIL_CHANGED,
  PASSWORD_UPDATED,
  SEND_FORGOT_PASSWORD,
} from '@invyce/send-email';
import { Branch } from '../schemas/branch.schema';
import { Sorting } from '@invyce/sorting';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel,
    @InjectModel(UserToken.name) private userToken,
    @InjectModel(Branch.name) private branchModel,
    @Inject('EMAIL_SERVICE') private readonly emailService: ClientProxy,

    private authService: AuthService
  ) {}

  async ListUsers(user: IBaseUser, query: IPage) {
    const { page_size, page_no, query: filters, purpose, sort } = query;
    const ps: number = parseInt(page_size);
    const pn: number = parseInt(page_no);

    let users;
    const { sort_column, sort_order } = await Sorting(sort);

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

        const myCustomLabels = {
          docs: 'users',
          totalDocs: 'total',
          meta: 'pagination',
          limit: 'page_size',
          page: 'page_no',
          nextPage: 'next',
          prevPage: 'prev',
          totalPages: 'total_pages',
        };

        for (const i in data) {
          if (data[i].type === 'search') {
            const val = data[i].value?.split('%')[1];

            users = await this.userModel.paginate(
              {
                status: UserStatuses.ACTIVE,
                organizationId: user.organizationId,
                [i]: { $regex: new RegExp(val, 'i') },
              },
              {
                offset: pn * ps - ps,
                limit: ps,
                sort: { [sort_column]: sort_order },
                customLabels: myCustomLabels,
              }
            );
          } else if (data[i].type === 'date-between') {
            const start_date = i[1]['value'][0];
            const end_date = i[1]['value'][1];
            users = await this.userModel.paginate(
              {
                status: UserStatuses.ACTIVE,
                organizationId: user.organizationId,
                [i]: { $gt: start_date, $lt: end_date },
              },
              {
                offset: pn * ps - ps,
                limit: ps,
                sort: { [sort_column]: sort_order },
                customLabels: myCustomLabels,
              }
            );
          } else if (data[i].type === 'compare') {
            users = await this.userModel.paginate(
              {
                status: UserStatuses.ACTIVE,
                organization: user.organizationId,
                [i]: { $in: i[1]['value'] },
              },
              {
                offset: pn * ps - ps,
                limit: ps,
                sort: { [sort_column]: sort_order },
                customLabels: myCustomLabels,
              }
            );
          } else if (data[i].type === 'in') {
            users = await this.userModel.paginate(
              {
                status: UserStatuses.ACTIVE,
                organization: user.organizationId,
                [i]: { $in: i[1]['value'] },
              },
              {
                offset: pn * ps - ps,
                limit: ps,
                sort: { [sort_column]: sort_order },
                customLabels: myCustomLabels,
              }
            );
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

  async check(data) {
    if (data?.username) {
      const username = await this.userModel.findOne({
        username: data.username,
      });

      if (username) {
        return {
          message: `Username <span class="capitalize fw-500 clr-dark">${data.username}</span> is taken, Please try another`,
          available: false,
        };
      } else if (!username) {
        return {
          message: 'Username is available',
          available: true,
        };
      }
    }

    if (data?.email) {
      const email = await this.userModel.findOne({
        email: data.email,
      });

      if (email) {
        return {
          message: `Email <span class="capitalize fw-500 clr-dark">${data.email}</span> is taken, Please try another`,
          available: false,
        };
      } else if (!email) {
        return {
          message: 'Email is available',
          available: true,
        };
      }
    }
  }

  async ChangeUserDetails(req: IRequest, data, @Res() res: Response) {
    const email = data?.email;
    const twoFactorEnabled = data?.twoFactorEnabled;

    if (email) {
      const userEmail = await this.userModel.findOne({
        email,
      });

      if (userEmail) {
        throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
      }

      await this.userModel.updateOne(
        { _id: req.user.id },
        {
          email,
        }
      );

      const user = await this.userModel.find({
        _id: req.user.id,
      });

      await this.emailService.emit(EMAIL_CHANGED, {
        to: req.user.email,
        user_name: req.user.profile.fullName,
        user_new_email: email,
      });

      const userWithToken = await this.authService.Login(user, res, req);

      return res.send({
        message: 'Email successfully changed',
        result: userWithToken,
        status: true,
      });
    } else if (twoFactorEnabled !== undefined) {
      await this.userModel.updateOne(
        { _id: req.user.id },
        {
          twoFactorEnabled,
        }
      );

      return res.send({
        message: 'Two factor successfully updated',
        status: true,
      });
    } else {
      await this.userModel.updateOne(
        { _id: req.user.id },
        {
          password: bcrypt.hashSync(data.password, 10),
        }
      );

      await this.emailService.emit(PASSWORD_UPDATED, {
        to: req.user.email,
        user_name: req.user.profile.fullName,
      });

      return res.send({
        message: 'Password successfully changed',
        status: true,
      });
    }
  }

  async FindUserById(userId: string, req: IRequest): Promise<IUser> {
    try {
      const user = await this.userModel
        .findOne({
          _id: userId,
          status: UserStatuses.ACTIVE,
        })
        .populate('role')
        .populate('branch')
        .populate({
          path: 'organization',
          model: 'Organization',
          populate: {
            path: 'currency',
            model: 'Currency',
          },
        });

      let new_obj;
      if (user?.profile?.attachmentId) {
        const attachmentId = user?.profile?.attachmentId;

        if (!req || !req.cookies) return null;
        const token = req.cookies['access_token'];

        const request = {
          url: Host('attachments', `attachments/attachment/${attachmentId}`),
          method: 'GET',
          headers: {
            cookie: `access_token=${token}`,
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
          username: user.username || '',
          email: user.email,
          password: '',

          roleId: user.roleId,
          branchId: user.branchId,
          fullName: user.fullName,
          country: user.country,
          isVerified: false,
          phoneNumber: user.phoneNumber,
        };
        await this.authService.AddUser(insertedUser, userData, 'email');
      }
    }
  }

  async ResendInvitation(data: UserLoginDto, user: IBaseUser): Promise<void> {
    const dbUser = await this.userModel.findOne({
      email: data.email,
      organizationId: user.organizationId,
    });

    await this.authService.sendVerificationEmail(dbUser, null, user);
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
    res: Response,
    req: IRequest
  ): Promise<IUser[]> {
    try {
      const {
        fullName,
        country,
        phoneNumber,
        password,
        attachmentId,
        email,
        prefix,
        jobTitle,
        cnic,
        website,
        username,
        location,
        bio,
      } = userDto;

      const userId = params.id;
      const user = await this.userModel.findById(userId);
      const branch = await this.branchModel.findOne({
        organizationId: user.organizationId,
      });

      await this.userModel.updateOne(
        { _id: userId },
        {
          password: password ? await bcrypt.hashSync(password) : user.password,
          username,
          isVerified: true,
          branchId: branch.id,
          $set: {
            'profile.fullName': fullName || user?.profile?.fullName,
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

      return await this.authService.Login(new_user, res, req);
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
    res: Response,
    req: IRequest
  ): Promise<IUser[]> {
    try {
      const {
        username,
        fullName,
        country,
        phoneNumber,
        password,
        attachmentId,
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
            'profile.fullName': fullName || user?.profile?.fullName,
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
        username: user.username || user.email,
      });

      return await this.authService.Login(new_user, res, req);
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

  async GetUserByIds(data, user: IBaseUser) {
    return await this.userModel.find({
      _id: { $in: data.ids },
      organizationId: user.organizationId,
    });
  }

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
