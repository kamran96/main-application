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
} from '@nestjs/common';
import * as path from 'path';
import { Response } from 'express';
import { AttachmentService } from './attachment.service';
import { IRequest } from '@invyce/interfaces';

@Controller('attachment')
export class AppController {
  constructor(private readonly attachmentService: AttachmentService) {}

  @Get('health')
  async healthCheck(@Res() res: Response) {
    res.send('OKkkk');
  }

  @Get('/:id')
  async show(@Param() params) {
    return await this.attachmentService.FindAttachmentById(params.id);
  }

  @Post()
  async create(@Req() req: Request, @Res() res: Response) {
    return await this.attachmentService.fileUpload(req, res);
  }

  @Post('ids')
  async ListAttachmentByIds(@Body() body) {
    return await this.attachmentService.attachmentByIds(body);
  }

  @Post('create-pdf')
  async init(@Body() body, @Req() req: Request): Promise<any> {
    try {
      await this.attachmentService.createPdf(body, req);

      console.log('Succesfully created a PDF table');

      return true;
    } catch (error) {
      throw new HttpException(
        `Sorry! Something went wrong, ${error.message}`,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('generate-pdf')
  async generatePdf(@Body() body, @Req() req: IRequest): Promise<any> {
    const pdf = await this.attachmentService.GeneratePdf(body, req);

    const dist = path.resolve(pdf);

    return await this.attachmentService.uploadPdf(dist, pdf, req);
  }
}
