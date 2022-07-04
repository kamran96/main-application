import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IBaseUser, IBranch } from '@invyce/interfaces';
import { BranchDto } from '../dto/branch.dto';
import { Branch } from '../schemas/branch.schema';
import { User } from '../schemas/user.schema';

@Injectable()
export class BranchService {
  constructor(
    @InjectModel(Branch.name) private branchModel,
    @InjectModel(User.name) private userModel
  ) {}

  async ListBranch(branchData: IBaseUser): Promise<IBranch[]> {
    try {
      const branch = await this.branchModel.find({
        status: 1,
        organizationId: branchData.organizationId,
      });

      return branch;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async CreateOrUpdateBranch(
    branchDto: BranchDto,
    branchData: IBaseUser
  ): Promise<IBranch> {
    if (branchDto && branchDto.isNewRecord === false) {
      try {
        const branch = await this.FindBranchById(branchDto.id);
        // code goes for update branch
        if (branch) {
          const address = {
            description: branchDto?.description || branch?.address?.description,
            city: branchDto?.city || branch?.address?.city,
            country: branchDto?.country || branch?.address?.country,
            postalAddress: branchDto?.postalCode || branch?.address?.postalCode,
          };
          const updatedBranch = {
            name: branchDto.name || branch.name,
            prefix: branchDto.prefix || branch.prefix,
            email: branchDto.email || branch.email,
            phoneNumber: branchDto.phoneNumber || branch.phoneNumber,
            faxNumber: branchDto.faxNumber || branch.faxNumber,
            isMain: branchDto.isMain || branch.isMain,
            address: address,
            organizationId: branch.organizationId,
            createdById: branch.createdById,
            updatedById: branchData.id,
            status: 1,
          };

          await this.branchModel.updateOne(
            { _id: branchDto.id },
            updatedBranch
          );
          return await this.FindBranchById(branchDto.id);
        }
        throw new HttpException('Invalid params', HttpStatus.BAD_REQUEST);
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    } else {
      try {
        const address = {
          description: branchDto?.description,
          city: branchDto.city,
          country: branchDto.country,
          postalCode: branchDto.postalCode,
        };

        const branch = new this.branchModel();
        branch.name = branchDto.name;
        branch.email = branchDto.email;
        branch.prefix = branchDto.prefix;
        branch.address = address;
        branch.phoneNumber = branchDto.phoneNumber;
        branch.faxNumber = branchDto.faxNumber;
        branch.organizationId = branchData.organizationId;
        branch.isMain = branchDto.isMain;
        branch.status = 1;
        branch.createdById = branchData.id;
        branch.updatedById = branchData.id;
        await branch.save();

        // if (branchData.branchId === null) {
        // await this.userModel.updateOne(
        // { id: branchData.userId },
        // { branchId: branch.id }
        // );

        //   const new_user = await this.authService.CheckUser({
        //     username: user.username,
        //   });

        //   const user_with_organization = await this.authService.Login(new_user);

        //   return user_with_organization;
        // } else
        return branch;
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }

  async FindBranchById(branchId: number): Promise<IBranch> {
    return await this.branchModel.findById(branchId);
  }

  // async deleteBranch(params: number) {
  // console.log(params);
  // await this.manager.update(Branches, { id: params.id }, { status: 0 });
  // const [branch] = await this.FindBranchById(params);
  // return branch;
  // }
}
