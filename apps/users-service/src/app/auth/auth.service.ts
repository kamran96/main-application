import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Res,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import * as bcrypt from 'bcryptjs';
import * as Moment from 'moment';
import * as queryString from 'query-string';
import * as os from 'os';
import * as ip from 'ip';
import { Response } from 'express';
import { User } from '../schemas/user.schema';
import {
  PASSWORD_UPDATED,
  SEND_FORGOT_PASSWORD,
  SEND_INVITATION,
  SEND_OTP,
  USER_CREATED,
} from '@invyce/send-email';
import { UserToken } from '../schemas/userToken.schema';
import {
  IRequest,
  ICheckUser,
  IUser,
  IUserAccessControlResponse,
  IVerifyOtp,
} from '@invyce/interfaces';

import { SendOtp, UserLoginDto, UserRegisterDto } from '../dto/user.dto';

const generateRandomNDigits = (n) => {
  return Math.floor(Math.random() * (9 * Math.pow(10, n))) + Math.pow(10, n);
};

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel,
    @InjectModel(UserToken.name) private userTokenModel,
    @Inject('EMAIL_SERVICE') private readonly emailService: ClientProxy,
    @Inject('REPORT_SERVICE') private readonly reportService: ClientProxy,
    private jwtService: JwtService
  ) {}

  async CheckUser(authDto: UserLoginDto): Promise<IUser[]> {
    try {
      const user = await this.userModel
        .find({
          $or: [{ username: authDto.username }, { email: authDto.username }],
        })
        .populate('role')
        .populate('organization')
        .populate('branch');

      return user;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async AccessControll(req: IRequest): Promise<IUserAccessControlResponse> {
    try {
      const userId = req.user.id;
      const findToken = await this.userTokenModel.findOne({
        userId: userId,
        code:
          process.env.NODE_ENV === 'development'
            ? req?.headers?.authorization?.split(' ')[1]
            : req?.cookies?.access_token,
      });

      const newTime = Moment(new Date()).add(12, 'h').format();
      const time = Moment(new Date()).format();

      if (findToken === null) {
        const token = new this.userTokenModel();
        token.code =
          process.env.NODE_ENV === 'development'
            ? req?.headers?.authorization?.split(' ')[1]
            : req?.cookies?.access_token;
        token.expiresAt = newTime;
        token.brower = req?.headers['user-agent'];
        token.ipAddress = ip.address();
        token.userId = userId;
        await token.save();
      }

      if (time > findToken?.expiresAt) {
        return {
          message: 'Token is expired, Please try again later.',
          statusCode: HttpStatus.FORBIDDEN,
        };
      }

      const user = await this.userModel.findById(userId);

      return {
        user,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async AddUser(
    authDto: UserRegisterDto,
    organizationId = null as string,
    email = '' as string
  ): Promise<IUser> {
    const updatedProfile = {
      fullName: authDto.fullName,
      email: authDto.email,
      country: authDto.country,
      phoneNumber: authDto.phoneNumber,
      prefix: '',
      cnic: '',
      marketingStatus: null,
      website: '',
      location: '',
      bio: '',
      jobTitle: '',
      attachmentId: '',
    };

    const user = new this.userModel();
    user.username = authDto.username;
    user.email = authDto.email;
    user.password =
      authDto.password !== '' ? bcrypt.hashSync(authDto.password) : null;
    user.organizationId = organizationId || null;
    user.branchId = authDto.branchId || null;
    user.roleId = authDto.roleId || null;
    user.prefix = authDto.prefix;
    user.isVerified = authDto.isVerified;
    user.profile = updatedProfile;
    user.terms = authDto.terms;
    user.marketing = authDto.marketing;
    user.status = 1;
    await user.save();

    await this.reportService.emit(USER_CREATED, user);

    if (!email) {
      const time = Moment(new Date()).add(1, 'h').calendar();

      const generateOtp: number = generateRandomNDigits(4);
      parseInt(generateOtp as unknown as string);

      const user_token = new this.userTokenModel();
      user_token.code = generateOtp;
      user_token.expiresAt = time.toString();
      user_token.userId = user._id;
      await user_token.save();
      await this.sendVerificationEmail(user, generateOtp);
    } else {
      await this.sendVerificationEmail(user);
    }

    return user;
  }

  async Login(user: IUser[], @Res() res: Response): Promise<IUser[]> {
    const [newUser] = user;

    const payload = {
      username: newUser.username,
      id: newUser.id,
    };

    // when added an organization then return new access_token

    const token = this.jwtService.sign(payload);
    // const address = ip.address();

    if (process.env.NODE_ENV === 'production') {
      res
        .cookie('access_token', token, {
          secure: true,
          sameSite: 'none',
          httpOnly: true,
          // domain: 'localhost',
          path: '/',
          expires: new Date(Moment().add(process.env.EXPIRES, 'h').toDate()),
        })
        .send({
          message: 'Login successfully',
          status: true,
          result: newUser,
        });
    } else {
      res.send({
        users: newUser,
        access_token: token,
      });
    }

    return user;
  }

  async Logout(res: Response): Promise<Response> {
    // return `Authentication=; HttpOnly; Path=/; Max-Age=0`;

    return res.clearCookie('access_token').send({
      message: 'Logout successfully.',
      status: true,
    });
  }

  async Check(req: IRequest): Promise<ICheckUser> {
    try {
      const payload: UserLoginDto = {
        username: req.user.username,
      };
      const user: IUser[] = await this.CheckUser(payload);
      const access_token = req.cookies['access_token'];

      if (user?.length) {
        return {
          user: user[0],
          token: access_token,
        };
      }
      throw new HttpException('Authentication Failed', HttpStatus.BAD_REQUEST);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async ValidateUser(authDto: UserLoginDto, res: Response): Promise<IUser[]> {
    const users = await this.CheckUser(authDto);

    if (Array.isArray(users) && users[0] !== undefined) {
      // user found
      const [user] = users;
      if (user.status === 0) {
        throw new HttpException(
          'Sorry, you are no longer active.',
          HttpStatus.BAD_REQUEST
        );
      }

      if (bcrypt.compareSync(authDto.password, user.password)) {
        if (authDto?.rememberMe) {
          await this.userModel.updateOne(
            { _id: user.id },
            { rememberMe: authDto.rememberMe }
          );
        }

        return await this.Login(users, res);
      }
      throw new HttpException('Incorrect Password', HttpStatus.BAD_REQUEST);
    } else {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  async sendVerificationEmail(
    usr = null as SendOtp,
    generateOtp = null as number
  ): Promise<boolean> {
    const user = await this.userModel.findOne({ email: usr.email });

    const data = {
      user: user.id,
      date: new Date(),
    };

    const stringify = JSON.stringify(data);
    const base64 = Buffer.from(stringify).toString('base64');
    if (generateOtp) {
      this.sendVerificationOtp(user, generateOtp);
    } else {
      this.sendVerificationCode(user, base64);
    }

    return true;
  }

  async VerifyOtp(body: SendOtp): Promise<IVerifyOtp> {
    try {
      let response = {
        status: false,
      };

      const user_code = await this.userTokenModel.findOne({
        code: body.otp,
      });

      const format = Moment(user_code.expiresAt, 'hmm').format('HH:mm');
      const getOneHour = Moment(new Date()).format('HH:mm');

      if (format && format < getOneHour) {
        throw new HttpException(
          'Verification code is expired, Click on resend to generate new verification code.',
          HttpStatus.BAD_REQUEST
        );
      } else {
        await this.userModel.updateOne(
          {
            email: body.email,
          },
          { isVerified: true }
        );
        response = {
          status: true,
        };

        return response;
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async ResendOtp(body: SendOtp): Promise<void> {
    const time = Moment(new Date()).add(1, 'h').calendar();

    const user = await this.userModel.findOne({ email: body.email });

    const generateOtp: number = generateRandomNDigits(4);
    parseInt(generateOtp as unknown as string);

    const user_token = new this.userTokenModel();
    user_token.code = generateOtp;
    user_token.expiresAt = time.toString();
    user_token.userId = user._id;
    await user_token.save();

    await this.sendVerificationEmail(body, generateOtp);
  }

  async sendVerificationOtp(user, otp): Promise<void> {
    await this.emailService.emit(SEND_OTP, {
      user_name: user.username,
      otp_link: otp,
    });
  }

  async sendVerificationCode(user: UserLoginDto, code: string): Promise<void> {
    const baseUrl = 'http://localhost:4200';
    const _code = { code };
    const a = `${baseUrl}/page/join-user?${queryString.stringify(_code)}`;

    // info(`Decoded generated for user ${queryString.parse(_code)}`);

    const payload = {
      to: user.email,
      from: 'no-reply@invyce.com',
      TemplateAlias: 'user-invitation',
      TemplateModel: {
        product_url: 'https://invyce.com',
        product_name: 'invyce',
        name: 'test',
        invite_sender_name: 'zeeshan',
        invite_sender_organization_name: 'test org',
        action_url: a,
        support_email: 'support@invyce.com',
        live_chat_url: 'live_chat_url_Value',
        help_url: 'help_url_Value',
        company_name: 'invyce',
        company_address: 'gilgit',
      },
    };

    await this.emailService.emit(SEND_INVITATION, payload);
  }

  async ForgetPassword(userDto: UserLoginDto): Promise<void> {
    const user = await this.userModel.findOne({
      $or: [{ username: userDto?.username }, { email: userDto?.username }],
    });

    if (user) {
      const data = {
        user: user.id,
        date: Moment.utc().toLocaleString(),
      };

      const stringify = JSON.stringify(data);
      const base64 = Buffer.from(stringify).toString('base64');
      await this.SendForgetPassword(user, base64);
    }
  }

  async SendForgetPassword(user: IUser, code: string): Promise<void> {
    const baseUrl = 'http://localhost:4200';
    const _code = queryString.stringify({ code });
    const a = `${baseUrl}/page/forgot-password?${_code}&type=reset-password`;
    const operating_system = os.type();

    const payload = {
      to: user.email,
      from: 'no-reply@invyce.com',
      TemplateAlias: 'password-reset',
      user_name: user.profile.fullName,
      user_email: user.email,
      link: a,
      operating_system,
    };

    await this.emailService.emit(SEND_FORGOT_PASSWORD, payload);
  }

  async SendPasswordUpdatedNotification(user) {
    const payload = {
      to: user.email,
      user_name: user.profile.fullName,
    };

    await this.emailService.emit(PASSWORD_UPDATED, payload);
  }

  async verifyForgotPassword(code: string): Promise<IUser> {
    const string = Buffer.from(code, 'base64').toString('ascii');
    const data = JSON.parse(string);

    const { user: userId } = data;
    const user = await this.userModel.findById(userId);
    return user;
  }

  async ChangePassword(userDto): Promise<boolean> {
    try {
      const verify: IUser = await this.verifyForgotPassword(userDto.code);

      if (verify) {
        delete verify.password;

        await this.userModel.updateOne(
          {
            username: verify.username,
          },
          { password: await bcrypt.hashSync(userDto.password) }
        );

        await this.SendPasswordUpdatedNotification(verify);
        return true;
      }
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
