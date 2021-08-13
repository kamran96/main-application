import { Module } from '@nestjs/common';
import { BranchService } from './branch.service';
import { AuthModule } from '../Auth/auth.module';
import { BranchController } from './branch.controller';

@Module({
  imports: [AuthModule],
  providers: [BranchService],
  controllers: [BranchController],
})
export class BranchModule {}
