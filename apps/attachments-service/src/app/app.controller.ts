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

import { AppService } from './app.service';
import { GlobalAuthGuard } from '@invyce/global-auth-guard';

@Controller('attachment')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(GlobalAuthGuard)
  @Get('/:id')
  async show(@Param() params) {
    return await this.appService.FindAttachmentById(params.id);
  }

  @UseGuards(GlobalAuthGuard)
  @Post()
  async create(@Req() req: Request, @Res() res: Response) {
    return await this.appService.fileUpload(req, res);
  }

  @UseGuards(GlobalAuthGuard)
  @Post('create-pdf')
  async init(@Body() body, @Req() req: Request): Promise<any> {
    try {
      const pdf = await this.appService.createPdf(body, req);

      console.log('Succesfully created a PDF table');

      return true;
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
