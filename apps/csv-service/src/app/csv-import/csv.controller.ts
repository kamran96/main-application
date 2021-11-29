import { Body, Controller, Get, UseGuards } from '@nestjs/common';
import { CsvService } from './csv.service';
import { GlobalAuthGuard } from '@invyce/global-auth-guard';

@Controller('csv')
export class CsvController {
  constructor(private csvService: CsvService) {}

  @Get('import')
  @UseGuards(GlobalAuthGuard)
  async importCsv(@Body() body: any) {
    console.log(body);
    return await this.csvService.importCsv();
  }
}
