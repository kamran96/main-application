import { Module } from '@nestjs/common';
import { EmailController } from '../controllers/email.controllers';
import { EmailService } from '../services/email.service';

@Module({
  imports: [],
  providers: [EmailService],
  controllers: [EmailController],
})
export class EmailModule {}
