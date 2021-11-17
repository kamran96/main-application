import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { IRequest, IBranchDetail, IBranchParams } from '@invyce/interfaces';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BranchDto } from '../dto/branch.dto';
import { BranchService } from './branch.service';

@Controller('branch')
export class BranchController {
  constructor(private branchService: BranchService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async index(@Req() req: IRequest): Promise<IBranchDetail> {
    try {
      const branch = await this.branchService.ListBranch(req.user);

      if (branch) {
        return {
          message: 'Branch fetched successfully.',
          result: branch,
        };
      }
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() branchDto: BranchDto,
    @Req() req: IRequest
  ): Promise<IBranchDetail> {
    try {
      const branch = await this.branchService.CreateOrUpdateBranch(
        branchDto,
        req.user
      );

      if (branch) {
        return {
          message: 'Branch created successfully.',
          result: branch,
        };
      }
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async show(@Param() params: IBranchParams): Promise<IBranchDetail> {
    try {
      const branch = await this.branchService.FindBranchById(params.id);

      if (branch) {
        return {
          message: 'Branch fetched successfully.',
          result: branch,
        };
      }

      throw new HttpException('Failed to get Branch', HttpStatus.BAD_REQUEST);
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // @Delete(':id')
  // async remove(@Param() params) {
  // const branch = await this.branchService.deleteBranch(params);

  // if (branch) {
  //   return {
  //     message: 'Resource modified successfully.',
  //     status: 1,
  //   };
  // }

  // throw new HttpException('Failed to get Item', HttpStatus.BAD_REQUEST);
  // }
}
