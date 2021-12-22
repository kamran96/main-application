import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Response } from 'express';
import { IRequest, IAddress, IOrganization } from '@invyce/interfaces';
import { AuthService } from '../auth/auth.service';
import { OrganizationDto } from '../dto/organization.dto';
import { RbacService } from '../rbac/rbac.service';
import { Branch } from '../schemas/branch.schema';
import { Organization } from '../schemas/organization.schema';
import { OrganizationUser } from '../schemas/organizationUser.schema';
import { User } from '../schemas/user.schema';
import { SEND_FORGOT_PASSWORD } from '@invyce/send-email';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel(Organization.name) private organizationModel,
    @InjectModel(OrganizationUser.name) private organizationUserModel,
    @InjectModel(Branch.name) private branchModel,
    @InjectModel(User.name) private userModel,
    private rbacService: RbacService,
    private authService: AuthService,
    @Inject('EMAIL_SERVICE') private readonly emailService: ClientProxy
  ) {}

  async ListOrganizations(organizationData) {
    const org = await this.organizationUserModel.find({
      userId: { $in: organizationData.id },
    });

    const orgIds = org.map((ids) => ids.organizationId);
    const organization = await this.organizationModel
      .find({
        _id: { $in: orgIds },
        status: 1,
      })
      .populate('branches');

    return organization;
  }

  async CreateOrUpdateOrganization(
    organizationDto: OrganizationDto,
    req: IRequest,
    res: Response
  ): Promise<unknown> {
    const address: IAddress = {
      description: organizationDto.description,
      city: organizationDto.city,
      country: organizationDto.country,
      postalCode: organizationDto.postalCode,
    };

    if (organizationDto && organizationDto.isNewRecord === false) {
      // we need to update organization
      try {
        const organization = await this.organizationModel.findOne({
          _id: organizationDto.id,
        });

        if (organization) {
          const updatedOrganization = {
            name: organizationDto.name || organization.name,
            website: organizationDto.website || organization.website,
            attachmentId:
              organizationDto.attachmentId || organization.attachmentId,
            phoneNumber:
              organizationDto.phoneNumber || organization.phoneNumber,
            faxNumber: organizationDto.faxNumber || organization.faxNumber,
            prefix: organizationDto.prefix || organization.prefix,
            email: organizationDto.email || organization.email,
            organizationType:
              organizationDto.organizationType || organization.organizationType,
            niche: organizationDto.niche || organization.niche,
            permanentAddress:
              organizationDto.permanentAddress || organization.permanentAddress,
            address: address,
            residentialAddress:
              organizationDto.residentialAddress ||
              organization.residentialAddress,
            financialEnding:
              organizationDto.financialEnding || organization.financialEnding,
            status: 1 || organization.status,
          };

          await this.organizationModel.updateOne(
            { _id: organizationDto.id },
            updatedOrganization
          );

          return await this.organizationModel.findOne({
            _id: organizationDto.id,
          });
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
        organization.address = address;
        organization.createdById = req?.user?.id;
        organization.updatedById = req?.user?.id;
        organization.status = 1;
        await organization.save();

        const organizationUser = new this.organizationUserModel();
        organizationUser.organizationId = organization.id;
        organizationUser.userId = req?.user?.id;
        organizationUser.status = 1;
        await organizationUser.save();

        const branchArr = [];
        if (
          req?.user?.organizationId === null &&
          organization.organizationType === 'SAAS'
        ) {
          const branch = new this.branchModel();
          branch.organizationId = organization._id;
          await branch.save();

          branchArr.push(branch);
        }

        const http = axios.create({
          baseURL: 'http://localhost',
        });

        await http.post(`accounts/account/init`, {
          user: {
            id: req?.user?.id,
            organizationId: organization.id,
          },
        });

        const roles = await this.rbacService.InsertRoles(organization.id);
        await this.rbacService.InsertRolePermission(organization.id);
        const [adminRole] = roles.filter((r) => r.name === 'admin');

        if (req?.user?.organizationId !== null) {
          return organization;
        } else {
          await this.userModel.updateOne(
            { _id: req?.user?.id },
            {
              organizationId: organization.id,
              roleId: adminRole.id,
              branchId: branchArr.length > 0 ? branchArr[0].id : null,
            }
          );

          const users = await this.authService.CheckUser({
            username: req.user.username,
          });

          const payload = {
            to: req.user.email,
            from: 'no-reply@invyce.com',
            TemplateAlias: 'trial-started',
            TemplateModel: {
              product_url: 'product_url_Value',
              user_name: req.user.profile.fullName,
              sender_name: 'sender_name_Value',
              product_name: 'product_name_Value',
              congrates_illustration_image:
                'congrates_illustration_image_Value',
              action_url: 'action_url_Value',
              trial_extension_url: 'trial_extension_url_Value',
              feedback_url: 'feedback_url_Value',
              export_url: 'export_url_Value',
              close_account_url: 'close_account_url_Value',
              company_name: 'company_name_Value',
              company_address: 'company_address_Value',
            },
          };

          await this.emailService.emit(SEND_FORGOT_PASSWORD, payload);

          return await this.authService.Login(users, res);
        }
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }

  async ViewOrganization(organizationId: string): Promise<IOrganization> {
    const organization = await this.organizationModel
      .findOne({
        _id: organizationId,
      })
      .populate('branches');

    return organization;
  }
}
