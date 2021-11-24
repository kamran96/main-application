import { Module } from '@nestjs/common';
import { QuickbooksController } from './quickbooks.controller';
import { QuickbooksService } from './quickbooks.service';

@Module({
  imports: [],
  controllers: [QuickbooksController],
  providers: [QuickbooksService],
})
export class QuickbooksModule {}
