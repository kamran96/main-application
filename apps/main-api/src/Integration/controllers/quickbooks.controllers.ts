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
import { JwtAuthGuard } from '../../jwt-auth.guard';
import { QuickbooksService } from '../services/quickbooks.service';

@Controller('quickbooks')
export class QuickbooksController {
  constructor(private quickbooksService: QuickbooksService) {}

  @Post()
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

  @Post('test')
  async test() {
    await this.quickbooksService.test();
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify')
  async quickbooksVerify(@Body() body, @Req() req: Request) {
    try {
      const qucikbooks = await this.quickbooksService.QuickbooksVerify(
        body.token,
        req.user
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

  @UseGuards(JwtAuthGuard)
  @Post('/fetch-data')
  async getQuickbooksData(@Req() req: Request, @Body() body) {
    const qucikbooks = await this.quickbooksService.GetQuickbooksData(
      req.user,
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
