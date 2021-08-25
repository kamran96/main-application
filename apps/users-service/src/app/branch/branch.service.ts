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

  async ListBranch(branchData = null) {
    try {
      const branch = await this.branchModel.find({
        status: 1,
        //   organizationId: branchData.organizationId
      });

      return branch;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async CreateOrUpdateBranch(branchDto, branchData = null) {
    if (branchDto && branchDto.isNewRecord === false) {
      try {
        const result = await this.FindBranchById(branchDto);
        // code goes for update branch
        if (Array.isArray(result) && result.length > 0) {
          const [branch] = result;
          const updatedBranch = { ...branch };
          delete updatedBranch.id;

          updatedBranch.name = branchDto.name || branch.name;
          updatedBranch.prefix = branchDto.prefix || branch.prefix;
          updatedBranch.email = branchDto.email || branch.email;
          updatedBranch.address = branchDto.address || branch.address;
          updatedBranch.phone_no = branchDto.phone_no || branch.phone_no;
          updatedBranch.fax_no = branchDto.fax_no || branch.fax_no;
          updatedBranch.isMain = branchDto.isMain || branch.isMain;
          updatedBranch.address = branchDto.address || branch.address;
          updatedBranch.status = 1;

          await this.branchModel.updateOne({ id: branchDto.id }, updatedBranch);
          return updatedBranch;
        }
        throw new HttpException('Invalid params', HttpStatus.BAD_REQUEST);
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    } else {
      try {
        // code goese for create
        const user = await this.userModel.findOne({
          id: branchData.userId,
          //   relations: ['role'],
        });

        const branch = new this.branchModel();
        branch.name = branchDto.name;
        branch.email = branchDto.email;
        branch.prefix = branchDto.prefix;
        branch.address = branchDto.address;
        (branch.phone_no = branchDto.phone_no),
          (branch.fax_no = branchDto.fax_no);
        branch.organizationId = branchDto.organizationId;
        branch.isMain = branchDto.isMain;
        branch.status = 1;
        branch.createdById = branchData.userId;
        branch.updatedById = branchData.userId;
        await branch.save();

        if (branchData.branchId === null) {
          await this.userModel.updateOne(
            { id: branchData.userId },
            { branchId: branch.id }
          );

          //   const new_user = await this.authService.CheckUser({
          //     username: user.username,
          //   });

          //   const user_with_organization = await this.authService.Login(new_user);

          //   return user_with_organization;
        } else return branch;
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }

  async FindBranchById(params) {
    const branch = await this.branchModel.find({
      id: params.id,
      status: 1,
      //   organizationId: branchData.organizationId
    });

    return branch;
  }

  async deleteBranch(params) {
    // await this.manager.update(Branches, { id: params.id }, { status: 0 });
    // const [branch] = await this.FindBranchById(params);
    // return branch;
  }
}
