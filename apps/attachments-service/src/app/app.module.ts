import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Attachment, AttachmentSchema } from '../schemas/attachment.schema';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Authenticate } from '@invyce/auth-middleware';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([
      {
        name: Attachment.name,
        schema: AttachmentSchema,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, Authenticate],
})
export class AppModule {}
