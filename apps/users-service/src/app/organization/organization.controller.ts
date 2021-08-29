import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrganizationDto } from '../dto/organization.dto';
import { OrganizationService } from './organization.service';

@Controller('organization')
export class OrganizationController {
  constructor(private organizationService: OrganizationService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async index(@Req() req: Request) {
    try {
      const organization = await this.organizationService.ListOrganizations(
        req.user
      );

      if (organization) {
        return {
          message: 'Organization fetched successfully',
          status: true,
          result: organization,
        };
      }
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() organizationDto: OrganizationDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    try {
      const organization =
        await this.organizationService.CreateOrUpdateOrganization(
          organizationDto,
          req.user,
          res
        );

      if (organization) {
        return {
          message: 'Organization created successfully',
          status: true,
          result: organization,
        };
      }
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async view(@Param() params, @Req() req: Request) {
    try {
      const organization = await this.organizationService.ViewOrganization(
        params
      );

      if (organization) {
        return {
          message: 'Organization recieved successfully',
          status: true,
          result: organization,
        };
      }

      throw new HttpException(
        'Failed to get Organization',
        HttpStatus.BAD_REQUEST
      );
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
