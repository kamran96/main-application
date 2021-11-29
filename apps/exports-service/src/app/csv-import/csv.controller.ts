import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CsvService } from './csv.service';
import { GlobalAuthGuard } from '@invyce/global-auth-guard';

@Controller('csv')
export class CsvController {
  constructor(private csvService: CsvService) {}

  @Post('import')
  @UseGuards(GlobalAuthGuard)
  async importCsv(@Body() body: any) {
    console.log(body);
    return await this.csvService.importCsv();
  }
}
