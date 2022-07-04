import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { XeroService } from './xero.service';
import { GlobalAuthGuard } from '@invyce/global-auth-guard';
import { IRequest } from '@invyce/interfaces';

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
  async xerocallback(@Body() data) {
    try {
      const xero = await this.xeroService.XeroCallback(data.token);

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
  async importDataFromXero(@Body() dto, @Req() req: IRequest) {
    try {
      const xero = await this.xeroService.ImportDataFromXero(dto.modules, req);

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
