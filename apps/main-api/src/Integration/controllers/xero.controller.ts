import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../../jwt-auth.guard';
import { XeroService } from '../services/xero.service';

@Controller('integrate')
export class XeroController {
  constructor(private integrationService: XeroService) {}

  @Post('/xero')
  async xeroConnect() {
    const xero = await this.integrationService.XeroConnect();

    if (xero) {
      return {
        message: 'successfull',
        result: xero,
        status: true,
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/callback')
  async xerocallback(@Body() data, @Req() req: Request) {
    try {
      const xero = await this.integrationService.XeroCallback(
        data.token,
        req.user,
      );

      if (xero) {
        return {
          message: 'successfull',
          result: xero,
          status: true,
        };
      }
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/fetch-from-xero')
  async importDataFromXero(@Body() dto, @Req() req: Request) {
    try {
      const xero = await this.integrationService.ImportDataFromXero(
        dto.modules,
        req.user,
      );

      if (xero) {
        return {
          message: 'successfull',
          result: xero,
          status: true,
        };
      }
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
