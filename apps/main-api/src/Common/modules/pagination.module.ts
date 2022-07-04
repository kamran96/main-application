import { Module } from '@nestjs/common';
import { Pagination } from '../services/pagination.service';

@Module({
  providers: [Pagination],
  exports: [Pagination],
})
export class PaginationModule {}
