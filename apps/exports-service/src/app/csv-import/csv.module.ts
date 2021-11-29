import { Module } from '@nestjs/common';
import { CsvController } from './csv.controller';
import { CsvService } from './csv.service';

@Module({
  imports: [],
  controllers: [CsvController],
  providers: [CsvService],
})
export class CsvModule {}
