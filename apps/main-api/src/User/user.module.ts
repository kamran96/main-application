import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from '../Auth/auth.module';
import { PaginationModule } from '../Common/modules/pagination.module';

@Module({
  imports: [PaginationModule, AuthModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
