import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { XeroService } from './xero.service';
import { GlobalAuthGuard } from '@invyce/global-auth-guard';

@Controller('xero')
export class XeroController {
  constructor(private xeroService: XeroService) {}

  @Post()
  async xeroConnect() {
    const xero = await this.xeroService.XeroConnect();

    if (xero) {
      return {
        message: 'successfull',
        result: xero,
        status: true,
      };
    }
  }

  @UseGuards(GlobalAuthGuard)
  @Post('/callback')
  async xerocallback(@Body() data, @Req() req: Request) {
    try {
      const xero = await this.xeroService.XeroCallback(data.token, req.user);

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
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @UseGuards(GlobalAuthGuard)
  @Post('/fetch-from-xero')
  async importDataFromXero(@Body() dto, @Req() req: Request) {
    try {
      const xero = await this.xeroService.ImportDataFromXero(
        dto.modules,
        req.user
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
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
