import { Module } from '@nestjs/common';
import { QuickbooksController } from '../controllers/quickbooks.controllers';
import { QuickbooksService } from '../services/quickbooks.service';

@Module({
  imports: [],
  providers: [QuickbooksService],
  controllers: [QuickbooksController],
})
export class QuickbooksModule {}
