import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager, getCustomRepository } from 'typeorm';
import { OrganizationDto } from '../dto/organization.dto';
import { Branches, Users } from '../entities';
import {
  AddressRepository,
  BranchRepository,
  UserRepository,
} from '../repositories';
import { AuthService } from '../Auth/auth.service';

@Injectable()
export class BranchService {
  constructor(
    private manager: EntityManager,
    private authService: AuthService
  ) {}

  async ListBranch(branchData) {
    try {
      const branchRepository = getCustomRepository(BranchRepository);
      const branch = await branchRepository.find({
        where: {
          status: 1,
          //   organizationId: branchData.organizationId
        },
      });

      return branch;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async CreateOrUpdateBranch(branchDto, branchData) {
    const branchRepository = getCustomRepository(BranchRepository);
    if (branchDto && branchDto.isNewRecord === false) {
      try {
        const result = await this.FindBranchById(branchDto);
        // code goes for update branch
        if (Array.isArray(result) && result.length > 0) {
          const [branch] = result;
          const updatedBranch = { ...branch };
          delete updatedBranch.id;

          let newAddress = [];
          if (branch.addressId !== null) {
            await getCustomRepository(AddressRepository).update(
              { id: branch.addressId },
              {
                city: branchDto.city,
                postalCode: branchDto.postalCode,
              }
            );
          } else {
            const address = await getCustomRepository(AddressRepository).save({
              city: branchDto.city,
              postalCode: branchDto.postalCode,
            });
            newAddress.push(address);
          }

          updatedBranch.name = branchDto.name || branch.name;
          updatedBranch.prefix = branchDto.prefix || branch.prefix;
          updatedBranch.email = branchDto.email || branch.email;
          updatedBranch.address = branchDto.address || branch.address;
          updatedBranch.phone_no = branchDto.phone_no || branch.phone_no;
          updatedBranch.fax_no = branchDto.fax_no || branch.fax_no;
          updatedBranch.isMain = branchDto.isMain || branch.isMain;
          updatedBranch.addressId =
            newAddress.length > 0 ? newAddress[0].id : branch.addressId;
          updatedBranch.status = 1;

          await this.manager.update(
            Branches,
            { id: branchDto.id },
            updatedBranch
          );
          return updatedBranch;
        }
        throw new HttpException('Invalid params', HttpStatus.BAD_REQUEST);
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    } else {
      try {
        // code goese for create
        const userRepository = getCustomRepository(UserRepository);
        const [user] = await userRepository.find({
          where: {
            id: branchData.userId,
          },
          relations: ['role'],
        });

        const address = await getCustomRepository(AddressRepository).save({
          city: branchDto.city,
          postalCode: branchDto.postalCode,
        });

        const branch = await branchRepository.save({
          name: branchDto.name,
          email: branchDto.email,
          prefix: branchDto.prefix,
          address: branchDto.address,
          addressId: address.id,
          phone_no: branchDto.phone_no,
          fax_no: branchDto.fax_no,
          organizationId: branchDto.organizationId,
          isMain: branchDto.isMain,
          status: 1,
          createdById: branchData.userId,
          updatedById: branchData.userId,
        });

        if (branchData.branchId === null) {
          await this.manager.update(
            Users,
            { id: branchData.userId },
            { branchId: branch.id }
          );

          const new_user = await this.authService.CheckUser({
            username: user.username,
          });

          const user_with_organization = await this.authService.Login(new_user);

          return user_with_organization;
        } else return branch;
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }

  async FindBranchById(params) {
    const branchRepository = getCustomRepository(BranchRepository);
    const branch = await branchRepository.find({
      where: {
        id: params.id,
        status: 1,
        //   organizationId: branchData.organizationId
      },
    });

    return branch;
  }

  async deleteBranch(params) {
    await this.manager.update(Branches, { id: params.id }, { status: 0 });
    const [branch] = await this.FindBranchById(params);
    return branch;
  }
}
