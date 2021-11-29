import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GlobalAuthGuard } from '@invyce/global-auth-guard';
import { IRequest } from '@invyce/interfaces';
import { QuickbooksService } from './quickbooks.service';

@Controller('quickbooks')
export class QuickbooksController {
  constructor(private quickbooksService: QuickbooksService) {}

  @Post()
  @UseGuards(GlobalAuthGuard)
  async quickbooksConnect() {
    const qucikbooks = await this.quickbooksService.QuickbooksConnect();

    if (qucikbooks) {
      return {
        message: 'Quickbook connected sucessfully',
        result: qucikbooks,
        status: 1,
      };
    }
  }

  @UseGuards(GlobalAuthGuard)
  @Post('verify')
  async quickbooksVerify(@Body() body) {
    try {
      const qucikbooks = await this.quickbooksService.QuickbooksVerify(
        body.token
      );

      if (qucikbooks) {
        return {
          message: 'Quickbook connected sucessfully',
          result: qucikbooks,
          status: 1,
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
  @Post('/fetch-from-quickbooks')
  async getQuickbooksData(@Req() req: IRequest, @Body() body) {
    const qucikbooks = await this.quickbooksService.GetQuickbooksData(
      req,
      body.modules
    );

    if (qucikbooks) {
      return {
        message: 'Quickbook connected sucessfully',
        result: qucikbooks,
        status: 1,
      };
    }
  }
}
