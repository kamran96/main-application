import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { AuthStrategy } from '../auth/auth.strategy';
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
    ClientsModule.register([
      {
        name: 'EMAIL_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'email_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    ClientsModule.register([
      {
        name: 'REPORT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'report_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    RbacModule,
    AuthModule,
  ],
  providers: [OrganizationService],
  controllers: [OrganizationController],
})
export class OrganizationModule {}
