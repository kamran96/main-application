import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Branch } from '../schemas/branch.schema';
import { Organization } from '../schemas/organization.schema';
import { OrganizationUser } from '../schemas/organizationUser.schema';
import { User } from '../schemas/user.schema';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel(Organization.name) private organizationModel,
    @InjectModel(OrganizationUser.name) private organizationUserModel,
    @InjectModel(Branch.name) private branchModel,
    @InjectModel(User.name) private userModel
  ) {}

  async CreateOrUpdateOrganization(
    organizationDto,
    organizationData = null
  ): Promise<any> {
    if (organizationDto && organizationDto.isNewRecord === false) {
      // we need to update organization
      try {
        const result = await this.organizationModel.find({
          id: organizationDto.id,
        });

        if (Array.isArray(result) && result.length > 0) {
          const [organization] = result;
          const updatedOrganization = { ...organization };
          delete updatedOrganization.id;

          updatedOrganization.name = organizationDto.name || organization.name;
          updatedOrganization.website =
            organizationDto.website || organization.website;
          updatedOrganization.attachmentId =
            organizationDto.attachmentId || organization.attachmentId;
          updatedOrganization.phoneNumber =
            organizationDto.phoneNumber || organization.phoneNumber;
          updatedOrganization.faxNumber =
            organizationDto.faxNumber || organization.faxNumber;
          updatedOrganization.prefix =
            organizationDto.prefix || organization.prefix;
          updatedOrganization.email =
            organizationDto.email || organization.email;
          updatedOrganization.organizationType =
            organizationDto.organizationType || organization.organizationType;
          updatedOrganization.niche =
            organizationDto.niche || organization.niche;
          updatedOrganization.permanentAddress =
            organizationDto.permanentAddress || organization.permanentAddress;
          updatedOrganization.address =
            organizationDto.address || organization.address;
          updatedOrganization.residentialAddress =
            organizationDto.residentialAddress ||
            organization.residentialAddress;
          updatedOrganization.financialEnding =
            organizationDto.financialEnding || organization.financialEnding;
          updatedOrganization.status = 1 || organization.status;

          await this.organizationModel.updateOne(
            { id: organizationDto.id },
            updatedOrganization
          );

          return updatedOrganization;
        }
        throw new HttpException('Invalid Params', HttpStatus.BAD_REQUEST);
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    } else {
      try {
        // we need to create organization

        const organization = new this.organizationModel();
        organization.name = organizationDto.name;
        organization.niche = organizationDto.niche;
        organization.organizationType = 'SAAS';
        organization.permanentAddress = organizationDto.permanentAddress;
        organization.residentialAddress = organizationDto.residentialAddress;
        organization.financialEnding = organizationDto.financialEnding;
        organization.packageId = organizationDto.packageId;
        organization.currencyId = organizationDto.currencyId;
        organization.email = organizationDto.email;
        organization.website = organizationDto.website;
        organization.prefix = organizationDto.prefix;
        organization.phoneNumber = organizationDto.phoneNumber;
        organization.faxNumber = organizationDto.faxNumber;
        organization.attachmentId = organizationDto.attachmentId;
        organization.address = organizationDto.address;
        organization.status = 1;
        await organization.save();

        const organizationUser = await this.organizationUserModel();
        organizationUser.organizationId = organization.id;
        organizationUser.userId = organizationData.userId;
        organizationUser.roleId = organizationData.roleId;
        organizationUser.createdById = organizationData.userId;
        organizationUser.updatedById = organizationData.userId;
        organizationUser.status = 1;
        await organizationUser.save();

        // let branchArr = [];
        // if (organization.organizationType === 'SAAS') {
        // const branch = new this.branchModel();

        // (branch.organizationId = organization.id), await branch.save();
        // branchArr.push(branch);
        // }

        // await this.accountService.initAccounts(organization, organizationData);

        // const roles = await this.rbacService.InsertRoles(organization.id);
        // await this.rbacService.InsertRolePermission(organization.id);

        // const [adminRole] = roles.filter((r) => r.name === 'admin');

        // if (organizationData.organizationId === null) {
        // await this.userModel.updateOne(
        // { id: organizationData.userId },
        // {
        // organizationId: organization.id,
        //   roleId: adminRole.id,
        // branchId: branchArr.length > 0 ? branchArr[0].id : null,
        // }
        // );

        //   const new_user = await this.authService.CheckUser({
        //     username: organizationData.user_name,
        //   });

        //   const user_with_organization = await this.authService.Login(new_user);

        //   return user_with_organization;
        // } else {
        // return organization;
        // }

        return organization;
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }

  async ViewOrganization(params) {
    const organization = await this.organizationModel.findOne({
      id: params.id,
    });

    return organization;
  }
}
