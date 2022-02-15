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
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { IRequest, IOrganizationResponse, IBaseUser } from '@invyce/interfaces';
import { GlobalAuthGuard } from '@invyce/global-auth-guard';
import { OrganizationDto, OrganizationParams } from '../dto/organization.dto';
import { OrganizationService } from './organization.service';

@Controller('organization')
export class OrganizationController {
  constructor(private organizationService: OrganizationService) {}

  @Get()
  @UseGuards(GlobalAuthGuard)
  async index(@Req() req: IBaseUser): Promise<IOrganizationResponse> {
    try {
      const organization = await this.organizationService.ListOrganizations(
        req
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
  @UseGuards(GlobalAuthGuard)
  async create(
    @Body() organizationDto: OrganizationDto,
    @Req() req: IRequest,
    @Res() res: Response
  ) {
    try {
      const organization =
        await this.organizationService.CreateOrUpdateOrganization(
          organizationDto,
          req,
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
  async view(
    @Param() params: OrganizationParams
  ): Promise<IOrganizationResponse> {
    try {
      const organization = await this.organizationService.ViewOrganization(
        params.id
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
