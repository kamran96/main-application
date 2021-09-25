import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request } from 'express';
import * as Moment from 'moment';
import * as redis from 'redis';
import * as bcrypt from 'bcryptjs';
import { promisify } from 'util';
import { EntityManager, getCustomRepository } from 'typeorm';
import { UserRepository, ProfileRepository } from '../repositories';
import { AuthService } from '../Auth/auth.service';
import { Pagination } from '../Common/services/pagination.service';
import { UserProfiles, Users } from '../entities';
import { PackageRepository } from '../repositories/package.repository';
import { CurrencyRepository } from '../repositories/currency.repository';

@Injectable()
export class UserService {
  constructor(
    private patination: Pagination,
    private authService: AuthService,
    private manager: EntityManager
  ) {}

  async ListUser(userData, take, page_no, sort, query) {
    const userRepository = getCustomRepository(UserRepository);
    const sql = `select u.id, u."roleId", u.name, u.password, u."branchId", u."organizationId", u.status, 
    u."createdById", u."updatedById", u."createdAt", u."updatedAt"
    from users u `;

    return await this.patination.ListApi(
      userRepository,
      take,
      page_no,
      sort,
      sql
    );
  }

  async UpdateProfile(userData, profileDto) {
    try {
      const profileRepository = getCustomRepository(ProfileRepository);
      const result = await profileRepository.find({
        where: {
          userId: profileDto.userId,
        },
      });

      if (Array.isArray(result) && result.length > 0) {
        const [profile] = result;
        const updatedProfile = { ...profile };
        delete profile.id;
        updatedProfile.fullName = profileDto.fullName || profile.fullName;
        updatedProfile.website = profileDto.website || profile.website;
        updatedProfile.jobTitle = profileDto.jobTitle || profile.jobTitle;
        updatedProfile.phoneNumber =
          profileDto.phoneNumber || profile.phoneNumber;
        updatedProfile.location = profileDto.location || profile.location;
        updatedProfile.bio = profileDto.bio || profile.bio;
        updatedProfile.attachmentId = profileDto.attachmentId;
        await this.manager.update(
          UserProfiles,
          { userId: profileDto.userId },
          updatedProfile
        );
        const [updated] = await profileRepository.find({
          where: {
            userId: profileDto.userId,
          },
        });
        return updated;
      }

      throw new HttpException('Invalid params', HttpStatus.BAD_REQUEST);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async FindUserById(params, userData) {
    try {
      const userRepository = getCustomRepository(UserRepository);
      const user = await userRepository.find({
        where: {
          id: params.id,
        },
        relations: ['profile', 'profile.attachment', 'organization', 'role'],
      });
      return user;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async InviteUserToOrganization(userDto, userData) {
    const { users } = userDto;
    const userRepository = getCustomRepository(UserRepository);

    let insertedUser;
    for (let user of users) {
      const dbUser = await userRepository.find({
        where: {
          email: user.email,
          organizationId: userData.organizationId,
        },
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
        await this.authService.AddUser(insertedUser, userData.organizationId);
      }
    }

    return true;
  }

  async DeleteUser(userDto) {
    try {
      for (let i of userDto.ids) {
        await this.manager.update(Users, { id: i }, { status: 0 });
        // await this.manager.update(UserProfiles, {userId: i}, {status: 0})
      }
      const userRepository = getCustomRepository(UserRepository);
      const [user] = await userRepository.find({
        where: {
          id: userDto.ids[0],
        },
      });

      return user;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async VerifyInvitedUser(body) {
    try {
      const string = Buffer.from(body.code, 'base64').toString('ascii');
      const data = JSON.parse(string);

      let user_arr = [];
      if (data) {
        const { user: user_id } = data;

        const [user] = await getCustomRepository(UserRepository).find({
          where: { id: user_id },
          relations: ['profile', 'role', 'branch', 'organization'],
        });

        if (user.status === 1 && user.username !== null) {
          throw new HttpException(
            'User aleady registered please contact your admin.',
            HttpStatus.BAD_REQUEST
          );
        } else {
          user_arr.push(user);

          await getCustomRepository(UserRepository).update(
            { id: user_id },
            { status: 1 }
          );
        }
      }

      return user_arr[0];
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async UpdateInvitedUser(userDto, params) {
    try {
      const { username, fullName, country, phoneNumber, password } = userDto;

      await getCustomRepository(UserRepository).update(
        { id: params.id },
        {
          username,
          password: bcrypt.hashSync(password),
        }
      );

      await getCustomRepository(ProfileRepository).update(
        { userId: params.id },
        {
          fullName,
          country,
          phoneNumber,
        }
      );

      const new_user = await this.authService.CheckUser({
        username: userDto.username,
      });

      const user = await this.authService.Login(new_user);

      return user;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async InsertPackages() {
    const { packages } = await import('../paywall');

    for (let i of packages) {
      await getCustomRepository(PackageRepository).save({
        name: i.name,
        details: JSON.stringify(i),
        status: 1,
      });
    }

    return true;
  }

  async InsertCurrencies() {
    const { currencies } = await import('../currency');

    for (let i of currencies) {
      await getCustomRepository(CurrencyRepository).save({
        name: i.name,
        code: i.code,
        symbol: i.symbol,
      });
    }

    return true;
  }

  async testTask() {
    let array = [1, 3, 4, -3, 7, 10, 9, -5];
    let result = 6;

    function find_result(arr, res) {
      arr.sort();
      let l = 0;
      let a = arr.length - 1;

      while (l < a) {
        if (arr[l] + arr[a] == res) {
          return 1;
        } else if (arr[l] + arr[a] < res) {
          return l++;
        } else {
          l--;
        }
      }
    }

    let response = find_result(array, result);
    console.log(response);
  }
}
