import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Branch } from '../schemas/branch.schema';
import { User } from '../schemas/user.schema';

@Injectable()
export class BranchService {
  constructor(
    @InjectModel(Branch.name) private branchModel,
    @InjectModel(User.name) private userModel
  ) {}

  async ListBranch(branchData) {
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

  async CreateOrUpdateBranch(branchDto, branchData = null) {
    if (branchDto && branchDto.isNewRecord === false) {
      try {
        const branch = await this.FindBranchById(branchDto.id);
        // code goes for update branch
        if (branch) {
          const updatedBranch: any = {};
          const address = {
            description:
              branchDto?.address?.description || branch?.address?.description,
            city: branchDto?.address?.city || branch?.address?.city,
            country: branchDto?.address?.country || branch?.address?.country,
            postalCode:
              branchDto?.address?.postalCode || branch?.address?.postalCode,
          };

          updatedBranch.name = branchDto.name || branch.name;
          updatedBranch.prefix = branchDto.prefix || branch.prefix;
          updatedBranch.email = branchDto.email || branch.email;
          updatedBranch.phoneNumber =
            branchDto.phoneNumber || branch.phoneNumber;
          updatedBranch.faxNumber = branchDto.faxNumber || branch.faxNumber;
          updatedBranch.isMain = branchDto.isMain || branch.isMain;
          updatedBranch.address = address;
          updatedBranch.organizationId = branch.organizationId;
          updatedBranch.createdById = branch.createdById;
          updatedBranch.updatedById = branchData.id;
          updatedBranch.status = 1;

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
        // code goese for create
        // const user = await this.userModel.findOne({
        // id: branchData.userId,
        //   relations: ['role'],
        // });

        const branch = new this.branchModel();
        branch.name = branchDto.name;
        branch.email = branchDto.email;
        branch.prefix = branchDto.prefix;
        branch.address = branchDto.address;
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

  async FindBranchById(branchId) {
    return await this.branchModel.findById(branchId);
  }

  async deleteBranch(params) {
    // await this.manager.update(Branches, { id: params.id }, { status: 0 });
    // const [branch] = await this.FindBranchById(params);
    // return branch;
  }
}
