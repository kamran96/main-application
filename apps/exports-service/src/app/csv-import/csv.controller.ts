import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { CsvService } from './csv.service';

@Controller()
export class CsvController {
  constructor(private csvService: CsvService) {}

  @Post('import')
  async importCsv(@Req() req: Request, @Res() res: any) {
    return await this.csvService.importCsv(req, res);
  }
}
