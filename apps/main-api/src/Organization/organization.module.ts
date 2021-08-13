import { Module } from '@nestjs/common';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { AccountModule } from '../Account/account.module';
import { AuthModule } from '../Auth/auth.module';
import { RbacModule } from '../Rbac/rbac.module';

@Module({
  imports: [AuthModule, AccountModule, RbacModule],
  providers: [OrganizationService],
  controllers: [OrganizationController],
})
export class OrganizationModule {}
