import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { OrganizationDto } from '../dto/organization.dto';
import { OrganizationService } from './organization.service';

@Controller('organization')
export class OrganizationController {
  constructor(private organizationService: OrganizationService) {}

  // @UseGuards(JwtAuthGuard)
  // @Get()
  // async index(@Req() req: Request) {
  //   try {
  //     const organization = await this.organizationService.ListOrganizations(
  //       req.user,
  //     );

  //     if (organization) {
  //       return {
  //         message: 'Organization fetched successfully',
  //         result: organization,
  //       };
  //     }
  //   } catch (error) {
  //     throw new HttpException(
  //       `Sorry! Something went wrong, ${error.message}`,
  //       error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  // @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() organizationDto: OrganizationDto, @Req() req: Request) {
    try {
      const organization =
        await this.organizationService.CreateOrUpdateOrganization(
          organizationDto
          // req.user,
        );

      if (organization) {
        return {
          message: 'Organization created successfully',
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

  // @UseGuards(JwtAuthGuard)
  @Get(':id')
  async view(@Param() params, @Req() req: Request) {
    try {
      const organization = await this.organizationService.ViewOrganization(
        params
      );

      if (organization) {
        return {
          message: 'Organization recieved successfully',
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
