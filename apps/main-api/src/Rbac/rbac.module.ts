import { Module } from '@nestjs/common';
import { RbacController } from './rbac.controller';
import { RbacService } from './rbac.service';
import { PaginationModule } from '../Common/modules/pagination.module';

@Module({
  imports: [PaginationModule],
  providers: [RbacService],
  exports: [RbacService],
  controllers: [RbacController],
})
export class RbacModule {}
