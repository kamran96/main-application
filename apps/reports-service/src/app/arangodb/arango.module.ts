import { Module } from '@nestjs/common';
import { ArrangoDBService } from './arango.service';

@Module({
  providers: [ArrangoDBService],
  exports: [ArrangoDBService],
})
export class ArrangoDBModule {}
