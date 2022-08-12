import { Authenticate } from '@invyce/auth-middleware';
import { Module } from '@nestjs/common';
import { CsvController } from './csv.controller';
import { CsvService } from './csv.service';

@Module({
  imports: [],
  controllers: [CsvController],
  providers: [CsvService],
})
export class CsvModule {
  configure(route) {
    route.apply(Authenticate).forRoutes(CsvController);
  }
}
