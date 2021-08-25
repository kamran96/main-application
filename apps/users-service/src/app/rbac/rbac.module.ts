import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Permission, PermissionSchema } from '../schemas/permission.schema';
import { Role, RoleSchema } from '../schemas/role.schema';
import {
  RolePermission,
  RolePermissionSchema,
} from '../schemas/rolePermission.schema';
import { User, UserSchema } from '../schemas/user.schema';
import { RbacController } from './rbac.controller';
import { RbacService } from './rbac.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Role.name, schema: RoleSchema },
      { name: Permission.name, schema: PermissionSchema },
      { name: RolePermission.name, schema: RolePermissionSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [RbacService],
  controllers: [RbacController],
})
export class RbacModule {}
