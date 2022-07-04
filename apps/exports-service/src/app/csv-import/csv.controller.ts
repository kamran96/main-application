import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CsvService } from './csv.service';
import { Request } from 'express';
import { GlobalAuthGuard } from '@invyce/global-auth-guard';

@Controller('csv')
export class CsvController {
  constructor(private csvService: CsvService) {}

  @Post('import')
  @UseGuards(GlobalAuthGuard)
  async importCsv(@Body() body: any, @Req() req: Request) {
    console.log(body);
    return await this.csvService.importCsv(body);
  }
}
