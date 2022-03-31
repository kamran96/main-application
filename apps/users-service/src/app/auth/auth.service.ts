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
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import { Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { User } from '../schemas/user.schema';
import {
  CHANGE_EMAIL_OTP,
  CHANGE_PASSWORD_OTP,
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
  IBaseUser,
} from '@invyce/interfaces';

import { SendOtp, UserLoginDto, UserRegisterDto } from '../dto/user.dto';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateRandomNDigits = (n) => {
  return Math.floor(Math.random() * (9 * Math.pow(10, n))) + Math.pow(10, n);
};

const secret = speakeasy.generateSecret({
  name: 'Invyce',
});

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

  async GoogleLogin(data, @Res() res: Response) {
    const ticket = await client.verifyIdToken({
      idToken: data.token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const user = await this.userModel.find({
      email: payload.email,
    });

    if (user.length > 0) {
      if (user.length > 0 && user[0].loginWith === 'google') {
        await this.Login(user, res);
      } else {
        throw new HttpException(
          'You are alreay registered with this email please login instead.',
          HttpStatus.BAD_REQUEST
        );
      }
    }

    const profile = {
      fullName: payload.name,
      photo: payload.picture,
    };

    const userArr = [];
    const newUser = new this.userModel();
    newUser.email = payload.email;
    newUser.username = payload.given_name;
    newUser.profile = profile;
    newUser.status = 1;
    newUser.loginWith = 'google';
    await newUser.save();

    userArr.push(newUser);
    await this.Login(userArr, res);
  }

  async AddUser(
    authDto: UserRegisterDto,
    userData = null as IBaseUser,
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
    user.organizationId = userData?.organizationId || null;
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
      await this.sendVerificationEmail(user, generateOtp, userData);
    } else {
      await this.sendVerificationEmail(user, null, userData);
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
    generateOtp = null as number,
    userData = null as IBaseUser
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
      this.sendVerificationCode(user, base64, userData);
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

  async RequestChangeVerify(body) {
    const user_code = await this.userTokenModel.findOne({
      code: body.otp,
    });

    const oneHour = user_code.expiresAt;
    const currentTime = new Date().getTime() / 1000;

    if (currentTime && currentTime > oneHour) {
      throw new HttpException(
        'Otp is expired, Click on resend to generate new verification code.',
        HttpStatus.BAD_REQUEST
      );
    } else {
      return {
        message: 'Verification successful',
        verified: true,
        status: true,
      };
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

    await this.sendVerificationEmail(body, generateOtp, null);
  }

  async ChangeEmailOtp(body, usr) {
    const time = new Date().getTime() / 1000 + 1 * (60 * 60);

    const user = await this.userModel.findOne({ email: usr.email });

    const generateOtp: number = generateRandomNDigits(4);
    parseInt(generateOtp as unknown as string);

    const user_token = new this.userTokenModel();
    user_token.code = generateOtp;
    user_token.expiresAt = time.toString();
    user_token.userId = user._id;
    await user_token.save();

    if (body.type === 'email') {
      await this.emailService.emit(CHANGE_EMAIL_OTP, {
        to: user.email,
        user_name: user.profile.fullName,
        otp_link: generateOtp,
      });
    } else if (body.type === 'password') {
      await this.emailService.emit(CHANGE_PASSWORD_OTP, {
        to: user.email,
        user_name: user.profile.fullName,
        otp_link: generateOtp,
      });
    }

    const type = body.type;
    return {
      message: 'Email send',
      result: {
        [type]: time,
      },
    };
  }

  async sendVerificationOtp(user, otp): Promise<void> {
    await this.emailService.emit(SEND_OTP, {
      to: user.email,
      user_name: user.username,
      otp_link: otp,
    });
  }

  async sendVerificationCode(
    user: IUser,
    code: string,
    userData: IBaseUser
  ): Promise<void> {
    const baseUrl = 'http://localhost:4200';
    const _code = { code };
    const a = `${baseUrl}/page/join-user?${queryString.stringify(_code)}`;

    // info(`Decoded generated for user ${queryString.parse(_code)}`);

    const payload = {
      to: user.email,
      user_name: user?.profile?.fullName,
      name: userData.profile.fullName,
      action_url: a,
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
      link: `${process.env.FRONTEND_HOST}/page/login`,
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

  async GenerateGoogleAuthenticatorToken(): Promise<unknown> {
    const token = await qrcode.toDataURL(secret.otpauth_url);

    return {
      result: token,
    };
  }

  async VerifyGoogleAuthenticatorToken(data, user): Promise<unknown> {
    const { code } = data;
    const verified = await speakeasy.totp.verify({
      secret: secret.base32,
      encoding: 'base32',
      token: code,
    });

    await this.userModel.updateOne(
      {
        _id: user._id,
      },
      {
        twoFactorEnabled: true,
      }
    );

    return verified;
  }
}
