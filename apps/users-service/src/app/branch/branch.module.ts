import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Branch, BranchSchema } from '../schemas/branch.schema';
import { User, UserSchema } from '../schemas/user.schema';
import { BranchController } from './branch.controller';
import { BranchService } from './branch.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Branch.name, schema: BranchSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [BranchService],
  controllers: [BranchController],
})
export class BranchModule {}
