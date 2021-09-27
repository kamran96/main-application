import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Contact, ContactSchema } from '../Schemas/contact.schema';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { Authenticate } from '@invyce/auth-middleware';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Contact.name, schema: ContactSchema }]),
  ],
  controllers: [ContactController],
  providers: [ContactService, Authenticate],
})
export class ContactModule {}