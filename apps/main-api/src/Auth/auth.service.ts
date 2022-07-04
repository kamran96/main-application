import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { getCustomRepository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as queryString from 'query-string';
import * as crypto from 'crypto';
import * as redis from 'redis';
import * as Moment from 'moment';
import { JwtService } from '@nestjs/jwt';
import {
  ProfileRepository,
  UserCodeRepository,
  UserRepository,
} from '../repositories';
import { EmailService } from '../Common/services/email.service';

// const client = redis.createClient();

// client.on('error', function (error) {
//   console.log(error);
// });

// const get = promisify(client.get).bind(client);
// const set = promisify(client.set).bind(client);

const generateRandomNDigits = (n) => {
  return (
    Math.floor(crypto.randomInt(1) * (9 * Math.pow(10, n))) + Math.pow(10, n)
  );
};

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private email: EmailService) {}

  async CheckUser(authDto) {
    try {
      const user_arr = [];
      const userRepository = getCustomRepository(UserRepository);
      const user = await userRepository
        .createQueryBuilder('users')
        .where('users.username = :username', { username: authDto?.username })
        .orWhere('users.email = :email', { email: authDto?.email })
        .leftJoinAndSelect('users.profile', 'profile')
        .leftJoinAndSelect('users.role', 'role')
        .leftJoinAndSelect('users.organization', 'organization')
        .leftJoinAndSelect('users.branch', 'branch')
        .getOne();

      if (user) {
        user_arr.push(user);
      }
      return user_arr;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async AddUser(authDto, orgId = null) {
    try {
      const userRepository = getCustomRepository(UserRepository);
      const profileRepository = getCustomRepository(ProfileRepository);

      const user = await userRepository.save({
        username: authDto.username,
        email: authDto.email,
        password:
          authDto.password !== '' ? bcrypt.hashSync(authDto.password) : null,
        status: 1,
        organizationId: orgId || null,
        branchId: authDto.branchId !== undefined ? authDto.branchId : null,
        roleId: authDto.roleId,
        prefix: authDto.prefix,
        terms: authDto.terms,
        marketing: authDto.marketing,
      });

      await profileRepository.save({
        userId: user.id,
        email: authDto.email,
        fullName: authDto.fullName,
        country: authDto.country,
        phoneNumber: authDto.phoneNumber,
      });

      const time = Moment(new Date()).add(1, 'h').calendar();

      const generateOtp: any = generateRandomNDigits(4);
      parseInt(generateOtp);

      const values = {
        userId: user.id,
        email: authDto.email,
      };

      // await client.set(`${generateOtp}`, JSON.stringify(values));

      await getCustomRepository(UserCodeRepository).save({
        code: generateOtp,
        expiresAt: time.toString(),
        userId: user.id,
      });

      await this.sendVerificationEmail(user, false, true, generateOtp);

      return user;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async Login(user) {
    const [newUser] = user;

    const payload = {
      user_name: newUser.username,
      id: newUser.id,
      organizationId: newUser.organizationId,
      roleId: newUser.roleId,
      branchId: newUser.branchId,
    };

    // when added an organization then return new access_token

    const token = this.jwtService.sign(payload);

    return {
      users: newUser,
      access_token: token,
    };
  }

  async ValidateUser(authDto) {
    const users = await this.CheckUser(authDto);
    if (Array.isArray(users) && users[0] !== undefined) {
      // user found.
      const [user] = users;
      if (user.status === 0) {
        throw new HttpException(
          'Sorry, you are no longer active.',
          HttpStatus.BAD_REQUEST
        );
      }
      if (bcrypt.compareSync(authDto.password, user.password)) {
        const user = await this.Login(users);
        return user;
      }
      throw new HttpException('Incorrect Password', HttpStatus.BAD_REQUEST);
    } else {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  async VerifyOtp(body) {
    try {
      const response = {
        status: false,
      };

      // const data = await get(body.otp);

      // if (data) {
      //   const [user_code] = await getCustomRepository(UserCodeRepository).find({
      //     where: {
      //       code: body.otp,
      //     },
      //   });

      //   const format = Moment(user_code.expiresAt, 'hmm').format('HH:mm');
      //   const getOneHour = Moment(new Date()).format('HH:mm');

      //   if (format && format < getOneHour) {
      //     throw new HttpException(
      //       'Verification code is expired, Click on resend to generate new verification code.',
      //       HttpStatus.BAD_REQUEST
      //     );
      //   } else {
      //     await getCustomRepository(UserRepository).update(
      //       {
      //         email: body.email,
      //       },
      //       { isVerified: true }
      //     );
      //     response = {
      //       status: true,
      // //     };
      // //     return response;
      // //   }
      // } else {
      //   response = {
      //     status: false,
      //   };
      // }

      return response;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async ResendOtp(body) {
    const time = Moment(new Date()).add(1, 'h').calendar();

    const [user] = await getCustomRepository(UserRepository).find({
      where: {
        email: body.email,
      },
    });

    const values = {
      userId: user.id,
      email: user.email,
    };

    const generateOtp: any = generateRandomNDigits(4);
    parseInt(generateOtp);

    // await client.set(`${generateOtp}`, JSON.stringify(values));

    await getCustomRepository(UserCodeRepository).save({
      code: generateOtp,
      expiresAt: time.toString(),
      userId: user.id,
    });

    await getCustomRepository(UserCodeRepository).save({
      code: '1234',
      expiresAt: time.toString(),
    });

    await this.sendVerificationEmail(body, false, true, generateOtp);
  }

  async sendVerificationEmail(
    usr: any = null,
    resend = false,
    otp = false,
    generateOtp = null
  ) {
    const userRepository = getCustomRepository(UserRepository);
    const [user] = await userRepository.find({
      where: {
        email: usr.email,
      },
      relations: ['organization', 'profile'],
    });

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

  async sendVerificationOtp(user, otp) {
    const link = `<h1>OTP for account verification is 
      <h4>${otp}<h4>
    </h1>`;

    await this.email
      .compose(
        user.email,
        `Account verification for ${
          user.organization ? user.organization.name : null
        }`,
        link,
        'no-reply@invyce.com'
      )
      .send();
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

    await this.email
      .compose(
        user.email,
        `Invite user request from ${user.organization.name}`,
        link,
        'no-reply@invyce.com'
      )
      .send();
  }

  async ForgetPassword(userDto): Promise<boolean> {
    const userRepository = getCustomRepository(UserRepository);
    const user = await userRepository
      .createQueryBuilder('users')
      .where('users.username = :username', { username: userDto?.username })
      .orWhere('users.email = :email', { email: userDto?.email })
      .getOne();

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

    const link = `
    <p>We've received a password changed request on your account. </p>
    <p>Please <a href='${a}'>click here</a> to reset your password. Or copy below text in your browser's address bar.</p.
    <p style="margin-top: 8px; font-size: 10px; color: blue;">${a}</p>
  `;
    await this.email
      .compose(
        user.email,
        'Password change request',
        link,
        'no-reply@invyce.com'
      )
      .send();
  }

  async verifyForgotPassword(code: string): Promise<any> {
    const string = Buffer.from(code, 'base64').toString('ascii');
    const data = JSON.parse(string);
    if (data) {
      const { user: userId } = data;
      const userRepository = getCustomRepository(UserRepository);
      const [user] = await userRepository.find({ where: { id: userId } });
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

      await getCustomRepository(UserRepository).update(
        { id: verify.id },
        updatedUser
      );
      return updatedUser;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
