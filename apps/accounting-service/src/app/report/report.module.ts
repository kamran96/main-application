import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { Authenticate } from '@invyce/auth-middleware';

@Module({
  imports: [],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {
  configure(route) {
    route.apply(Authenticate).forRoutes(ReportController);
  }
}
