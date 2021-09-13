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
import { SEND_CUSTOMER_EMAIL, SEND_FORGOT_PASSWORD } from '@invyce/send-email';
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
        code: req.cookies.access_token,
      });

      const newTime = Moment(new Date())
        .add(process.env.EXPIRES, 'h')
        .calendar();
      const time = Moment(new Date()).calendar();

      if (findToken === null) {
        const token = new this.userTokenModel();
        token.code = req.cookies.access_token;
        token.expiresAt = newTime;
        token.brower = req.headers['user-agent'];
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

  async AddUser(authDto) {
    const user = new this.userModel();
    user.username = authDto.username;
    user.email = authDto.email;
    user.password =
      authDto.password !== '' ? bcrypt.hashSync(authDto.password) : null;
    user.organizationId = authDto.organizationId || null;
    user.branchId = authDto.branchId || null;
    user.roleId = authDto.roleId || null;
    user.prefix = authDto.prefix;
    user.profile = authDto.profile;
    user.terms = authDto.terms;
    user.marketing = authDto.marketing;
    user.status = 1;
    await user.save();

    const time = Moment(new Date()).add(1, 'h').calendar();

    let generateOtp: any = generateRandomNDigits(4);
    parseInt(generateOtp);

    const user_token = new this.userTokenModel();
    user_token.code = generateOtp;
    user_token.expiresAt = time.toString();
    user_token.userId = user._id;
    await user_token.save();

    await this.sendVerificationEmail(user, false, true, generateOtp);

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

    res
      .cookie('access_token', token, {
        httpOnly: true,
        sameSite: 'strict',
        secure: true,
        domain: '127.0.0.1',
        expires: new Date(Moment().add(process.env.EXPIRES, 'h').toDate()),
      })
      .send({
        message: 'Login successfully',
        status: true,
        result: newUser,
      });

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

  async sendVerificationEmail(
    usr: any = null,
    resend: boolean = false,
    otp = false,
    generateOtp = null
  ) {
    const user = await this.userModel.findOne({ email: usr.email });

    const data = {
      user: user.id,
      date: new Date(),
    };

    const stringify = JSON.stringify(data);
    const base64 = Buffer.from(stringify).toString('base64');
    if (otp) {
      this.sendVerificationOtp(user, generateOtp);
    } else {
      this.sendVerificationCode(user, base64, true);
    }
  }

  async VerifyOtp(body) {
    try {
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

    await this.sendVerificationEmail(body, false, true, generateOtp);
  }

  async sendVerificationOtp(user, otp) {
    const link = `<h1>OTP for account verification is 
      <h4>${otp}<h4>
    </h1>`;

    const payload = {
      email: 'zeeshan@invyce.com',
      subject: 'For test',
      message: 'Account verification',
      from: 'zeeshan@invyce.com',
    };

    await this.emailService.emit(SEND_CUSTOMER_EMAIL, payload);

    // await this.email
    //   .compose(
    //     user.email,
    //     `Account verification for ${
    //       user.organization ? user.organization.name : null
    //     }`,
    //     link,
    //     'no-reply@invyce.com'
    //   )
    //   .send();
  }

  async sendVerificationCode(user, code, joinCompany): Promise<any> {
    const baseUrl = process.env.BASE_URL;
    const _code = { code };
    const a = `${baseUrl}/page/join-user?${queryString.stringify(_code)}`;

    // info(`Decoded generated for user ${queryString.parse(_code)}`);
    let link = ``;

    if (joinCompany) {
      link = `<h1>Invitation to join company.</h1>
      <p>You have been invited by ${user.organization.name} to join their company.</p>
      <p><a href='${a}'>Click here</a> to join ${user.organization.name}</p>
    `;
    } else {
      link = `
    <h2>Congratulations! You account has been created successfully. </h2>
    <p>For security purposes Invyce wants you to confirm your account before using our app.</p>
    <p>Please <a href='${a}'>Click Here</a> verify your account</p>
    <p style='font-size: 12px; color: #888'>Please avoid replying to this email, no one is using this email</p>
    `;
    }

    // await this.email
    //   .compose(
    //     user.email,
    //     `Invite user request from ${user.organization.name}`,
    //     link,
    //     'no-reply@invyce.com'
    //   )
    //   .send();
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
    const baseUrl = 'http://localhost:3000';
    const _code = queryString.stringify({ code });
    const a = `${baseUrl}/page/forgot-password?${_code}&type=reset-password`;
    const operating_system = os.type();

    const payload = {
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
    // await this.email
    //   .compose(
    //     user.email,
    //     'Password change request',
    //     link,
    //     'no-reply@invyce.com'
    //   )
    //   .send();
  }

  async verifyForgotPassword(code: string): Promise<any> {
    const string = Buffer.from(code, 'base64').toString('ascii');
    const data = JSON.parse(string);
    if (data) {
      const { user: userId } = data;
      const user = await this.userModel.findOne({ id: userId });
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

      const updatedUser = { ...verify };
      delete updatedUser.id;
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
