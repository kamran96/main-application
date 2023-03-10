import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { BranchDto } from '../dto/branch.dto';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { BranchService } from './branch.service';

@Controller('branch')
export class BranchController {
  constructor(private branchService: BranchService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async index(@Req() req: Request) {
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
  async create(@Body() branchDto: BranchDto, @Req() req: Request) {
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
  async view(@Param() params) {
    try {
      const branch = await this.branchService.FindBranchById(params);

      if (branch) {
        return {
          message: 'Branch fetched successfully.',
          result: branch[0],
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

  @Delete(':id')
  async remove(@Param() params) {
    const branch = await this.branchService.deleteBranch(params);

    if (branch) {
      return {
        message: 'Resource modified successfully.',
        status: 1,
      };
    }

    throw new HttpException('Failed to get Item', HttpStatus.BAD_REQUEST);
  }
}
