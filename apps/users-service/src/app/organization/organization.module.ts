import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { RbacModule } from '../rbac/rbac.module';
import { Branch, BranchSchema } from '../schemas/branch.schema';
import {
  Organization,
  OrganizationSchema,
} from '../schemas/organization.schema';
import {
  OrganizationUser,
  OrganizationUserSchema,
} from '../schemas/organizationUser.schema';
import { User, UserSchema } from '../schemas/user.schema';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Organization.name, schema: OrganizationSchema },
      { name: OrganizationUser.name, schema: OrganizationUserSchema },
      { name: Branch.name, schema: BranchSchema },
      { name: User.name, schema: UserSchema },
    ]),
    RbacModule,
    AuthModule,
  ],
  providers: [OrganizationService],
  controllers: [OrganizationController],
})
export class OrganizationModule {}
