import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
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
import { User } from '../schemas/user.schema';
import {
  SEND_FORGOT_PASSWORD,
  SEND_INVITATION,
  SEND_OTP,
} from '@invyce/send-email';
import { UserToken } from '../schemas/userToken.schema';
import { Response } from 'express';

const generateRandomNDigits = (n) => {
  return Math.floor(Math.random() * (9 * Math.pow(10, n))) + Math.pow(10, n);
};

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel,
    @InjectModel(UserToken.name) private userTokenModel,
    @Inject('EMAIL_SERVICE') private readonly emailService: ClientProxy,
    private jwtService: JwtService
  ) {}

  async CheckUser(authDto) {
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

  async AccessControll(data, req) {
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

  async AddUser(authDto, organizationId = null, email = '') {
    const updatedProfile = {
      fullName: authDto.fullName,
      country: authDto.country,
      phoneNumber: authDto.phoneNumber,
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
    user.profile = authDto.profile || updatedProfile;
    user.terms = authDto.terms;
    user.marketing = authDto.marketing;
    user.status = 1;
    await user.save();

    if (!email) {
      const time = Moment(new Date()).add(1, 'h').calendar();

      let generateOtp: any = generateRandomNDigits(4);
      parseInt(generateOtp);

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

  async Login(user, @Res() res: Response) {
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

    return {
      user,
    };
  }

  async Logout(res) {
    // return `Authentication=; HttpOnly; Path=/; Max-Age=0`;

    return res.clearCookie('access_token').send({
      message: 'Logout successfully.',
      status: true,
    });
  }

  async Check(req) {
    try {
      const user = await this.CheckUser(req.user);
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

  async ValidateUser(authDto, res) {
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
        const user = await this.Login(users, res);
        return user;
      }
      throw new HttpException('Incorrect Password', HttpStatus.BAD_REQUEST);
    } else {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  async sendVerificationEmail(usr: any = null, generateOtp = null) {
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
      this.sendVerificationCode(user, base64, true);
    }
  }

  async VerifyOtp(body) {
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

  async ResendOtp(body) {
    const time = Moment(new Date()).add(1, 'h').calendar();

    const user = await this.userModel.findOne({ email: body.email });

    let generateOtp: any = generateRandomNDigits(4);
    parseInt(generateOtp);

    const user_token = new this.userTokenModel();
    user_token.code = generateOtp;
    user_token.expiresAt = time.toString();
    user_token.userId = user._id;
    await user_token.save();

    await this.sendVerificationEmail(body, generateOtp);
  }

  async sendVerificationOtp(user, otp) {
    const payload = {
      to: user.email,
      from: 'no-reply@invyce.com',
      TemplateAlias: 'send-opt',
      TemplateModel: {
        product_url: 'https://invyce.com',
        product_name: 'invyce',
        name: user.username,
        action_url: otp,
        trial_length: 'trial_length_Value',
        trial_start_date: 'trial_start_date_Value',
        trial_end_date: 'trial_end_date_Value',
        support_email: 'support_email_Value',
        live_chat_url: 'live_chat_url_Value',
        sender_name: 'sender_name_Value',
        help_url: 'help_url_Value',
        company_name: 'company_name_Value',
        company_address: 'company_address_Value',
        login_url: 'login_url_Value',
        username: user.username,
      },
    };

    await this.emailService.emit(SEND_OTP, payload);
  }

  async sendVerificationCode(user, code, joinCompany): Promise<any> {
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

  async ForgetPassword(userDto): Promise<boolean> {
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
      return true;
    }
    return false;
  }

  async SendForgetPassword(user, code): Promise<any> {
    const baseUrl = 'http://localhost:4200';
    const _code = queryString.stringify({ code });
    const a = `${baseUrl}/page/forgot-password?${_code}&type=reset-password`;
    const operating_system = os.type();

    const payload = {
      to: user.email,
      from: 'no-reply@invyce.com',
      TemplateAlias: 'password-reset',
      TemplateModel: {
        product_url: '',
        product_name: 'invyce',
        name: user.profile.fullName,
        action_url: a,
        operating_system,
        // browser_name: browser.name,
        support_url: 'support@invyce.com',
        company_name: 'invyce',
        company_address: 'ZS plaza jutial giltit, Pakistan',
      },
    };

    await this.emailService.emit(SEND_FORGOT_PASSWORD, payload);
  }

  async verifyForgotPassword(code: string): Promise<any> {
    const string = Buffer.from(code, 'base64').toString('ascii');
    const data = JSON.parse(string);
    if (data) {
      const { user: userId } = data;
      const user = await this.userModel.findById(userId);
      return user;
    }

    return false;
  }

  async ChangePassword(userDto): Promise<any> {
    try {
      const verify: any = await this.verifyForgotPassword(userDto.code);
      if (verify === false || !verify) {
        return false;
      }

      delete verify.password;
      const updatedUser: any = {};
      updatedUser.username = verify.username;
      updatedUser.password = bcrypt.hashSync(userDto.password);
      updatedUser.status = 1;
      updatedUser.organizationId = verify.organizationId;
      updatedUser.roleId = verify.roleId;

      await this.userModel.updateOne({ _id: userDto.id }, updatedUser);
      return updatedUser;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
