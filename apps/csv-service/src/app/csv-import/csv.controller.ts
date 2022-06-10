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

@Controller('csv')
export class CsvController {
  constructor(private csvService: CsvService) {}

  @Post('import')
  @UseGuards(GlobalAuthGuard)
  async importCsv(@Req() req: Request, @Res() res: any) {
    return await this.csvService.importCsv(req, res);
  }
}
