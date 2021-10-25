import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AppService } from './app.service';
import { GlobalAuthGuard } from '@invyce/global-auth-guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Post('pdf')
  @UseGuards(GlobalAuthGuard)
  generatePdf(@Body() data, @Req() req: Request) {
    return this.appService.generatePdf(data, req);
  }
}
