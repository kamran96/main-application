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
import * as path from 'path';
import { Response } from 'express';
import { AppService } from './app.service';
import { GlobalAuthGuard } from '@invyce/global-auth-guard';
import { IRequest } from '@invyce/interfaces';

@Controller('attachment')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  async healthCheck(@Res() res: Response) {
    res.send('OKkkk');
  }

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
  @Post('ids')
  async ListAttachmentByIds(@Body() body) {
    return await this.appService.attachmentByIds(body);
  }

  @UseGuards(GlobalAuthGuard)
  @Post('create-pdf')
  async init(@Body() body, @Req() req: Request): Promise<any> {
    try {
      await this.appService.createPdf(body, req);

      console.log('Succesfully created a PDF table');

      return true;
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @UseGuards(GlobalAuthGuard)
  @Post('generate-pdf')
  async generatePdf(@Body() body, @Req() req: IRequest): Promise<any> {
    const pdf = await this.appService.GeneratePdf(body, req);

    const dist = path.resolve(pdf);

    return await this.appService.uploadPdf(dist, pdf, req);
  }
}
