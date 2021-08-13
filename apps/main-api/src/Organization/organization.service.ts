import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager, getCustomRepository } from 'typeorm';
import { Organizations, Users } from '../entities';
import { IOrganization } from '../interfaces/IOrganization';
import {
  AddressRepository,
  BranchRepository,
  OrganizationRepository,
  OrganizationUserRepository,
  UserRepository,
} from '../repositories';
import { AccountService } from '../Account/account.service';
import { AuthService } from '../Auth/auth.service';
import { RbacService } from '../Rbac/rbac.service';

@Injectable()
export class OrganizationService {
  constructor(
    private manager: EntityManager,
    private accountService: AccountService,
    private authService: AuthService,
    private rbacService: RbacService,
  ) {}

  async ListOrganizations(organizationData) {
    const organizationRepository = getCustomRepository(OrganizationRepository);
    const organization = await organizationRepository.find({
      where: {
        status: 1,
      },
    });

    return organization;
  }

  async CreateOrUpdateOrganization(
    organizationDto,
    organizationData,
  ): Promise<any> {
    const organizationRepository = getCustomRepository(OrganizationRepository);
    if (organizationDto && organizationDto.isNewRecord === false) {
      // we need to update organization
      try {
        const result = await organizationRepository.find({
          where: {
            id: organizationDto.id,
          },
        });

        if (Array.isArray(result) && result.length > 0) {
          const [organization] = result;
          const updatedOrganization = { ...organization };
          delete updatedOrganization.id;

          let newOrg = [];
          if (organization.addressId !== null) {
            await getCustomRepository(AddressRepository).update(
              { id: organization.addressId },
              {
                city: organizationDto.city,
                country: organizationDto.country,
                postalCode: organizationDto.postalCode,
              },
            );
          } else {
            const address = await getCustomRepository(AddressRepository).save({
              city: organizationDto.city,
              country: organizationDto.country,
              postalCode: organizationDto.postalCode,
            });
            newOrg.push(address);
          }

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
          updatedOrganization.addressId =
            newOrg.length > 0 ? newOrg[0].id : organization.addressId;

          updatedOrganization.residentialAddress =
            organizationDto.residentialAddress ||
            organization.residentialAddress;
          updatedOrganization.financialEnding =
            organizationDto.financialEnding || organization.financialEnding;
          updatedOrganization.status = 1 || organization.status;

          await this.manager.update(
            Organizations,
            { id: organizationDto.id },
            updatedOrganization,
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

        const organizationUserRepository = getCustomRepository(
          OrganizationUserRepository,
        );

        const address = await getCustomRepository(AddressRepository).save({
          city: organizationDto.city,
          country: organizationDto.country,
          postalCode: organizationDto.postalCode,
        });

        const organization = await organizationRepository.save({
          name: organizationDto.name,
          niche: organizationDto.niche,
          organizationType: 'SAAS',
          permanentAddress: organizationDto.permanentAddress,
          residentialAddress: organizationDto.residentialAddress,
          financialEnding: organizationDto.financialEnding,
          packageId: organizationDto.packageId,
          currencyId: organizationDto.currencyId,
          email: organizationDto.email,
          website: organizationDto.website,
          prefix: organizationDto.prefix,
          phoneNumber: organizationDto.phoneNumber,
          faxNumber: organizationDto.faxNumber,
          attachmentId: organizationDto.attachmentId,
          addressId: address.id,
          status: 1,
        });

        await organizationUserRepository.save({
          organizationId: organization.id,
          userId: organizationData.userId,
          roleId: organizationData.roleId,
          createdById: organizationData.userId,
          updatedById: organizationData.userId,
          status: 1,
        });

        let branchArr = [];
        if (organization.organizationType === 'SAAS') {
          const branch = await getCustomRepository(BranchRepository).save({
            organizationId: organization.id,
          });
          branchArr.push(branch);
        }

        await this.accountService.initAccounts(organization, organizationData);

        const roles = await this.rbacService.InsertRoles(organization.id);
        await this.rbacService.InsertRolePermission(organization.id);

        const [adminRole] = roles.filter(r => r.name === 'admin');

        if (organizationData.organizationId === null) {
          await this.manager.update(
            Users,
            { id: organizationData.userId },
            {
              organizationId: organization.id,
              roleId: adminRole.id,
              branchId: branchArr.length > 0 ? branchArr[0].id : null,
            },
          );

          const new_user = await this.authService.CheckUser({
            username: organizationData.user_name,
          });

          const user_with_organization = await this.authService.Login(new_user);

          return user_with_organization;
        } else {
          return organization;
        }
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }

  async ViewOrganization(params) {
    const organizationRepository = getCustomRepository(OrganizationRepository);
    const [organization] = await organizationRepository.find({
      where: { id: params.id },
    });

    return organization;
  }
}
