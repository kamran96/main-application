import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';

@Module({
  imports: [],
  providers: [ReportService],
  controllers: [ReportController],
})
export class ReportModule {}
