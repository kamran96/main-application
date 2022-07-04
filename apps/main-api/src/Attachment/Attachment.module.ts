import { Module } from '@nestjs/common';
import { AttachmentController } from './attachment.controller';
import { AttachmentService } from './attachment.service';
import { EmailModule } from '../Common/modules/email.module';

@Module({
  imports: [EmailModule],
  providers: [AttachmentService],
  controllers: [AttachmentController],
})
export class AttachmentModule {}
