import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as fs from 'fs';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { AttachmentService } from './attachment.service';

@Controller('attachment')
export class AttachmentController {
  constructor(private attachmentService: AttachmentService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req: Request, @Res() res: Response) {
    return await this.attachmentService.fileUpload(req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create-pdf')
  async init(@Body() body, @Req() req: Request): Promise<any> {
    try {
      const pdf = await this.attachmentService.createPdf(body, req);

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
