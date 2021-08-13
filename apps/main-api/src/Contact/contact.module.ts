import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { EmailModule } from '../Common/modules/email.module';
import { PaginationModule } from '../Common/modules/pagination.module';
import { PdfModule } from '../Common/modules/pdf.module';

@Module({
  imports: [PaginationModule, EmailModule, PdfModule],
  providers: [ContactService],
  controllers: [ContactController],
})
export class ContactModule {}
