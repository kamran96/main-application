import {
  Body,
  Controller,
  Get,
  UseGuards,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { CsvService } from './csv.service';
import { GlobalAuthGuard } from '@invyce/global-auth-guard';

@Controller()
export class CsvController {
  constructor(private csvService: CsvService) {}

  @Get()
  getData() {
    return this.csvService.getData();
  }

  @Post('import')
  @UseGuards(GlobalAuthGuard)
  async importCsv(@Req() req: Request, @Res() res: any) {
    console.log('hereajdsoif');
    return await this.csvService.importCsv(req, res);
  }
}
