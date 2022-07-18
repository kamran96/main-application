import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Response } from 'express';
import * as moment from 'moment';
import { currencies } from 'currencies.json';
import {
  IRequest,
  IAddress,
  IOrganization,
  IBaseUser,
} from '@invyce/interfaces';
import { AuthService } from '../auth/auth.service';
import { OrganizationDto } from '../dto/organization.dto';
import { RbacService } from '../rbac/rbac.service';
import { Branch } from '../schemas/branch.schema';
import { Organization } from '../schemas/organization.schema';
import { OrganizationUser } from '../schemas/organizationUser.schema';
import { User } from '../schemas/user.schema';
import { ORGANIZATION_CREATED, TRAIL_STARTED } from '@invyce/send-email';
import { Currency } from '../schemas/currency.schema';
import { Host } from '@invyce/global-constants';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel(Organization.name) private organizationModel,
    @InjectModel(OrganizationUser.name) private organizationUserModel,
    @InjectModel(Branch.name) private branchModel,
    @InjectModel(User.name) private userModel,
    @InjectModel(Currency.name) private currencyModel,
    private rbacService: RbacService,
    private authService: AuthService,
    @Inject('EMAIL_SERVICE') private readonly emailService: ClientProxy // @Inject('REPORT_SERVICE') private readonly reportService: ClientProxy
  ) {}

  async ListOrganizations(req) {
    if (!req || !req.cookies) return null;
    const token = req?.cookies['access_token'];

    const org = await this.organizationUserModel.find({
      userId: { $in: req.user.id },
    });

    const orgIds = org.map((ids) => ids.organizationId);
    const organization = await this.organizationModel
      .find({
        _id: { $in: orgIds },
        status: 1,
      })
      .populate('currency')
      .populate('branches');
    const mapAttachmentIds = organization.map((i) => i.attachmentId);

    const { data: attachments } = await axios.post(
      Host('attachments', `attachments/attachment/ids`),
      {
        ids: mapAttachmentIds,
      },
      {
        headers: {
          cookie: `access_token=${token}`,
        },
      }
    );

    const new_organization = [];
    for (const i of organization) {
      new_organization.push({
        ...i.toObject(),
        attachment: await attachments.find((c) => i.attachmentId === c.id),
      });
    }

    return new_organization;
  }

  async InsertCurrency() {
    for (const i of currencies) {
      const currency = new this.currencyModel(i);
      await currency.save();
    }
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
            currencyId: organizationDto.currencyId || organization.currencyId,
            financialEnding:
              organizationDto.financialEnding || organization.financialEnding,
            status: 1 || organization.status,
          };

          await this.organizationModel.updateOne(
            { _id: organizationDto.id },
            updatedOrganization
          );

          const updatedOrg = await this.organizationModel.findOne({
            _id: organizationDto.id,
          });

          return res.status(201).send({
            message: 'Organization updated successfully',
            status: true,
            result: updatedOrg,
          });
        }
        throw new HttpException('Invalid Params', HttpStatus.BAD_REQUEST);
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    } else {
      try {
        // we need to create organization

        const organizations = await this.organizationUserModel.find({
          userId: req.user.id,
        });

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
        organization.isActive = organizations.length === 0 ? true : false;
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

        const currency = await this.currencyModel.find();
        if (currency.length === 0) {
          await this.InsertCurrency();
        }

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

        if (!req || !req.cookies) return null;
        const token = req?.cookies['access_token'];

        await axios.post(
          Host('accounts', 'accounts/account/init'),
          {
            user: {
              id: req?.user?.id,
              organizationId: organization.id,
            },
          },
          {
            headers: {
              cookie: `access_token=${token}`,
            },
          }
        );

        const roles = await this.rbacService.InsertRoles(organization.id);
        await this.rbacService.InsertRolePermission(organization.id);
        const [adminRole] = roles.filter((r) => r.name === 'admin');

        if (req?.user?.organizationId !== null) {
          await this.emailService.emit(ORGANIZATION_CREATED, {
            org_name: organization.name,
            user_name: req.user.profile.fullName,
            to: req.user.email,
          });

          const branch = new this.branchModel();
          branch.organizationId = organization._id;
          await branch.save();

          branchArr.push(branch);

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

          const nextSevenDay = moment().add(7, 'days').format('YYYY-MM-DD');

          await this.emailService.emit(TRAIL_STARTED, {
            to: req.user.email,
            user_name: req.user.profile.fullName,
            next_7_days: nextSevenDay,
            sender_name: 'Ehsanullah baig',
          });

          const users = await this.authService.CheckUser({
            username: req.user.username,
          });

          return await this.authService.Login(users, res);
        }
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }

  async ChangeOrganization(user: IBaseUser, body, res: Response) {
    const organization = await this.organizationModel
      .findOne({ _id: body.organizationId })
      .populate('branches');

    await this.userModel.updateOne(
      { _id: user?.id },
      {
        organizationId: organization.id,
        branchId: organization.branches[0].id,
      }
    );

    await this.organizationModel.updateOne(
      { _id: body.organizationId },
      {
        isActive: true,
      }
    );

    const org = await this.organizationUserModel.find({
      userId: { $in: user.id },
    });

    const orgIds = org.map((ids) => ids.organizationId);
    const organizations = await this.organizationModel.find({
      _id: { $in: orgIds },
      status: 1,
    });

    for (const i of organizations) {
      const organization = await this.organizationModel.findById(i.id);

      if (organization.id !== body.organizationId) {
        await this.organizationModel.updateOne(
          { _id: organization.id },
          {
            isActive: false,
          }
        );
      }
    }

    const users = await this.authService.CheckUser({
      username: user.username,
    });

    return await this.authService.Login(users, res);
  }

  async ViewOrganization(
    organizationId: string,
    req: IRequest
  ): Promise<IOrganization> {
    if (!req || !req.cookies) return null;
    const token = req?.cookies['access_token'];

    const organization = await this.organizationModel
      .findOne({
        _id: organizationId,
      })
      .populate('branches')
      .populate('currency');

    const orgArray = [];
    if (organization.attachmentId !== undefined) {
      const { data: attachment } = await axios.post(
        Host('attachments', `attachments/attachment/ids`),
        {
          ids: [organization.attachmentId],
        },
        {
          headers: {
            cookie: `access_token=${token}`,
          },
        }
      );
      orgArray.push({
        ...organization.toObject(),
        attachment: attachment.length === 1 ? attachment[0] : attachment,
      });
    }

    return orgArray.length > 0 ? orgArray[0] : organization;
  }
}
